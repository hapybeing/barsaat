# Barsaat v3 — Technical Research: scroll-driven cinematic monsoon site

Target: static site on GitHub Pages, Vite + TypeScript, no backend. Primary test device: Android tablet (Xiaomi Pad 6, Snapdragon 870 / Adreno 650 class GPU, 2880×1800, DPR ≈ 2) in Brave (Chromium engine). Researched 2026-10-17.

Legend: **[src]** = page I opened and read; **[search]** = verified from search excerpt / official docs index only. Licences are flagged where they matter.

---

## 0. TL;DR for the build

- One fixed, full-viewport `<canvas>` (three.js `WebGLRenderer`, WebGL2) behind normal DOM chapters. DOM owns text, layout, accessibility; GL owns sky, rain, glass, water, transitions.
- **One clock**: GSAP's ticker drives Lenis, ScrollTrigger and the three.js render. Never let Lenis and the renderer own separate rAF loops (causes a 1-frame GL lag on fast scroll — documented by HAOQI.DESIGN).
- Each chapter = pinned `ScrollTrigger` with `scrub`, writing into a single `story` state object (`progress`, `rain`, `storm`, `lightning`, `wetness`, `fog`, `chapterIndex`). GL shaders read uniforms from that object only.
- Rain stack: (1) procedural glass drops in screen space (Heartfelt-style grid drops, **re-implemented**, not copied — Heartfelt is CC BY-NC-SA), (2) half-res streak pass, (3) analytic ripples in puddles (Zavie-style cell ripples), (4) layered-noise clouds (not full raymarch) + lightning flash + fog, all composed in **one** post pass at reduced resolution.
- Text: DOM + Google Fonts Devanagari variable faces (Anek Devanagari / Noto Serif Devanagari / Tiro Devanagari Hindi), split with GSAP SplitText (now free; uses `Intl.Segmenter`) or a 20-line `Intl.Segmenter` splitter. Do **not** put Hindi in troika-three-text (no Indic shaping).
- Audio: fully synthesized Web Audio graph, started from an explicit "Enter with sound / Enter silently" gate; generated convolution IR; Karplus–Strong tanpura; noise-band rain; Farnell-style thunder. AnalyserNode feeds GL.
- Perf: GPU tier (`@pmndrs/detect-gpu`, self-host benchmarks) → quality preset; DPR cap 1.5 on tablets (1.0 for post passes), half-res effect buffers, adaptive DPR on frame-time, KTX2 only if textures > ~4 MB; Playwright + SwiftShader smoke tests in CI.

---

## 1. Scroll-driven storytelling architecture

### 1.1 Lenis + GSAP ScrollTrigger, single loop

The official Lenis README integration (current 1.3.x) **[search: npm/GitHub README]**:

```ts
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({ autoRaf: false, anchors: true })   // GSAP drives it
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))             // ticker is seconds, Lenis wants ms
gsap.ticker.lagSmoothing(0)
```
Source: https://github.com/darkroomengineering/lenis/blob/main/README.md

Then render GL in the **same** ticker, after Lenis has advanced:

```ts
gsap.ticker.add(() => {
  const y = lenis.scroll           // the value the DOM just used
  world.update(y, story)           // uniforms only, no allocations
  renderer.render(scene, camera)
})
```

Why it matters: HAOQI.DESIGN (Awwwards SOTD, 2026) found that when Lenis and R3F each had a `requestAnimationFrame` loop and GL read `window.scrollY`, fast scrolls showed a consistent one-frame GL lag; the fix was one frame loop plus a "ScrollBus" snapshot that every GL consumer reads **[src]** https://tympanus.net/codrops/2026/08/15/inside-haoqi-design-letting-dom-and-webgl-share-a-retro-futurist-stage . Trionn (Codrops, July 2026) also drives Lenis from `gsap.ticker` and renders WebGL from ScrollTrigger `onUpdate` + an on-demand ticker that only runs while a section is within one viewport **[src]** https://tympanus.net/codrops/2026/07/15/the-architecture-behind-trionn-coordinating-gsap-three-js-lenis-and-web-audio/

### 1.2 Mobile / tablet scroll: keep it native

- Lenis defaults to `syncTouch: false`, meaning touch devices scroll **natively** and Lenis only smooths wheel input; `syncTouch` "can be unstable on iOS<16" **[search: README options table]**. On the Android tablet this gives real momentum scrolling, which is what "native-feeling" means.
- PX PUSH (Codrops 2026) disables Lenis outright on mobile and ticks it manually on the GSAP clock on desktop **[search]** https://tympanus.net/codrops/2026/08/07/the-department-is-open-building-the-px-push-website . GSAP staff advise avoiding smooth scrolling on mobile unless heavy pinning/WebGL sync needs it, and treating `normalizeScroll` as a last resort **[search]** GSAP forum.
- `ScrollTrigger.config({ ignoreMobileResize: true })` is default-true since 3.12.5 (ScrollTrigger now measures 100vh, not innerHeight), so address-bar show/hide doesn't trigger expensive refreshes **[search]** https://github.com/greensock/GSAP/commit/f836a3f0002d6ea00f456a461c7e2976e0ec3f38
- Use `100svh`/`100lvh` for pinned panels and size the canvas from `visualViewport`/`ResizeObserver`, not `innerHeight`, so the address bar never stretches GL.
- With native touch scroll, GL still stays in sync because we read `lenis.scroll` (which mirrors native scroll) in the same tick that ScrollTrigger updates.

### 1.3 Pinned chapters with scrubbed master timelines

```ts
const story = { rain: 0, storm: 0, flash: 0, wet: 0, fog: 0.2, ch: 0 }

chapters.forEach((el, i) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el, start: 'top top', end: '+=250%',
      pin: true, scrub: 0.8,                  // numeric scrub = eased catch-up
      onToggle: s => s.isActive && setChapter(i),
    },
  })
  tl.to(story, { rain: 0.7, wet: 0.5, ease: 'none' }, 0)
    .from(el.querySelectorAll('.line'), { yPercent: 110, stagger: .08 }, 0.1)
    .to(story, { storm: 1, ease: 'power2.in' }, 0.5)
})
```
Pattern notes:
- Animate **plain numbers** in a state object; GL copies them to uniforms each frame (Trionn's `scrollProgressRef` → derived sub-ranges approach is the same idea **[src]**).
- Use timeline **labels** per beat; build `onUpdate` mappers like `remap(progress, 0.35, 0.53)` for GL-only events.
- One-shot events (lightning strike, thunder) shouldn't be scrubbed: fire via `onEnter`/`onEnterBack` callbacks or when `progress` crosses a threshold, with a cooldown so scrubbing back and forth doesn't machine-gun them.
- Trionn preloads image sequences in `requestIdleCallback` chunks with `img.decode()` and calls `renderer.compile(scene, cam)` + a hidden render to "warm up" shaders before a section appears **[src]** — copy both ideas (shader compile hitches are very visible on Adreno).

### 1.4 Syncing DOM text with GL scenes

- Two proven approaches **[src HAOQI]**: (a) GL objects mirror DOM placeholders by reading `getBoundingClientRect()` — HAOQI caches rects, shifts them by scroll delta each frame, re-measures only near-viewport elements every frame and distant ones every 12 frames; (b) write the rect into a `uRect` uniform on a fullscreen quad and convert screen UV → element-local UV in the shader (no geometry moves). (b) is ideal for "text revealed through rain" masks.
- For text masks in GL, render the DOM heading into a **canvas texture** once (document.fonts.ready → `ctx.fillText` with the same font) — the browser's HarfBuzz shapes Devanagari correctly in Canvas2D, unlike SDF text libraries. Use that texture as a mask/height map in shaders.
- Codrops 2024 "Distortion and grain on scroll" explains syncing HTML images with WebGL planes using scroll velocity → uniform **[search]** https://tympanus.net/codrops/2024/07/18/how-to-create-distortion-and-grain-effects-on-scroll-with-shaders-in-three-js/
- Scroll velocity → shader: HAOQI's fast-attack/slow-release smoother (tau 0.025 s up, 0.175 s down, clamp dt) avoids trackpad jitter **[src]**. Use velocity to lean rain streaks and blur glass.

### 1.5 History / hash chapter navigation

- Give each chapter `id="ch-aashadh"` etc. and a real `<nav>` of `<a href="#ch-…">`. Lenis `anchors: true` handles click-to-scroll with options (`offset`, `duration`, `onComplete`) and decodes URL-encoded hashes (useful if ids are Devanagari) **[search: lenis.ts source]**.
- On chapter enter, `history.replaceState(null, '', '#ch-x')` (replace, not push, to avoid polluting back button during scroll). On load, if `location.hash`, call `lenis.scrollTo(hash, { immediate: true })` after `ScrollTrigger.refresh()` so pin spacers exist first.
- GitHub Pages serves one `index.html`; hash routing needs no server config.

### 1.6 Reduced motion and fallbacks

- `gsap.matchMedia()` with `reduceMotion: '(prefers-reduced-motion: reduce)'` — set `duration: 0` / skip pins and scrubs in that branch; GSAP auto-reverts branches when queries change **[search]** https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
- Reduced-motion profile for Barsaat: no pinning (plain sections), Lenis off, rain as a **static** rendered still or very slow drift, no lightning flashes (photosensitivity — WCAG 2.3.1 "three flashes" also argues for capping lightning to ≤ 3 flashes/second and keeping flashes small/desaturated for everyone), crossfades instead of displacement transitions. HAOQI skips its entrance shader under reduced motion; Trionn slows rather than stops idle rotation **[src]**.
- No-WebGL fallback (detect-gpu tier 0 or context creation fail): CSS gradient sky + pre-rendered poster images per chapter (`<picture>` AVIF/WebP), same DOM story. Handle `webglcontextlost` (Android kills contexts under memory pressure): show poster, try restore on `webglcontextrestored`.

---

## 2. Real-time rain / water visuals in GLSL

### 2.1 Raindrops on glass (the hero effect)

**Heartfelt (BigWings / Martijn Steinrucken, 2017)** https://www.shadertoy.com/view/ltffzl — licence **CC BY-NC-SA 3.0** → study, don't paste into a public project; re-derive. Structure, from the source **[src: mirror https://github.com/sanxincao/shadertoy/blob/master/heartfelt.glsl]**:
- `DropLayer2(uv,t)`: scrolls UV, divides into a grid (`a = vec2(6,1)`, grid = a*2), per-column random offset, per-cell hash `N13`. One drop per cell → cost independent of drop count. Drop x wiggles with `sin(y+sin(y))`; y follows a `Saw(.85, fract(t+n.z))` (slow stick, sudden slide). Trail = `smoothstep` on |x − dropX| above the drop; small droplets left behind via `fract(y*10)` cells.
- `StaticDrops`: a 40× grid of tiny fading beads.
- `Drops()` sums static + two DropLayers (second at uv*1.85) and returns `(mask, trail)`.
- Normals: either 2 extra evaluations (finite difference, "expensive normals") or `dFdx/dFdy` ("3× cheaper, 2× shittier"). **Use dFdx on mobile.**
- Fog/blur: `focus = mix(maxBlur - trail, minBlur, smoothstep(.1,.2,drop))` then sample a **mip level** (`textureLod`) of the background → drops are sharp lenses, glass between them is blurry, trails clear the fog. That mip trick is why it's cheap: blur comes free from mipmaps.

**Codrops "Rain & Water Effect Experiments" (Lucas Bebber, 2015)** **[search]** https://tympanus.net/codrops/2015/11/04/rain-water-effect-experiments · repo https://github.com/codrops/RainEffect (licence: free to use in projects, no as-is redistribution). Different architecture: drops are simulated on a **Canvas2D** with physics (merge, trail, gravity), drawn as sprites whose **RG encode refraction offset, B = thickness, A = gooey alpha**; the WebGL shader samples a small blurred background for the glass and an in-focus texture through drops (`water.frag`: `refractionPos = texCoord + pixel()*refraction*(minRefraction + d*refractionDelta)`), plus shine and shadow. Pros: physically believable merging, interactive (wipe with finger). Cons: CPU physics + texture upload each frame.
Modern optimized take: `raindrop-fx` (WebGL2) https://github.com/SardineFish/raindrop-fx ; WebGPU port of Heartfelt https://github.com/jeantimex/raindrop ; explainer https://radiant-shaders.com/learn/rain-on-glass

**Recommendation:** procedural grid drops (Heartfelt-style math written fresh) at **half resolution** into a "water map" RT (RG = normal, B = trail/fog-clear, A = mask), upsample in the composite pass. Add **fog-on-glass as a persistent ping-pong buffer**: each frame `fog = min(1, fog + condense*dt) - trailMask - fingerWipe`, so the user can write in fog (carry over from v1 concept) and drops cut lasting trails.

### 2.2 Rain streaks (falling rain)

- **Screen-space post streaks** (cheapest): rotate & anisotropically scale screen UV (large x, small y), take `fract` cells, draw one streak per cell with `smoothstep`, animate and flicker; two or three layers at different scales for parallax. This is exactly how "Crafting Nature Beyond Technology" (Codrops Dec 2025) did rain streaks + lens drops in a post pass **[search]** https://tympanus.net/codrops/2025/12/04/crafting-nature-beyond-technology-a-project-from-roots-to-leaves
- **World-space instanced quads** (more depth): allocate N billboard quads once, fall in the vertex shader with `mod()` wrap, tilt by wind uniform, alpha from a soft streak texture or SDF capsule; one draw call, `frustumCulled = false` **[search]** https://adrian-dev.fr/en/posts/rain-shader-threejs/ , https://github.com/frmlinn/raindrops-v2 . NVIDIA's 2007 Rain whitepaper (Tariq) remains the reference for streak appearance and stretching by velocity **[search]** https://developer.download.nvidia.com/SDK/10/direct3d/Source/rain/doc/RainSDKWhitePaper.pdf
- three.js has a WebGPU compute rain example with ripple contact (`webgpu_compute_particles_rain`) **[search]** — good reference, but target WebGL2 for Brave-on-Android reliability.
- Budget: 2–6k instanced streaks on tier 2, screen-space only on tier 1.

### 2.3 Ripples and puddles

- **Analytic cell ripples** — Zavie's "Rainier mood" / ripple shader (https://www.shadertoy.com/view/ldfyzl, from Ctrl-Alt-Test's 64k intro "H – Immersion"): grid cells, each spawns a ring on its own time cycle, loop over neighbouring cells within `MAX_RADIUS`, sum ring derivatives into a normal, refract the background and add a specular term **[search: Godot port https://godotshaders.com/shader/rainier-mood/]**. No buffers, no simulation — ideal for a river/ghat surface.
- **Simulated ripples** (finger touches on water): 2D wave equation in a ping-pong RT (Shadertoy "Physical Water Ripples" uses Buffer A) at 256² or 512²; only on tier ≥ 2.
- Puddle masks: noise threshold on ground UVs → mask gates roughness, ripple normals and reflection (Unity Production Ready Shaders "Puddles/RainRipples" subgraph design: 4 ripple instances with different scale/offset/timing combined) **[search]** https://docs.unity3d.com/Packages/com.unity.shadergraph@17.4/manual/Shader-Graph-Sample-Production-Ready-Detail.html ; Cyanilux rain breakdown https://www.cyanilux.com/tutorials/rain-effects-breakdown

### 2.4 Reflections and wet surfaces

- Full SSR is expensive and needs depth+normal buffers. For a 2.5D/photo-plate scene, **fake it**: mirror the sky/scene texture vertically below the horizon line, distort by ripple normals, fade with Fresnel and a roughness blur via mip `textureLod`. That's "planar reflection without a second camera".
- If there is true 3D geometry (ghat steps, boats), three.js `Reflector` at half res for the river only.
- Wet look = darken albedo (×0.5–0.7), lower roughness, boost specular, puddles where mask > threshold (DriftEngine notes a little roughness so puddle edges blend into dry road) **[search]** https://driftengine.dev/docs/rendering/wet-surfaces . Drive `uWet` from scroll.

### 2.5 Clouds, sky, mist, lightning

- **Raymarched volumetric clouds** (Maxime Heckel, "Real-time dreamy cloudscapes", 2023) give the best look: density from FBM, Beer's law, Henyey–Greenstein phase, light marching, blue-noise dithered start offsets to cut steps **[search]** https://blog.maximeheckel.com/posts/real-time-cloudscapes-with-volumetric-raymarching/ . On a mobile tablet this needs: 1/4-res buffer, ≤ 32 steps, 3D noise baked into a small `Data3DTexture` (32³–64³) instead of computing noise, temporal reprojection. Realistic only for tier 3.
- **Layered 2D noise clouds** (recommended default): 3–5 parallax layers of domain-warped FBM (`f = fbm(q + 1.4*fbm(q2 + …))`, Trionn's footer fog uses exactly this **[src]**), each with its own scroll speed, lit by a fake light direction (sample density offset toward the sun, darken = cheap self-shadow), plus "storm deck" darkening. One fullscreen pass, half res. Upgrade path: swap the cloud layer for raymarch on tier 3.
- **Sky gradients for monsoon**: author as 1D LUT textures per beat (pre-monsoon haze ochre → bruised violet-grey → slate-teal downpour → post-rain gold/clear blue → night indigo), crossfade by `story.storm`. Maxime's "On Rendering the Sky, Sunsets, and Planets" (May 2026) covers physical atmospheric scattering if wanted **[search]** https://blog.maximeheckel.com/posts/on-rendering-the-sky-sunsets-and-planets/
- **Mist/fog**: exponential height fog in the composite (depth from a hand-painted depth map for photo plates), plus 2–3 large soft noise "mist sheets" scrolling horizontally. Maxime's volumetric lighting post (June 2025) for god-rays through breaking clouds **[search]**.
- **Lightning**: (a) bolt geometry from recursive midpoint displacement generated on CPU once per strike, rendered as a few layered `THREE.Line`/ribbon meshes for core + glow (Trionn layered lines instead of a bloom pass **[src]**; CK42BB procedural-weather uses midpoint displacement + glow + PointLight flash **[search]** https://github.com/CK42BB/procedural-weather-threejs ); (b) the **flash** matters more than the bolt: a Poisson-timed envelope (≈40 ms rise, exponential decay, 2–3 re-strokes) that lights cloud layers from inside weighted by distance to the strike and cloud thickness (Originkit storm description **[search]** https://www.originkit.dev/components/cloud-sky/04 ). Same envelope triggers thunder with a distance delay (`delay = distance_km × 3 s`).

### 2.6 Making it cheap enough for mobile

- **Render-target budget** (Adreno-friendly): scene/plate at DPR ≤ 1.5; effects (water map, streaks, clouds, fog) at 0.5× or 0.25×; one final composite at full canvas res. Half-res post is the single biggest win (HAOQI renders its star-filter pass at half res, refreshing every other frame, and turns the pass off when its section is off-screen **[src]**).
- **Ping-pong** only where state persists (fog-on-glass, wave sim). Use `HalfFloatType` RTs, `LinearFilter`, no MSAA on RTs.
- **Bake**: noise into textures (2D tileable FBM 512², blue-noise 64²), sky LUTs, depth maps, lightning paths. Use `textureLod` mips for blur instead of separable blur passes.
- **Update throttling**: clouds can update at 30 Hz and be interpolated; fog buffer at 30 Hz; static frames when user isn't scrolling and rain is light (render-on-demand, Trionn-style).
- Avoid `discard` in big fullscreen passes and dependent texture reads chains > 3 on low tiers; prefer `mediump` where precision allows (but keep `highp` for time-based hashes — use `mod(time, 1000.)` to avoid precision decay).

---

## 3. Image / photo-based WebGL techniques

### 3.1 Displacement transitions
- Robin Delaporte's hover-effect (Codrops 2018): two images + a grayscale displacement map; `uv1 = uv + progress*disp*intensity`, `uv2 = uv - (1-progress)*disp*intensity`, mix by progress **[search]** https://tympanus.net/codrops/2018/04/10/webgl-distortion-hover-effects/ ; MIT GLSL form at gl-transitions "displacement" https://gl-transitions.com/editor/displacement . Use a **water/ink-bleed displacement map** for chapter cuts, scrubbed by ScrollTrigger progress.
- Yuri Artiukh's "Creative WebGL Image Transitions" (2019) for warp variations **[search]**; Codrops Liquid Distortion slideshow (Pixi displacement filter) **[search]**.
- Flowmap (Robin Delaporte, OGL 2019): mouse velocity painted into a decaying ping-pong flowmap texture → UV distortion; perfect for "finger through water" on the touch screen **[search]** https://github.com/robin-dela/flowmap-effect

### 3.2 Liquid distortion on scroll
- Uniform `uVelocity` from Lenis (`lenis.velocity`) smoothed (see §1.4); distort UV with `sin(uv.y*k + t)*velocity` and add chromatic offset proportional to velocity; cap with `min()` (Codrops 2024 grain-on-scroll does this) **[search]**.

### 3.3 Depth-map parallax (2.5D from one image)
- Codrops "Fake 3D image effect" (akella, 2019): `uv + (depth - 0.5) * mouse / threshold`, mirrored wrap to hide edges **[search]** https://tympanus.net/codrops/2019/02/20/how-to-create-a-fake-3d-image-effect-with-webgl ; on tablet drive it with **scroll progress + DeviceOrientation** (needs permission on iOS, not Android Chrome).
- Generate depth maps offline with Depth Anything (v2/v3) / MiDaS; the depth map quality is "the whole ballgame" **[search]** https://www.sygnal.com/kb/image-25d-parallax-effects . Codrops Aug 2026 "Relighting Images with Depth Maps" derives normals from depth and ray-steps toward a light for self-shadowing → use it for **lightning relighting the photo plate** **[search]** https://tympanus.net/codrops/2026/08/19/relighting-images-with-depth-maps-and-three-js
- Better quality than UV-shift: displace a subdivided plane (e.g. 256×144 segments) by depth in the vertex shader and move the camera slightly (flo-bit/image2fake3d approach **[search]**) — gives real occlusion edges; mask stretched edges with fog.
- Trionn's lion: depth-scaled displacement + small RGB split proportional to displacement + "breathing" idle motion **[src]**.

### 3.4 Painterly / ink-wash
- Kuwahara filter is the core of painterly shaders. Maxime Heckel "On Crafting Painterly Shaders" (Oct 2024) walks basic → generalized → anisotropic Kuwahara with structure tensor **[search]** https://blog.maximeheckel.com/posts/on-crafting-painterly-shaders . Cost ≈ `radius × sectors × 3` samples per pixel (react-postprocessing docs) **[search]** https://react-postprocessing.docs.pmnd.rs/effects/kuwahara → run at **half res, radius 3–4, 4–6 sectors** on tablet, or bake painterly treatment into the plate offline and use the shader only for transitions.
- Ink-wash/watercolour recipe: Kuwahara → edge darkening (Sobel on luminance, multiply) → pigment granulation (noise × paper height) → wet-edge bleed (domain-warp UV by noise near edges) → paper texture multiply. Blender community ink-wash comp uses the same chain **[search]**.
- Paper/grain: procedural tileable grain texture (generate once on a canvas), multiply in final pass; animate grain offset at 12–24 fps for a film feel.

### 3.5 Cheap bloom / chromatic aberration
- Skip three's `UnrealBloomPass` on mobile (multiple mip passes at full res). Do: threshold → downsample to 1/4 → one 9-tap blur → add, all inside the composite. Or fake glow with layered geometry (Trionn) **[src]**.
- Chromatic aberration: 3 texture taps offset radially by `uCA * length(uv-0.5)`, only in the composite.
- Merge everything (water map refraction, fog, CA, grain, vignette, tone map, LUT grade) into **one** final `ShaderMaterial` pass instead of an EffectComposer chain — each extra full-res pass costs ~1–3 ms on a mid Adreno.

---

## 4. Kinetic typography: Devanagari + Latin

### 4.1 Free fonts (Google Fonts, OFL)
- **Anek Devanagari** (Ek Type, 2022) — variable `wght 100–800` + `wdth` axes; 40 styles; Devanagari + Latin; display-capable, condensed↔expanded **[search]** https://fonts.google.com/specimen/Anek+Devanagari , https://ektype.in/anek-devanagari.html . Best candidate for kinetic headline animation (animate `font-variation-settings: 'wdth'` and `'wght'` with scroll/rain intensity).
- **Noto Serif Devanagari** — variable `wght` + `wdth`, 871 glyphs, modulated serif; elegant for poetry lines **[search]** https://fonts.google.com/noto/specimen/Noto+Serif+Devanagari
- **Tiro Devanagari Hindi** (Tiro Typeworks, Hudson/Ross) — static, highly literary; for kavita quotes **[search]**.
- **Baloo 2** (variable wght), **Mukta**, **Hind** (text), **Rozha One**, **Yatra One** (display, static) **[search]** https://fontsource.org/languages/devanagari
- Self-host via Fontsource (`@fontsource-variable/anek-devanagari`) so Vite bundles subsets; preload the display face; `font-display: swap`; subset Latin+Devanagari only.

### 4.2 Splitting Devanagari safely
- Naive `.split('')` breaks matras/conjuncts. `Intl.Segmenter('hi', {granularity:'grapheme'})` gives extended grapheme clusters. Since **Unicode 15.1 (rule GB9c)**, conjuncts linked by virama in Devanagari, Bengali, Gujarati, Oriya, Telugu, Malayalam stay one cluster, and Blink/Gecko/WebKit implement it **[search]** https://github.com/w3c/iip/issues/87 , https://www.w3.org/International/questions/qa-indic-graphemes . So in current Chromium/Brave, `क्षि` is one segment. (Older libraries like `grapheme-splitter`/`graphemer` split it wrongly **[search]**.)
- GSAP's SplitText rewrite (3.13+, now free) uses `Intl.Segmenter` for chars with a RegExp fallback, adds aria-label/aria-hidden, `autoSplit` re-splitting on font load/resize, and masking for reveals **[src]** https://webflow.com/blog/gsap-splittext-rewrite , https://gsap.com/blog/3-13/
- **Caveat that matters visually:** even with correct clusters, wrapping each cluster in its own `inline-block` span **breaks the shirorekha (headline bar) joins** and can break shaping across span boundaries (reph, i-matra reordering is fine inside a cluster, but kerning/joins between clusters are lost). Rule: animate Devanagari **by word or by line**, or by cluster only with `display:inline` + opacity/filter (no transforms), or use masks/clip-path that sweep across intact words. Latin can go per-char.
- Minimal splitter:
```ts
const seg = new Intl.Segmenter('hi', { granularity: 'word' })
function splitWords(el: HTMLElement) {
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text)
  el.textContent = ''
  for (const { segment, isWordLike } of seg.segment(text)) {
    const s = document.createElement('span')
    s.textContent = segment
    s.setAttribute('aria-hidden', 'true')
    if (isWordLike) s.className = 'w'
    el.append(s)
  }
}
```

### 4.3 Text revealed through rain / water
- **DOM route (crisp, accessible):** CSS `mask-image` from a canvas the GL also uses — render the fog/water map to a small 2D canvas each frame (or `canvas.toDataURL` is too slow; instead put the text **behind** the WebGL canvas and make GL output alpha = "clear glass" so text shows where drops/wipes are). Cleanest: DOM text layer *under* a transparent WebGL glass layer (`premultipliedAlpha: true`, `alpha: true`); fog is painted by GL; text is visible through drops and wipe trails. Pointer events pass through to DOM.
- **GL route:** text rasterized to a canvas texture (correct Devanagari shaping by the browser), used as (a) a height field so rain "beads" along letterforms, (b) a mask for ink bleeding in water (advect the text texture through a flowmap), (c) a reflection in puddles.
- HAOQI's "ScrambleLines" decode effect shares one 40 ms ticker and subscribes only while visible **[src]** — same pattern for a "rain-typing" Devanagari reveal (cycle through random aksharas → settle). Use word granularity for Hindi.

### 4.4 SDF text in WebGL (troika-three-text) — caveats
- troika-three-text parses fonts with Typr, generates SDF glyph atlases in a worker, supports kerning, ligature substitution, bidi and Arabic joining **[search]** https://protectwise.github.io/troika/troika-three-text/ — but **no full OpenType Indic shaping engine**. A three.js-forum report shows Devanagari (`दिव्या`) and Gurmukhi rendering incorrectly (conjuncts/matras) **[search]** https://discourse.threejs.org/t/troika-3d-text-library-for-sdf-text-rendering/15111/32 . Also: nonzero letter-spacing and per-char meshes defeat ligatures (issue #349).
- If true 3D Devanagari geometry is required, `three-text` (countertype) uses **harfbuzzjs** (WASM) for shaping **[search]** https://github.com/countertype/three-text — heavier but correct. Otherwise rasterize via Canvas2D (browser HarfBuzz) and use as texture/MSDF generated offline.
- Verdict: Latin SDF via troika is fine; Hindi stays DOM or Canvas2D texture.

---

## 5. Generative audio with Web Audio

### 5.1 Unlock & UX
- Autoplay policy: create/resume `AudioContext` inside a user gesture; contexts created earlier start `suspended`; Chrome auto-resumes when `start()` is called on a source after activation **[search]** https://developer.chrome.com/blog/web-audio-autoplay , https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
- UX norm on award sites: an intro gate "Enter with sound (headphones recommended) / Enter without sound" (24ways cites 86andahalfyears.com) **[search]** https://24ways.org/2018/how-to-use-audio-on-the-web ; persistent, clearly labelled toggle, state remembered in `sessionStorage`, experience complete with sound off **[search]** https://www.ashortjourney.com/notes/sound-without-autoplay/ . WCAG 1.4.2 requires a pause/stop or independent volume for audio > 3 s **[search]**.
- Suspend the context on `visibilitychange` hidden; fade master gain over 300 ms on toggle (never hard-cut — clicks).

### 5.2 Rain bed (procedural)
- Farnell, *Designing Sound* (MIT Press 2010) Practical 15 "Rain": Gaussian-distributed parabolic pulses (drops) exciting noise bands, plus entrained-bubble droplets and drop signatures on a glass lamina for "rain on window" **[search]** https://aspress.co.uk/sd/practical15.html
- Web Audio recipe:
  1. **Bed**: 2-channel looping white-noise `AudioBuffer` (generate 4 s) → bandpass ~800–3 kHz + lowpass ~6 kHz, slow LFO on cutoff; second layer pink/brown noise lowpassed ~400 Hz for "roar" in heavy rain. Gains driven by `story.rain`.
  2. **Drops**: an `AudioWorkletProcessor` emitting Poisson-timed short decaying sine "plinks" (bubble resonance: freq 1–4 kHz with fast upward chirp, 5–20 ms) and filtered noise ticks; density ∝ rain intensity; random stereo pan. AudioWorklet avoids main-thread jitter.
  3. **Surface variants**: glass taps (bright, short), leaves (softer, HP noise), river (low gurgle bubbles) crossfaded per chapter.
- Library reference: `noised` (TS, Web Audio rain + thunder generators) https://github.com/stargazingdave/noised **[search]**; Faust→WASM Farnell demos https://github.com/materializepath/designing-sound-experiments **[search]**.

### 5.3 Thunder
- Farnell Practical 17: layered "castle thunder" — four subtractive bands (high crash, middle, mid-low rumble, sub-boom), N-wave strike, multi-tap delays and reverbs modelling environment, distance filter **[search]** https://aspress.co.uk/sd/practical17.html ; MIT OCW lecture dissects the patch (strike generator, distance filter, deep noise, reflections) **[search]**.
- Web Audio: on strike, schedule (a) crack = 30–80 ms broadband noise burst, (b) rumble = brown noise through lowpass whose cutoff decays 1500→80 Hz over 4–12 s with a jittery amplitude envelope (many small random bumps = multiple path arrivals), (c) sub boom 30–60 Hz sine with slow decay, (d) send to long reverb. Distance → delay after flash + stronger lowpass + less crack.

### 5.4 Tanpura drone
- Karplus–Strong plucked strings are the standard browser tanpura method (Svara, raag-app use KS) **[search]** https://svara.peacedrone.net/ , https://github.com/SubchiBeats/raag . Jawari "buzz" ≈ bright, slowly evolving upper partials: use a very low-loss KS loop (feedback 0.996–0.999), a gentle nonlinearity (soft clip/waveshaper) inside or after the loop, plus a slowly swept bandpass per string to animate the overtone bloom.
- Implement KS in an **AudioWorklet** (DelayNode can't go below 128-sample render quantum in a feedback loop, which caps pitch accuracy at high notes). Tuning (just intonation, Sa=C#3 ~138.6 Hz): Pa (3/2 below upper Sa → low Pa 0.75×), Sa, Sa, low Sa (0.5×); pluck cycle Pa–Sa–Sa–Sa every ~1.2–1.6 s; Raag Megh/Malhar uses Ma instead of Pa for the first string in some tunings — choose by chapter.

### 5.5 Reverb & mastering
- Generate IRs procedurally: exponentially decaying stereo white noise with fade-in and time-varying lowpass (Moorer's observation) — `reverbGen` library does this **[search]** https://github.com/adelespinasse/reverbgen ; or 9 lines of code (kentog751/procedural-audio) **[search]**. Two IRs: "verandah" 1.8 s, "river ghat" 4–5 s, wet/dry by chapter. Render IRs with `OfflineAudioContext` at startup (~20 ms).
- Master chain: `DynamicsCompressorNode` (threshold −18 dB, ratio 3) → gain → destination. Keep peak headroom; tablet speakers distort low end → high-pass the master at 60 Hz on mobile.

### 5.6 Audio-reactive visuals
- Trionn's footer: `AnalyserNode` tapped off the synth graph, `getByteFrequencyData`, sum mid-band energy, smooth with a lerp, feed into shader morph speed **[src]**. For Barsaat: thunder RMS → cloud flash intensity and camera shake; rain-band energy → streak density jitter; tanpura partial energy → diya flicker/water shimmer. But drive *primary* visuals from the shared `story` state (deterministic), and use audio only as modulation, so muted users get the same film.

---

## 6. Performance & QA

### 6.1 GPU tiering
- `@pmndrs/detect-gpu` (`getGPUTier()`): tier 0 (<15 fps / no WebGL / blocklisted) → non-WebGL fallback; tier 1 ≥15; tier 2 ≥30; tier 3 ≥60, based on GFXBench scores; returns `type` (`BENCHMARK`, `FALLBACK`, `BENCHMARK_FETCH_FAILED`, `BLOCKLISTED`, `WEBGL_UNSUPPORTED`) **[search]** https://github.com/pmndrs/detect-gpu . It fetches benchmark JSON from unpkg by default → **self-host** (`benchmarksURL: import.meta.env.BASE_URL + 'benchmarks'`) for offline/CSP reliability on Pages. Note Brave may mask `WEBGL_debug_renderer_info` under fingerprinting protection → expect `FALLBACK`; therefore always combine with a **runtime frame-time probe**.
- Runtime probe: render the real composite for ~60 frames during the intro gate, measure median frame time, pick preset. Then keep monitoring.

### 6.2 Adaptive DPR / resolution
- Cap DPR: three.js manual warns `setPixelRatio(devicePixelRatio)` at 3× means 9× pixels; discoverthreejs recommends capping at 2 or 3; common practice `Math.min(devicePixelRatio, 2)` **[search]** https://threejs.org/manual/en/responsive.html , https://discoverthreejs.com/tips-and-tricks/ . For a 2880×1800 tablet, DPR 2 is ~5 MP per pass — too much for fullscreen shaders. Use **1.25–1.5 for the scene, 0.5–0.75 for effects**.
- A three.js forum thread cautions DPR scaling only helps fill-rate-bound scenes and resizing RTs reallocates memory **[search]** https://discourse.threejs.org/t/changing-pixelratio-based-on-fps-good-or-bad-idea/34563 — our scene is fill-rate bound (fullscreen shaders), so adaptive resolution is right; but step in **discrete levels** (1.5 → 1.25 → 1.0 → 0.75) with hysteresis (drop after 1 s of >20 ms frames, raise after 5 s of <12 ms), and resize only the final drawing buffer, keeping effect RTs at fixed fractions.

### 6.3 Textures & asset budget
- KTX2/Basis: stays compressed in GPU memory (JPEG/PNG/WebP decode to full RGBA); ETC1S = small files, UASTC = high quality (~BC7) with RDO + Zstd **[search]** https://www.donmccurdy.com/2024/02/11/web-texture-formats/ , https://github.com/KhronosGroup/3D-Formats-Guidelines/blob/main/KTXArtistGuide.md ; three.js `KTX2Loader` + transcoder from `examples/jsm/libs/basis`, call `detectSupport(renderer)` first **[search]** https://threejs.org/docs/pages/KTX2Loader.html . Encode with `basisu -ktx2 -uastc -uastc_rdo_l 1.0 -mipmap x.png` or glTF-Transform/toktx.
- For this project (a handful of 2D plates + depth maps + noise), the transcoder WASM (~0.5 MB) may cost more than it saves. Rule: if total decoded GPU texture memory would exceed ~150 MB or there are > 8 large plates, use KTX2 (UASTC for photos & depth, ETC1S for masks); otherwise AVIF/WebP with max 2048 px on tablets.
- Budget targets: initial JS ≤ 250 KB gzip (three core tree-shaken ~150 KB, GSAP+ST+SplitText ~45 KB, Lenis ~5 KB), first-chapter assets ≤ 1.5 MB, total ≤ 8 MB lazy-loaded per chapter; fonts ≤ 250 KB (variable woff2 subsets); audio = 0 bytes (all synthesized).

### 6.4 Avoiding jank on Android Chrome / Brave
- No allocations in the frame loop (Trionn wraps geometry with inline scalar math to avoid GC **[src]**); reuse `Vector3`s; pre-create uniforms.
- `renderer.compile()` + warm-up render before reveal; preload & `decode()` images; upload textures during the intro gate (`renderer.initTexture`).
- Keep DOM animations to `transform`/`opacity`/`filter: blur` only, remove `will-change` after (Trionn does) **[src]**; avoid animating `font-variation-settings` on large paragraphs (forces relayout) — only on 1–3 headline words.
- `powerPreference: 'high-performance'`, `antialias: false` (do FXAA/none in composite at DPR ≥ 1.25), `stencil: false`, `depth` only if needed.
- Thermal throttling is real on tablets: target a stable 60 at "high", but allow a locked 30 fps mode (render every other ticker frame, interpolating scroll) for long sessions; Lenis notes Safari caps at 60 and 30 in low-power — Android Chrome follows the panel refresh (Xiaomi Pad 6 is 144 Hz! cap render to 60 by skipping ticks, otherwise GPU work doubles).
- Pause rendering when `document.hidden` or chapter canvas is fully covered.

### 6.5 Lighthouse & loading
- Lighthouse penalizes long main-thread tasks and LCP; make LCP a DOM title + poster image (not the canvas); load three.js chunk via dynamic `import()` after first paint; GL fades in over the poster. Defer audio code until the gate click.
- Vite: `base: '/barsaat/'` for project Pages; `build.assetsInlineLimit` small; GLSL via `vite-plugin-glsl` (supports `#include` chunks); split vendor chunks.

### 6.6 Testing WebGL headless (CI / sandbox)
- Chromium's SwiftShader doc: WebGL via SwiftShader now requires explicit opt-in `--enable-unsafe-swiftshader`; use `--use-gl=angle --use-angle=swiftshader` (SwANGLE) **[search]** https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/swiftshader.md . Real-world Playwright configs combine `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist` and keep `workers: 1` because software GL is CPU bound **[search]** https://github.com/janosh/matterviz/blob/main/playwright.config.ts
- Test plan: (1) context creates & no shader compile errors (listen to `console` errors; enable `renderer.debug.checkShaderErrors`); (2) scroll to each chapter hash, wait N frames, screenshot, compare to baseline with tolerance (pixelmatch) — use deterministic `uTime` via `?seed=1&time=fixed` query flags; (3) reduced-motion run (`page.emulateMedia({ reducedMotion: 'reduce' })`); (4) no-WebGL run (`--disable-webgl`) shows posters; (5) emulate tablet viewport 1440×900 @2x. SwiftShader is ~10–50× slower — measure correctness, not fps.
- On-device: `chrome://inspect` remote debugging works for Brave on Android via USB… but the user has no PC. So build an in-app debug HUD (`?debug=1`): fps, frame-time graph, tier, DPR level, `renderer.info.render.calls/triangles`, active RTs, audio state; plus Spector.js only in dev.

---

## 7. Recommended stack & architecture for Barsaat v3

### Stack
| Concern | Choice | Why |
|---|---|---|
| Build | Vite + TypeScript, `vite-plugin-glsl` | static output for GitHub Pages, GLSL includes |
| Render | **three.js (WebGL2, `WebGLRenderer`)**, hand-written `ShaderMaterial`/`RawShaderMaterial`; no R3F | direct control of loop/RTs (Trionn reasoning), smaller bundle; WebGPU not needed |
| Scroll | **Lenis** (wheel smoothing desktop; native touch on tablet, `syncTouch:false`) + **GSAP ScrollTrigger** | industry standard, one ticker |
| Animation | GSAP core + `SplitText` (free) + `gsap.matchMedia` | timelines, a11y split, reduced motion |
| Text | DOM, Fontsource variable: Anek Devanagari (display), Noto Serif Devanagari (poetry), Latin pair from same families | correct Indic shaping by browser |
| GL text | Canvas2D-rasterized textures for any Hindi in GL; troika only for Latin if needed | troika lacks Indic shaping |
| Audio | Web Audio + AudioWorklet (KS tanpura, drop plinks), procedural IR via OfflineAudioContext | zero audio bytes, reactive |
| Tiering | `@pmndrs/detect-gpu` (self-hosted benchmarks) + runtime frame-time probe | robust on Brave |
| Assets | AVIF/WebP plates ≤ 2048 px + 8-bit depth maps; KTX2 only if budget exceeded | simplicity vs memory |
| QA | Playwright + SwiftShader flags, pixelmatch, `?debug=1` HUD | sandbox-testable |

### Module layout
```
src/
  main.ts            // boot: gate → tier probe → load chapter 0 → start ticker
  core/clock.ts      // gsap.ticker: lenis.raf → story sync → gl.render → audio.update
  core/story.ts      // single mutable state {progress, rain, storm, flash, wet, fog, ch, velocity}
  core/scroll.ts     // Lenis init, matchMedia branches, chapter ScrollTriggers, hash sync
  core/quality.ts    // tiers → presets {dpr, fxScale, streaks, clouds:'layers'|'raymarch', ripplesSim}
  gl/renderer.ts     // WebGLRenderer, RT pool, resize via ResizeObserver/visualViewport, context-loss
  gl/passes/
    plate.ts         // photo plate + depth parallax (displaced plane) + wet/relight
    sky.ts           // LUT gradient + layered FBM clouds (raymarch on tier3) + lightning flash
    rainStreaks.ts   // instanced streaks (tier≥2) / screen-space streaks
    glass.ts         // half-res procedural drops + fog ping-pong (finger wipe)
    water.ts         // river: mirrored reflection + analytic ripples (+wave sim tier≥2)
    composite.frag   // refraction by water map, fog, CA, bloom-lite, grade LUT, grain, vignette
  gl/lightning.ts    // midpoint-displacement bolt meshes + flash envelope (emits 'strike')
  text/split.ts      // Intl.Segmenter word/line split, aria
  text/reveals.ts    // per-chapter text timelines (word-level for Hindi)
  audio/engine.ts    // context, master, IRs, analyser, mute/sessionStorage
  audio/rain.ts  audio/thunder.ts  audio/tanpura.worklet.ts
  ui/gate.ts  ui/nav.ts  ui/debugHud.ts
public/benchmarks/   // detect-gpu data
```

### Frame order (every gsap tick)
1. `lenis.raf(t)` → ScrollTrigger updates timelines → `story` numbers change.
2. Smooth `story.velocity`; quality governor samples frame time.
3. GL: update uniforms from `story` → render passes (sky@½, plate, water, streaks) into scene RT → glass water-map@½ (+fog ping-pong @30 Hz) → composite to screen.
4. Audio: set target gains with `setTargetAtTime` from `story` (no per-frame node creation); strikes fire via event bus with distance delay.

### Quality presets (starting points for Adreno 650 @ 2880×1800)
- **High (tier 3 / probe < 11 ms):** DPR 1.5, fx 0.5, 4k streaks, wave sim 512², layered clouds 5 layers (raymarch optional chapter-only), finite-difference drop normals off (dFdx).
- **Medium (tier 2):** DPR 1.25, fx 0.5, 2k streaks, analytic ripples only, 3 cloud layers.
- **Low (tier 1):** DPR 1.0, fx 0.35, screen-space streaks, static fog buffer updates at 20 Hz, no bloom-lite.
- **Fallback (tier 0 / context lost):** posters + CSS + DOM story; audio still available.

### Open questions / risks
- Brave fingerprinting shields may randomize canvas/WebGL readbacks (affects any `readPixels`-based logic — avoid readbacks) and hide GPU renderer string → rely on runtime probe.
- Heartfelt and many Shadertoy shaders are CC BY-NC-SA: write original implementations; credit inspirations in the colophon.
- Devanagari per-character animation will look broken (shirorekha gaps) — design typography motion at word/line level from the start.
- 144 Hz panel: must cap rendering to 60 Hz or thermal throttling will arrive within minutes.

### Key sources
- Lenis README: https://github.com/darkroomengineering/lenis
- GSAP ScrollTrigger / matchMedia / normalizeScroll docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ , https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
- HAOQI.DESIGN case study (scroll sync, DOM↔GL rects, half-res post): https://tympanus.net/codrops/2026/08/15/inside-haoqi-design-letting-dom-and-webgl-share-a-retro-futurist-stage
- Trionn case study (GSAP+Three+Lenis+Web Audio, warm-up, analyser-driven fog): https://tympanus.net/codrops/2026/07/15/the-architecture-behind-trionn-coordinating-gsap-three-js-lenis-and-web-audio/
- Heartfelt: https://www.shadertoy.com/view/ltffzl · Codrops RainEffect: https://github.com/codrops/RainEffect · Zavie ripples: https://www.shadertoy.com/view/ldfyzl
- Maxime Heckel: clouds https://blog.maximeheckel.com/posts/real-time-cloudscapes-with-volumetric-raymarching/ · painterly https://blog.maximeheckel.com/posts/on-crafting-painterly-shaders · post-processing https://blog.maximeheckel.com/posts/post-processing-as-a-creative-medium/
- Codrops fake 3D: https://tympanus.net/codrops/2019/02/20/how-to-create-a-fake-3d-image-effect-with-webgl · relighting: https://tympanus.net/codrops/2026/08/19/relighting-images-with-depth-maps-and-three-js · hover-effect: https://github.com/robin-dela/hover-effect
- GSAP SplitText rewrite: https://webflow.com/blog/gsap-splittext-rewrite · W3C Indic graphemes: https://www.w3.org/International/questions/qa-indic-graphemes
- troika Devanagari issue: https://discourse.threejs.org/t/troika-3d-text-library-for-sdf-text-rendering/15111/32 · three-text (HarfBuzz): https://github.com/countertype/three-text
- Farnell rain/thunder: https://aspress.co.uk/sd/practical15.html , https://aspress.co.uk/sd/practical17.html · reverbGen: https://github.com/adelespinasse/reverbgen
- Chrome autoplay & Web Audio: https://developer.chrome.com/blog/web-audio-autoplay
- detect-gpu: https://github.com/pmndrs/detect-gpu · KTX2: https://threejs.org/docs/pages/KTX2Loader.html , https://www.donmccurdy.com/2024/02/11/web-texture-formats/
- SwiftShader: https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/swiftshader.md
- Three.js Journey performance tips (draw calls, monitoring): https://threejs-journey.com/lessons/performance-tips

# Barsaat — What Actually Wins: Awwwards / FWA / CSSDA Research

Compiled 2026-10-17 for an Awwwards SOTD/SOTY-level storytelling **website** (not a game) about the Indian monsoon.
Method: web_search + web_fetch of official award pages, jury score tables, studio case studies, Codrops write-ups and browser-measured teardowns (rickcreates.com). No WebGL was rendered by me; descriptions of experiences come from the case studies and teardowns cited. Where a fact comes only from a search excerpt (not a fetched page) it is marked *(excerpt)*.

---

## 0. TL;DR

- **Scoring is 40% Design / 30% Usability / 20% Creativity / 10% Content**, ≥18 jurors, the 3 scores furthest from the mean are dropped (https://www.awwwards.com/about-evaluation/). You win by giving *no juror* a reason to mark you down.
- **Every recent SOTY winner's weakest category is Usability** (Igloo 7.50, Lusion 7.95, Lando 7.90, Bruno 7.83, Persepolis 7.41) and **their best is Creativity** (8.31–8.71). Creativity gets you nominated; usability/polish decides between Honorable Mention and SOTD.
- **Developer Award weak spots are always Accessibility and Semantics** (Igloo 6.6/6.6, Bruno A11y 6.6, Lando A11y 7.0). Persepolis Reimagined — the only cultural-heritage winner — shipped a real accessibility panel (reduced motion, high contrast, larger text, no-drag) and 8 languages including Hindi. That is our gap to exploit.
- **Winning structure = one continuous camera/metaphor + 3–6 named chapters + one signature interaction + sound designed with the visuals + a calm, legible UI layer.** (Igloo: one dive through ice; Hatom: 5 stages of a griffin; Persepolis: 6 stops in a city; Into the Amazon: one drop of water from summit to sea.)
- **Monsoon has almost no award-level precedent.** Water/weather winners exist (Into the Amazon, The Sea We Breathe, Into the Storm, Gentle Rain), and Persepolis proved culture/heritage can win FWA of the Year — but no Indian-monsoon site has won. The lane is open.

---

## 1. The winners list (2023 → 2025, 2026 so far)

### Awwwards Annual Awards
| Year | Site of the Year | Developer SOTY | Users' Choice | Other notable nominees |
|---|---|---|---|---|
| 2023 | **Lusion v3** (Lusion) | Lusion v3 | Noomo Agency | Mana Yerba Mate (Louis Paquet) |
| 2024 | **Igloo Inc** (abeto + Bureaux) | Igloo Inc | Don't Board Me (The First The Last) | Opal Tadpole (Claudio Guglieri) = E-commerce of the Year; Agency of Year Locomotive; Studio of Year Immersive Garden |
| 2025 (announced Feb 2026) | **Lando Norris** (OFF+BRAND.) | **Messenger** (abeto) | Lando Norris | Scout Motors (E-com of Year), Immersive Garden (Agency), Malvah (Studio), Louis Paquet (Independent); 30 nominees incl. The Monolith Project, Ponpon Mania, PHOTOYOSHI (Garden Eight), Bruno's Portfolio, Oryzo-era Lusion, Cartier Watches & Wonders |

Sources: https://www.awwwards.com/annual-awards/winners ; https://www.awwwards.com/annual-awards/hall-of-fame/2024 ; https://www.awwwards.com/websites/sites_of_the_year/ ; LinkedIn announcement 2026-02-26 (OFF+BRAND/Webflow). 2026 annual awards not yet held (as of Oct 2026).

Tech census of all 30 SOTY 2025 nominees (Stefano Bartoletti, LinkedIn 2026-01-16 *(excerpt)*): GSAP on 21/30, Lenis 18/30, Three.js 18/30, Howler 7/30, Lottie 6; frameworks Vue/Nuxt 13, Webflow 6, plain HTML/JS 4, Astro 2, Next 2, Svelte 2.

### FWA of the Year
- 2023: **Lusion v3**; People's Choice: Loewe × Howl's Moving Castle (Stink) — https://thefwa.com/news/fwa-of-the-year-2023-peoples-choice-award-winners-announced
- 2024: **Food for Fish** (Kris Temmerman, WebGPU experiment); People's Choice: **Hatom** (Immersive Garden) — https://thefwa.com/news/fwa-of-the-year-2024-peoples-choice-award-winners-announced
- 2025: **Bruno's Portfolio** (Bruno Simon), also People's Choice — https://thefwa.com/news/fwa-of-the-year-2025-peoples-choice-award-winners-announced
- 2022 (context): **Persepolis Reimagined** (Monks for the Getty), also People's Choice.

### CSS Design Awards WOTY
- 2023: **Lusion v3** 9.27 (then Unseen Studio 9.20, MOTION.ED 9.07, MSI Egg Hunt 9.04, THE ROGER 9.01) — https://www.cssdesignawards.com/blog/2023-website-of-the-year-winners/394/
- 2024: **Buttermax** 9.06; top 10 incl. Longines Spirit Flyback (Immersive Garden) 8.96, ATMOS Lamp (Obys) 8.95, Organimo (Unseen) 8.93; Best Innovation: Active Theory V6 — https://www.cssdesignawards.com/blog/2024-website-of-the-year-winners/414
- 2025: **Dropbox Brand** (Daybreak) 9.03; then The Symphony of Vines (Unseen) 8.88, Charles Leclerc 8.85, The Monolith Project 8.85, Bruno's Portfolio 8.84 — https://www.cssdesignawards.com/blog/2025-website-of-the-year-winners/430/

---

## 2. The ~15 most relevant immersive / storytelling sites — dossiers

Scores: Awwwards SOTD overall, then Design / Usability / Creativity / Content; DEV = Developer Award.

### 2.1 Igloo Inc — igloo.inc — abeto + Bureaux — **SOTY 2024 + Dev SOTY 2024**
- **Experience:** corporate landing page for the parent of Pudgy Penguins, told as *one continuous 3D camera dive* through an icefield: igloo on a mountain → rainbow-shimmer fog → crystals with portfolio brands frozen inside → a glowing ice ring → a particle penguin on a platform. One more scroll **loops** back to the igloo.
- **Narrative structure:** only 3 content sections; the team's own stated challenge was "creating a scrolling experience that kept users engaged" with so little content (https://www.awwwards.com/igloo-inc-case-study.html).
- **Signature interaction:** cursor-near igloo makes ice blocks lift, glow and settle; footer particles reshape into each social logo (built from Houdini VDB volumes via a custom compressed exporter, "smaller than a typical website image").
- **Motion/type/sound:** near-monochrome ice palette (#b6bac5/#383e4e); tiny monospaced "lab instrument" labels with text-scramble decode; transitions = chromatic aberration + "tech displacement" + frost. Sound off by default, sound toggle bottom-left; music and SFX matched to particle motion.
- **Intro/preloader:** grey screen + hairline progress → wireframe igloo in a grid filled by snow particles; full scene at ~6.5 s. Intro animated in real time in-engine (no video) so it flows seamlessly into the site.
- **Tech:** three.js r165 inside a closed shadow root; **entire UI in WebGL** via MSDF glyphs; GSAP; pmndrs postprocessing; Svelte, Vite, three-mesh-bvh; 4 web workers; Draco models 0.55 MB, KTX2 textures 10.8 MB, audio 2.9 MB → ~15.3 MB. 60 fps. Procedurally "grown" ice crystals.
- **Scores:** 7.92 — 8.05 / **7.50** / 8.31 / 7.91. DEV 7.66: Animations 9.6, WPO 8.0, Responsive 8.4, **Semantics 6.6, Accessibility 6.6, Markup 6.4**. Zero focusable elements, no text nodes, reduced-motion ignored (https://rickcreates.com/r/2024-07-23-igloo-inc ; https://www.awwwards.com/sites/igloo-inc).
- **Jury note (SOTY page excerpt):** "combines an immersive 3d experience with an easy to navigate, scroll interaction. The attention to detail, micro-interactions, and effects are truly first class."

### 2.2 Lando Norris — landonorris.com — OFF+BRAND. — **SOTY 2025 + Users' Choice**
- **Experience:** a driver's site threaded by one object — **the helmet** — at opening, middle (helmet hall of fame) and footer (portrait finally wearing the full lime helmet). A bookend structure.
- **Signature interaction:** hero portrait is a photo on a 128×128 plane displaced by a depth map with normal/roughness maps, so it turns like a real head under the cursor while helmet livery bands sweep across the face every few seconds.
- **Motion/type:** only 4 colours (off-white, dark olive, near-black, lime accent); contour-line texture echoing the helmet "blob" livery; headings mix Brier (light serif) + Mona Sans (heavy sans) in the same line — "two sides of one person". Photos are toned grey-green except one hero image in colour. Signature writes itself on scroll (Rive). Every card shares one cut-corner tag shape.
- **Tech:** **Webflow** + Lenis + GSAP + three.js r174 fixed full-screen canvas + Rive (signature, page transitions, buttons) + Draco; ~5.3 MB; lime "LOAD NORRIS" loader, portrait at ~3 s; one 0.92 s freeze.
- **It's a real website:** STORE button, menu with ON TRACK / OFF TRACK / CALENDAR pages, keyboard-tabbable with focus outlines, next-race card.
- **Scores:** 8.18 — 8.12 / 7.90 / **8.71** / 8.18. DEV 7.58 (A11y 7.0 lowest; unnamed links, reduced-motion ignored). https://rickcreates.com/r/2025-11-20-lando-norris

### 2.3 Messenger — messenger.abeto.co — abeto — **Developer SOTY 2025**
- Technically a 15-minute browser game (included because it won Dev SOTY and its lessons transfer). Tiny spherical planet, deliver letters; 7 zones (neighbourhood, plaza, cemetery, beach, temple, forest, factory). Mood brief: "total tranquility and a subtle sense of oddness" from mid-sized Asian cities; team travelled for reference.
- **Transferable craft:** 16×16 px colour atlas so the *whole world's mood/lighting changes at once*; clothes darken when wet and dry off on land; per-zone soundscapes; a guitar NPC you locate *by ear* via 3D audio; story was the **last** thing decided — "the simplest thing possible"; no arrows/tutorials; one-finger mobile, mouse-only desktop; strict iOS Safari memory discipline; UI in WebGL with WASM-generated glyphs; custom LOD. 5.7 MB initial load *(excerpt, webgpu.com)*.
- **Scores:** SOTD 7.92 (10 Nov 2025). https://www.awwwards.com/messenger.html

### 2.4 Lusion v3 — lusion.co — Lusion — **SOTY 2023 + Dev SOTY 2023 + FWA OTY 2023 + CSSDA WOTY 2023** (the only triple crown)
- **Experience:** studio portfolio; a 3D layer runs the whole homepage. Hero: pile of cross-shaped blocks with custom physics the cursor pushes; **one click changes the colour set** (blue→green→red). Ends with an astronaut flying through a glowing tunnel to "Let's work together".
- **Restraint where it counts:** one typeface (Aeonik), off-white ground, black text, one electric-blue accent; small layout-grid cross marks. Only the finale goes loud.
- **Tech:** Astro + three.js r158, custom physics + custom wheel handling (no GSAP/Lenis); ~11.8 MB; loader number-counter; hero in place 4.5–6.5 s.
- **Scores:** 8.25 — 8.26 / 7.95 / 8.65 / 8.26. DEV **8.41** (Animations 10, **WPO 9.0**, A11y 7.4). https://rickcreates.com/r/2023-10-02-lusion-v3

### 2.5 Bruno's Portfolio (2025) — bruno-simon.com — **FWA of the Year 2025 + People's Choice; Awwwards SOTM Jan 2026; CSSDA Best Portfolio**
- Drive a jeep around an island; content lives in 13 areas; map (M) teleports. Game layer: 38 achievements, daily leaderboard, "whispers" (30 global messages, moderated).
- **Directly relevant: a full real-clock weather system** — day/night cycle (240 s), seasons follow the real calendar, wind lines through grass, **rain that splashes on water, rain turning to snow, freezing water, lightning storms**, falling leaves. Everyone sees the same weather at the same moment.
- Sound treated as UX: commissioned CC0 score (Kevin "Kounine" Colombin — same composer as Messenger), spatialised object sounds, one UI click with pitch variation for close.
- **Mobile:** automatic low-quality preset (no water blur, no DOF, lower shadow res). TSL shaders run on WebGPU with WebGL fallback.
- **Tech:** three.js r183 WebGPURenderer + TSL, Rapier (WASM), Draco, KTX2, WebSocket; ~7.4 MB; first paint 3 s, start screen 9 s.
- **Scores:** 8.11 — 8.05 / 7.83 / 8.62 / 8.18. DEV 7.65 (A11y 6.6). https://rickcreates.com/r/2026-01-21-brunos-portfolio ; https://www.awwwards.com/brunos-portfolio-case-study.html

### 2.6 Persepolis Reimagined — persepolis.getty.edu — Monks for the Getty — **FWA OTY 2022 + Awwwards Dev SOTY 2022** (the cultural-heritage benchmark)
- **Experience:** online exhibition; city rebuilt in 3D. Scroll-scrubbed opening film: morning fog clears, city appears. Then **you are an envoy** walking to the king: 6 stops (Gate of All Nations, Apadana…), each with sub-sections.
- **Signature interaction:** a Persian rosette ornament in front of statues — click to swap the painted reconstruction for a **present-day photo of the ruin**. Past vs present in one gesture.
- **It's a site:** 3D map menu with 6 pins (current/visited/unvisited), an **Art Index** of real objects with holding museums and "See it in [place]" deep links, 8 languages incl. **Hindi**, dot-column chapter progress at the right edge. Culturally-rooted motif (rosette) reused for loader, reveal button and map button. Warm dawn/dusk light; ornamental serif (Maghfirea) + Graphik for UI.
- **Accessibility panel:** reduced motion (follows OS; camera cuts instead of flying), high contrast, larger text, no dragging; visible focus everywhere.
- **Cost:** ~80 MB total (26 MB scroll video). Usability 7.41 was its lowest score — the download weight.
- **Scores:** 7.96 — 8.11 / 7.41 / 8.36 / 8.23. DEV 8.03. https://rickcreates.com/r/2022-06-01-persepolis-reimagined

### 2.7 Hatom — hatom.com — Immersive Garden — **FWA People's Choice 2024; Awwwards SOTD 7.96; Orpetron SOTM**
- **Structure:** crypto protocol told as myth — **5 named stages of a griffin**: Conception (glowing egg, rotate to see the fetus) → Birth (egg cracks, fragments dissolve into the universe) → Booster (armour, city grows behind) → Sustainability (planets) → Cross-Chain.
- **Signature interaction:** **long-press reveals an alternate version of each environment**; tuned separately for mobile.
- Sound by Ben Lukas Boysen, synced cues. Progressive preloading per stage.
- **Tech:** Nuxt, Three.js, Blender, GSAP, **Lenis**, Strapi CMS, **Howler**, Vercel. https://www.awwwards.com/case-study-hatom-brand-new-experience.html

### 2.8 Oryzo AI — oryzo.ai — Lusion (2026) — Awwwards SOTD 7.86, FWA SOTD 90 pts, CSSDA WOTM 9.43
- Satire: a cork coaster launched like a frontier AI product. Hero is a lived-in studio desk; real meshes with baked light + **Gaussian splats** for reflections/clutter + relit sprite smoke, scroll-scrubbed camera *(excerpt, GitHub mirror)*.
- **Design lesson (Lusion blog):** "design cannot constantly ask for attention… 99% of the type is one family; the colour system is four values" — restraint so renders carry the story. https://blog.lusion.co/oryzo-bts-part-3-7-website-ux-ui-and-illustrations

### 2.9 The Monolith Project — themonolithproject.net — Ethan Chiu, Fabian Tjoe-A-On, Nando Correa — SOTY 2025 nominee; CSSDA WOTY #4 (8.85)
- Illustrated sci-fi narrative ("Across the stars, a silent monolith awakens… every touch rewrites reality"); scene/mask transitions, solar system; one accent colour (#FF002F). Composable shader framework, GPU particles, deferred rendering. Awwwards 7.69 — 7.83 / **7.16** / 8.08 / 7.98: illustration-led storytelling scores high on creativity but loses on usability. https://www.awwwards.com/sites/the-monolith-project

### 2.10 Into the Amazon — nationalgeographic.com/into-the-amazon — Gladeye for Nat Geo — Awwwards SOTD (21 Apr 2025), FWA SOTD, CSSDA SOTD, 2 Webby wins
- **The closest structural analogue to Barsaat:** "follows **a drop of water from summit to sea**", through locals', scientists' and explorers' perspectives. Andean peaks → underwater forests.
- Real data: NASA SRTM terrain + Sentinel-2 imagery to render a GPS-collared bear's path; lidar scenes; sideways movements; custom orchestration framework animating WebGL and HTML/React together. Nat Geo illustrations, maps and photography carry the content. https://www.gladeye.com/work/into-the-amazon ; https://www.awwwards.com/sites/into-the-amazon

### 2.11 Into the Storm — airforce.com/intothestorm — Monks — Awwwards SOTD 8.15, SOTM Mar 2021
- Interactive documentary of a real 2010 Alaska rescue. **Weather as narrative:** dynamic clouds, height fog, snow particles, blowing surface snow, **snow-on-lens**, lens flare, colour grading — each story beat has a weather/grade **preset that blends into the next**.
- Gesture vocabulary kept to three: scroll (trek; **scrolling faster reduces visibility in the blizzard**), drag (lower/raise the helicopter), explore (hotspots trigger **real voice recordings** of the pararescuemen). https://www.awwwards.com/case-study-u-s-air-force-into-the-storm-by-mediamonks-wins-site-of-the-month-march-2021.html

### 2.12 The Sea We Breathe — theseawebreathe.com — Unseen Studio for Blue Marine Foundation — SOTD 7.84, DEV 8.11
- "Dive into 3 immersive underwater journeys and discover why a healthy ocean means a healthy planet." Educational info-disclosure layered on immersive scroll; Three.js + Blender + sound. Scores 7.85 / 7.45 / 8.18 / **8.29 content**; DEV Animations 9.6, A11y 7.4. https://www.awwwards.com/sites/the-sea-we-breathe

### 2.13 Gentle Rain — gentlerain.ai — Zajno + Andrew Encharm — SOTD 7.28
- Name-driven concept → **water ripples with physically simulated dispersed caustics + dithering** as the hero; consciously avoided the clichéd fluid-sim look; built **3 performance tiers** to hold 60 fps. Webflow + custom WebGL. https://tympanus.net/codrops/2025/01/16/case-study-gentle-rain

### 2.14 KPR (Resn, SOTY 2022) and Pioneer – Corn Revolutionized (Resn, SOTY 2020)
- KPR: long scroll of full-screen paintings that shrink into folded-tab cards; press-and-hold switches to a "scanner" revealing hidden objects (7.98). Pioneer: one unbroken camera move DNA → seeds → seedling → fields, then **loops back** (8.18). Both show the "one continuous journey + loop" pattern that Igloo later perfected. https://rickcreates.com/year

### 2.15 Don't Board Me (Users' Choice 2024) and Opal Tadpole (E-com of Year 2024)
- Proof that charm and clarity win public votes: Don't Board Me gates entry with "bounce a ball to get to the site", illustration-led, simple nav, Nuxt (SOTD 7.83). Opal Tadpole: product storytelling with "show don't tell" stat animations (users 8.55). https://www.awwwards.com/sites/dont-board-me ; https://www.awwwards.com/sites/opal-tadpole

**Pattern across the score tables:** Creativity is always the top score (8.08–8.71), Usability always the bottom (7.16–7.95). The SOTY winners are the ones whose usability *floor* stayed near 7.8–8.0.

---

## 3. Lessons from the case studies (≥6 read in full)

Read in full: Igloo (Awwwards), Messenger (Awwwards), Summer Afternoon (Awwwards), Hatom (Awwwards), Bruno's Portfolio (Awwwards), Into the Storm (Awwwards), The Spark (Codrops), Gentle Rain (Codrops), Into the Amazon (Gladeye), plus browser teardowns of Igloo/Lando/Lusion/Bruno/Persepolis.

### 3.1 The first 5 seconds
- Branded loader appears in ~0.2–0.3 s on every winner (FCP is the loader, not content). Hero becomes fully composed at **3 s (Lando), 4.5–6.5 s (Lusion), 6.5 s (Igloo), ~6 s (Persepolis), 9 s (Bruno)**. Juror Hon Tran: "A two-second branded reveal that sets a tone is craft. A six-second progress bar is a usability penalty wearing a costume." (https://www.hontran.dev/blog/how-to-win-an-awwwards-site-of-the-day)
- **The loader is part of the story**, not a gate: Igloo's wireframe igloo filled by snow, rendered in real time so it "flows seamlessly into the rest of the experience"; Lando's lime "LOAD NORRIS"; Persepolis's loader uses the same rosette as its core interaction. The Spark loads only scene 1 first "which matters if a visitor is ready to bounce after a blank intro", streaming later scenes.
- **Something reacts to the cursor before the first scroll** (Igloo ice blocks lift; Lusion crosses scatter; Lando's head turns). The first interaction must reward curiosity within a second.
- Sound: default **off** with a visible toggle (Igloo, Persepolis start audio only after first click). Bruno's start screen invites a click, which also unlocks audio.

### 3.2 Scroll → story mapping
- **Each scene owns a slice of the scroll range; short beats get compressed ranges, long beats get room to look around** (The Spark). Persepolis: each wheel tick flies to the next position, *stops*, then text fades in — scroll-snapped beats, not free scrubbing.
- **One continuous metaphor/camera** beats a stack of sections (Igloo dive, Pioneer camera move, Into the Amazon's water drop). Loop the end back to the start (Igloo, Pioneer) so there is no dead end.
- **Map scroll *velocity*, not only position**, to atmosphere: The Spark's footsteps/sound scale with scroll speed ("behaves more like an instrument"); Into the Storm reduces visibility as you scroll faster in the blizzard. For monsoon: scroll speed = rain intensity.
- **Presets per beat, blended continuously** (Into the Storm's fog/cloud/grade presets) — the cheapest way to make a 5-chapter mood arc feel like one film.
- Previs before production: abeto uses grey mockups + untextured previs animations to agree the camera journey first.

### 3.3 Staying a *site* (not a game)
- Visible chapter system: Persepolis dot column + 3D map with visited states; Hatom's named phases; Lando's menu with real pages; Bruno's map + teleport.
- A conventional, readable layer exists alongside the spectacle: Persepolis Art Index, Lando store/calendar, Lusion menu/About/Projects, Into the Amazon's journalism.
- UI as a character but legible: The Spark's two UI modes (cold system voice → softer human type as the story resolves) "made the story easy to follow while keeping the amount of copy low". Igloo's small mono labels never compete with the 3D.
- Interaction vocabulary of ≤3 gestures (Into the Storm: scroll, drag, explore) and **no tutorials** (Messenger). Long-press as the one "secret" gesture (Hatom, KPR).
- Content is real: real voices (Into the Storm), real objects and museums (Persepolis), real science and data (Into the Amazon). Content is 10% of score but it is the reason a culture site gets *remembered* (Sea We Breathe content 8.29; Persepolis 8.23).

### 3.4 Mobile strategy
- Quality tiers, chosen automatically: Bruno disables water blur/DOF and reduces shadows on mobile; Gentle Rain shipped **three** versions of its water effect; Messenger "vibrant even on an old phone", one-finger control.
- Memory is the iOS killer: "Safari on iPhone is super picky… the browser just kills the page" — track and free every asset (Messenger).
- Don't gate phones: The Spark gated mobile and admits compositions "framed for wide" broke — jurors score on a mid-range phone (Hon Tran: "A desktop masterpiece with a collapsed phone layout caps at an Honorable Mention"). Compose for portrait from day one.
- Cap DPR at 2, pause off-screen WebGL (Hon Tran).

### 3.5 Performance budgets (measured)
| Site | Initial weight | Hero ready | fps |
|---|---|---|---|
| Lando Norris | ~5.3 MB | ~3 s | 60 |
| Messenger | ~5.7 MB *(excerpt)* | — | 60 |
| Bruno 2025 | ~7.4 MB | 9 s | 60 |
| Lusion v3 | ~11.8 MB | 4.5–6.5 s | 59–60 |
| Igloo | ~15.3 MB | 6.5 s | 60 |
| Persepolis | ~80 MB | ~6 s | 60 (Usability 7.41) |
Techniques repeated everywhere: Draco/quantised geometry, KTX2 (ETC1S/UASTC) textures, palette/colour-atlas textures instead of many maps, instancing, looping tiles for grass/water/rain that always fill the camera, frustum culling, staged shader compilation, web workers for decoding, one shared clock (GSAP ticker drives Lenis + shader uniforms). Target: **≤6–8 MB to first chapter, 60 fps, hero composed in ≤3–4 s.**

### 3.6 Accessibility (the open goal)
- Igloo/Lusion/Lando/Bruno all ignore `prefers-reduced-motion`; Igloo has no focusable elements. Their DEV A11y scores: 6.6–7.4.
- Persepolis is the model: OS-synced reduced motion (camera **cuts** instead of flying), high contrast, larger text, no-drag mode, visible focus, named buttons, 8 languages.
- Keep real DOM text for story copy (SEO + screen readers), even if WebGL renders a stylised duplicate. Igloo's WebGL-only text cost it Semantics 6.6 / Markup 6.4.

---

## 4. Judging criteria and why sites fail

**Official (https://www.awwwards.com/about-evaluation/ , /faqs/):** Design 40, Usability 30, Creativity 20, Content 10. ≥18 jurors; 3 most extreme dropped; 5-day vote; HM needs ≥6.5 from both jury and PRO users; SOTD = top score of the day (can close early with high jury score + ≥10 PRO votes); site eligible 3 months from approval; jury score visible only if you win SOTD. All SOTDs go to a developer jury (Semantics/SEO, Animations, Accessibility, WPO, Responsive, Markup); >7 = Developer Award. 8 best SOTDs/month → SOTM (user votes weigh in); all SOTMs → SOTY nominees; SOTY winner announced in February.

**Why sites fail (juror Hon Tran, https://www.hontran.dev/blog/how-to-win-an-awwwards-site-of-the-day , and /awwwards-judging-criteria):**
1. **Random effects** — "everything floats, parallaxes, and reveals, so nothing matters. This is the single most common reason a creative site scores like an average one."
2. **Jank** — "A WebGL hero that drops to 20fps reads as *broken*."
3. **Broken mobile** — caps you at HM.
4. **Derivative concepts** — "the same horizontal-scroll gallery everyone shipped."
5. **No accessibility floor** — missing focus states, no reduced-motion path, low contrast, custom cursor hiding the real one.
6. **Long loaders** and slow LCP colour the whole impression.
7. **Placeholder content / stock-grade imagery.**
8. "Design + Usability is 70%… newcomers pour everything into Creativity." "The difference between an HM and a SOTD is almost never raw creativity — it's polish." Reserve a dedicated polish week; submit a flawless live build early in the week; never deploy mid-vote.
A rubric summary adds: a juror spends **60–120 seconds**, on their own machine and connection; "you win because no juror finds a reason to mark you down" (https://github.com/SandroHub013/awwwards-skill/blob/main/references/01-scoring.md *(excerpt)*). A critic notes Awwwards criteria contain no explicit performance term outside the developer jury (https://www.mocmallen.com/blog/what-website-awards-reward *(excerpt)*) — but in practice performance lands in Usability.

---

## 5. Prior art: rain, water, weather, monsoon, India

**Water / rain / weather (award-level):**
- **Into the Amazon** (SOTD 2025, Webby ×2) — a water drop's journey summit→sea. Strongest precedent for a water-cycle narrative.
- **The Sea We Breathe** (SOTD 7.84) — 3 underwater journeys + education.
- **Into the Storm** (SOTM 2021) — weather presets per story beat, snow-on-lens, speed-linked visibility, real voices.
- **Gentle Rain** (SOTD 7.28) — caustic ripples as identity; 3 perf tiers.
- **Bruno's Portfolio** (FWA OTY 2025) — real-time rain/snow/lightning/seasons, shared global weather.
- **Veolia – Water** (Merci-Michel, SOTD 7.3) — "Adventure of a Waterdrop" mini-game, water-animation button, river-flow gamification *(excerpt)*.
- **Rain Forest Food** (Immersive Garden; Awwwards SOTM/SOTD, FWA SOTD) — rain sounds and nature audio as sensory layer *(excerpt)*, https://immersive-g.com/projects/rain-forest-food/
- Unseen Studio lab **"WebGL Rain — Click & Hold to slow time"** (https://unseen.co/labs/webgl-rain/) — the press-and-hold time-slow gesture is a ready-made signature idea.
- Codrops **Rain & Water Effect Experiments** (Lucas Bebber, 2015; https://tympanus.net/codrops/2015/11/04/rain-water-effect-experiments) — canonical rain-on-glass refraction (drops invert the scene behind them; canvas water-map → WebGL refraction). Widely known, so must be *re-authored*, not reused as-is.

**India / South Asia:**
- No Indian-monsoon site found with Awwwards SOTD/SOTY or FWA. Awwwards' India winner list shows few Indian studios with SOTDs *(excerpt)*.
- **Persepolis Reimagined** — not Indian, but the proof that ancient/cultural storytelling wins top awards; shipped in Hindi.
- **Hungry Tiger** (Indian food brand, Le:mma / Artemii Lebedev) — FWA SOTD, CSSDA SOTD; playful 3D storytelling *(excerpt, Behance)*.
- **Pahāri** (Pahari miniature art, 3D gallery) and **Himachal – The Experience** (Liquidink, Three.js) — Awwwards Honorable Mentions only *(excerpt)*.
- **Recess in Varanasi** (Tapan Babbar) — One Page Love feature: up the Ganges by row- or motor-boat choice, video + audio of street games *(excerpt)*.
- **Goa Water Stories** (Social Script) — scroll narratives per water body, community archive *(excerpt)*.
- **Escape into the Rains** (Sterling Holidays, Kyoorius 2014) — detected the visitor's city and live weather (sunny/rainy) to change the experience *(excerpt)*. Live-weather personalisation is old as a marketing trick, but unused at award level for monsoon.

---

## 6. The 12 most transferable ideas for a monsoon storytelling site (ranked)

1. **One continuous journey with a single protagonist: a drop / a cloud.** Follow one raindrop from the Arabian Sea evaporating, riding the southwest winds, hitting the Western Ghats, falling on Kerala on ~1 June, running to a village tank, a Mumbai street, a paddy field, and back to the sea — then loop to the start (Into the Amazon + Igloo + Pioneer loop). Gives the whole site one camera and a reason to exist.
2. **5–6 named chapters as the backbone, with a visible chapter map and progress dots.** e.g. *Tapish (heat) → Pehli Boond (first drop) → Ghata (gathering clouds) → Barsaat (deluge) → Hariyali (green) → Vidaai (retreat)*. Named stages worked for Hatom (5) and Persepolis (6); a 3D/2D map of India showing the monsoon front advancing doubles as navigation (Persepolis map with visited states).
3. **One signature, screenshot-able interaction — press-and-hold to make it rain / slow time.** Hold = clouds burst and drops hang mid-air (Unseen WebGL Rain lab; Hatom long-press alternate world; KPR scanner). Reserve it; don't add five more.
4. **Scroll velocity drives rain intensity and sound.** Gentle scroll = drizzle, fast scroll = downpour and thunder; pause = drip and petrichor quiet (The Spark's speed-driven audio; Into the Storm's speed-reduced visibility). Makes the user an instrument.
5. **Weather/colour presets per chapter, blended continuously.** Ochre heat-haze → bruised indigo storm → saturated green → washed silver retreat, via one colour atlas/LUT so the whole world shifts mood at once (Into the Storm presets; Messenger's 16×16 atlas).
6. **Sound designed with the visuals, off by default, with a lovely toggle.** Layered beds (koel, distant thunder, tin roof, frogs, a Raag Megh/Malhar drone, chai stall ambience) and spatialised one-shots; composer brought in early (Hatom/Boysen, Bruno/Kounine, Messenger). Sound is how cultural texture lands without paragraphs.
7. **A culturally-rooted motif reused as system: loader, cursor, transitions, button.** Persepolis reused its rosette everywhere. Barsaat candidates: a rangoli/kolam ring that fills as the loader, a ripple ring, a paisley droplet, or the ring of a raindrop on a puddle. The loader should *start the story* (Igloo's snow filling the igloo → first drop filling an empty earthen matka).
8. **Past ↔ present / dry ↔ wet reveal.** Persepolis's ruin-vs-reconstruction swap, as monsoon: a cracked May field ↔ the same field in August; a dry ghat ↔ a waterfall. One gesture, huge emotional payoff, cheap with paired imagery.
9. **Real content layer: voices, data, culture.** Real recorded voices (a farmer, a Mumbai dabbawala, a fisherwoman) like Into the Storm; real IMD onset dates and rainfall data like Into the Amazon's NASA data; a "Barsaat Index" of songs, poems (Kalidasa's *Meghaduta*), recipes (pakode, bhutta), festivals (Teej) like Persepolis's Art Index. Content is only 10% but this is what makes jurors *remember* it.
10. **Real-time personalisation: the site knows today's monsoon.** Bruno's shared real-clock weather, Escape-into-the-Rains' live city weather. Show where the monsoon front is today / days to onset for the visitor's city, and match lighting to local time. Cheap to build, highly shareable, and novel at award level.
11. **Restrained type and palette so the atmosphere carries it.** One expressive display face (Devanagari + Latin pairing, e.g. a contrast serif headline with a Devanagari companion) + one quiet sans; 3–4 colours (Lusion, Oryzo, Lando). Bilingual Hindi/English headings are a distinctive, authentic typographic move.
12. **Accessibility and performance as a feature, not a footnote.** Ship Persepolis-grade a11y (reduced-motion cut mode, high contrast, larger text, keyboard, real DOM text), ≤8 MB to first chapter, 3 auto quality tiers, portrait-first compositions. Every SOTY winner bled points here; it is the cheapest way to out-score them on Usability and the Developer Award.

## 7. The 8 biggest pitfalls to avoid

1. **Becoming a game.** Driving/walking controls, missions, and hidden-goal UX push Usability down (Bruno 7.83, Monolith 7.16). Keep scroll + one gesture + click; content reachable in seconds.
2. **Random rain everywhere ("effects without hierarchy").** If every section has drops, ripples, parallax and glitch, nothing matters. One hero effect per chapter; directed motion only.
3. **Heavy loads and long loaders.** Persepolis's 80 MB cost it Usability 7.41. No scroll-scrubbed 26 MB videos; stream chapters; hero in ≤3–4 s.
4. **Jank on a mid-range Android.** Full-screen rain refraction + post FX at DPR 3 will drop frames. Cap DPR, tier the effects, test weekly on a real budget phone (the likely Indian visitor *and* a juror's phone).
5. **Desktop-only compositions.** Wide cinematic frames that crop badly in portrait (The Spark's admitted failure). Compose every chapter for 9:16 too.
6. **Cliché and stereotype.** Stock "Incredible India" imagery, generic chai-and-umbrella clip art, or reusing the 2015 Codrops rain-on-glass demo as-is reads as derivative (Creativity) and inauthentic (Content). Use specific places, real voices, regional detail, accurate Devanagari.
7. **WebGL-only text and no a11y.** Text only in canvas, no focus, no reduced motion = Semantics/A11y ~6.6 and a weaker Developer Award. Keep semantic HTML for all story copy.
8. **Sound that autoplays or is an afterthought.** Autoplay breaks browsers and annoys jurors; a library-music loop slapped on at the end wastes the medium. Off by default, invited by the first click, composed alongside visuals.

---

## Key sources
- Awwwards evaluation: https://www.awwwards.com/about-evaluation/ ; FAQ: https://www.awwwards.com/faqs/
- Annual winners: https://www.awwwards.com/annual-awards/winners ; https://www.awwwards.com/annual-awards/hall-of-fame/2024 ; https://www.awwwards.com/websites/sites_of_the_year/
- Teardowns with measured weight/fps/scores: https://rickcreates.com/year (Igloo, Lando, Lusion v3, Bruno, Persepolis, KPR, Pioneer, Food for Fish)
- Case studies: https://www.awwwards.com/igloo-inc-case-study.html ; https://www.awwwards.com/messenger.html ; https://www.awwwards.com/summer-afternoon.html ; https://www.awwwards.com/case-study-hatom-brand-new-experience.html ; https://www.awwwards.com/brunos-portfolio-case-study.html ; https://www.awwwards.com/case-study-u-s-air-force-into-the-storm-by-mediamonks-wins-site-of-the-month-march-2021.html ; https://tympanus.net/codrops/2026/01/09/the-spark-engineering-an-immersive-story-first-web-experience ; https://tympanus.net/codrops/2025/01/16/case-study-gentle-rain ; https://www.gladeye.com/work/into-the-amazon ; https://blog.lusion.co/oryzo-bts-part-3-7-website-ux-ui-and-illustrations
- FWA OTY: https://thefwa.com/news/fwa-of-the-year-2023-peoples-choice-award-winners-announced ; …-2024-… ; …-2025-…
- CSSDA WOTY: https://www.cssdesignawards.com/blog/2023-website-of-the-year-winners/394/ ; /2024-website-of-the-year-winners/414 ; /2025-website-of-the-year-winners/430/
- Juror guidance: https://www.hontran.dev/blog/how-to-win-an-awwwards-site-of-the-day
- Rain technique: https://tympanus.net/codrops/2015/11/04/rain-water-effect-experiments ; https://unseen.co/labs/webgl-rain/

## Gaps / not established
- Official Awwwards SOTY jury comments were only available as a one-line excerpt for Igloo (the annual-awards pages 404 on fetch). No 2025 SOTY jury quote obtained.
- Full list of all 30 SOTY 2025 nominees not retrieved from Awwwards directly (the annual page renders client-side); names given come from winners pages, LinkedIn nominations and a LinkedIn roundup.
- Messenger's per-category Awwwards scores and Hatom's/Into the Amazon's breakdowns were not fetched.
- India-culture examples (Hungry Tiger, Pahāri, Himachal, Recess in Varanasi, Goa Water Stories, Escape into the Rains) are from search excerpts only.

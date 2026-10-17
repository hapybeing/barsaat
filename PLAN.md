# BARSAAT v3 — "मेघदूत · The Cloud Messenger"
*A living Kangra folio. A website, not a game.*

Research behind every decision: `research/awards.md` (what wins and why), `research/tech.md` (how it's built), `research/culture.md` (monsoon in poetry, painting, music, life).

## 1. The idea in one breath
1,600 years ago Kalidasa wrote the *Meghaduta*: an exile on a mountain in central India asks the **first cloud of the monsoon** to carry a message north to his wife, and describes the whole route. It is the oldest monsoon story there is, and it is already a scroll: south → north, dry → drenched → clear, ending in a delivered message.

**You are the cloud.** You write a line to someone far away. You scroll north across a monsoon miniature painting that comes alive — the rains thicken chapter by chapter, named by the Hindi words for rain (बूँदाबाँदी → फुहार → रिमझिम → बौछार → झड़ी → मूसलाधार → खुल गया). At the end your message is written in rain on a window in the city of Alaka. Then you can **send the cloud** to a real person: a link that opens with *"A cloud has brought you a message."*

Tagline (Ryder, 1912): **"Even happy hearts thrill strangely to the cloud."**

## 2. Why this can win (mapped to the jury: Design 40 / Usability 30 / Creativity 20 / Content 10)
- **Design:** one unmistakable art direction nobody has shipped at award level — a *Pahari miniature folio* (oval vignette, floral border, gold rules, inscriptions in the margin) that is alive: gold snake-lightning, crane rows, ink clouds, painted rain streaks. Restrained palette (charcoal/indigo/parchment/gold/vermilion), one serif voice + Devanagari display.
- **Usability:** it scrolls like a site. Real DOM text, a visible chapter map (the rain-word ladder in the margin), keyboard & hash navigation, reduced-motion mode, sound off by default, ≤ 8 MB to first chapter, 3 quality tiers, portrait-first compositions.
- **Creativity:** the folio-as-UI; the rain ladder as navigation; "the storm is what you carried" (linger = cloud loads, which sets the next chapter's rain); the message written in rain; send-a-cloud links.
- **Content:** real poetry (public-domain Ryder translation), real paintings (Met/Cleveland open access) in a gallery interlude, real IMD onset data on the route map, the lived monsoon (petrichor/mitti attar, Malhar legend, paper boats) as margin notes.
- **Sound:** composed generatively with the story — tanpura + Raag Megh in calm chapters, Miyan ki Malhar phrases as the storm builds, jal-tarang drops tuned to the raga, tin roof, frogs, thunder as pakhawaj. Never autoplays.

## 3. Structure (one page, 9 movements)
0. **Loader / threshold** — an ink drop falls into a parchment field and blooms into **बरसात**; progress is a rain gauge filling (0 → 100 mm, "a cloudburst is 100 mm in an hour"). Then: *Enter with sound* / *Enter in silence*.
1. **Prologue — रामगिरि** (bundled with chapter 1 visuals). Verse I–II. The exile on a dusty peak. Then the message card: *"Write a line to someone far away. It never leaves this device."* (prefilled suggestion; skippable).
2. **Ch.1 बूँदाबाँदी · boonda-baandi** — the cloud arrives "as an elephant attacks a bank of earth in play". First dark drop-coins on red earth. Margin note: *petrichor & mitti attar.*
3. **Ch.2 फुहार · phuhaar — "Learn first, O cloud, the road"** — the route map: an old-folio map of India; Kalidasa's route drawn in gold while IMD onset isochrones (1 Jun Kerala → 8 Jul all-India) fill as you scroll. Cranes join you (IX).
4. **Ch.3 रिमझिम · rimjhim** — the Reva on black rocks, deer on the misty track, peacocks crying. Margin: paper boats.
5. **Ch.4 बौछार · bauchhaar** — Ujjain at dusk: slanting rain, rose-red twilight, rooftops, lightning lighting the lovers' road. Margin: Tansen and the Malhar legend.
6. **Interlude — "The rain in paint"** — a short horizontal gallery of 4 real 18th-century monsoon paintings (public domain), each gently alive (rain over it, lightning reflash), with captions and museum credits.
7. **Ch.5 झड़ी · jhadi** — the Ganges "like a flight of stairs from heaven let down"; rain that will not stop.
8. **Ch.6 मूसलाधार · mooslaadhaar → बादल फटना** — the Himalaya in full storm. Malhar at its height. A held breath: the folio floods with ink, silence, then…
9. **Ch.7 खुल गया · khul gaya — Alaka** — the clearing. A window; the wife counting days; **your message written in rain on the glass**; the secret token; final verse; autumn moon. Actions: **Send this cloud** (copy link) · Read the poem (Gutenberg) · Begin again. Colophon: sources, credits (Ryder 1912; Met & Cleveland Open Access; IMD normals), made by **hapybeing**.

## 4. Art direction
- **Frame:** the viewport *is* a folio. Parchment border with a floral band (procedural SVG/canvas pattern of red/pink blossoms on charcoal), gold rules, and an **oval vignette** opening into the live painting (oval in landscape, tall arch in portrait). Rain-word ladder inscribed down the right margin (Devanagari, red on yellow like folio inscriptions); chapter numerals in the top margin.
- **Painting:** layered painted scenes (sky band / far hills / mid / near) commissioned via image generation in a consistent Kangra style, using the Cleveland CC0 *Bhadon* folio as a style reference. Cut-outs on transparent backgrounds, parallaxed in WebGL.
- **Live layer (shaders):** ink-cloud sky with **gold-outlined scalloped edges**; rain as fine painted streaks with chapter-driven density and slant; gold **snake lightning** drawn as an animated stroke + painting relight; instanced **crane rows** flapping across; ink-bleed **watercolour dissolve** between chapters; paper grain + subtle print misregistration in the final pass; wet darkening of the painting as the rain grows.
- **Palette:** charcoal #232220 · slate #3E4347 · indigo-ink #1F2547 · mist #A69B88 · parchment #EAD8C3 · border gold #C9A24A · lightning gold #F2C14E · saffron #E0662A · vermilion #C0392B · hill green #8FA14A · crane white #F4F0E7.
- **Type:** rain words in **Tiro Devanagari Hindi** (display, huge) · verse in **Fraunces** italic (with matching roman for UI) · glosses/notes in **Mukta** · the message in **Kalam** handwriting. Devanagari animated by word/line (never split letters: breaks the shirorekha).

## 5. Interaction model
- **Scroll** = flight north (Lenis on desktop, native touch scroll on tablet). Pinned chapters, scrubbed timelines; text is DOM over the canvas.
- **Wind & load:** scroll velocity bends the rain and pushes the clouds; lingering in a chapter loads the cloud (a small gauge in the margin fills), raising the next chapter's rain.
- **Hold to thunder** (press & hold anywhere / Space): lightning in gold, a Malhar swell, a gust of rain. The one signature gesture.
- **Chapter ladder**: tap a rain word to jump; hash links (#rimjhim); arrow keys move chapter.
- **Send the cloud**: message encoded in the URL hash (never uploaded). Opening such a link starts with "A cloud has brought you a message" and plays the journey in reverse-meaning: the message waits in Alaka.

## 6. Tech
Vite + TypeScript · three.js (one fixed WebGL2 canvas, custom GLSL) · GSAP + ScrollTrigger · Lenis · Web Audio (generative, AudioWorklet-free for compat) · fonts self-hosted (Fontsource) · images WebP · build → dist → published to repo root (Pages: main /root). One clock: gsap.ticker → lenis.raf → ScrollTrigger → render. One state object (chapter, progress, rain, slant, storm, flash, load, wet) feeds GL, DOM and audio. Quality tiers by a timing probe (+ DPR caps 1.25/1.5, effects at half res), FPS cap 60, reduced-motion = static posters + crossfades.

## 7. Quality gates (each must pass before the next)
1. **Art gate:** generated layers consistent in style; viewed and approved by me against the Kangra reference; no artefacts, no text, no modern objects.
2. **Look gate:** each chapter screenshot (landscape + portrait) reads as a painting that breathes; no empty frames.
3. **Story gate:** all copy proofread; verses exact from Ryder; Devanagari correct.
4. **Feel gate:** first 5 s: something beautiful moves immediately; no dead scroll; transitions under 1 s.
5. **Tech gate:** no console errors; Lighthouse a11y/BP/SEO 100; payload budget; fps on SwiftShader not worse than v2; reduced-motion + keyboard + no-WebGL fallback work.
6. **Privacy gate:** no real name, town or region of the creator anywhere; credit hapybeing.

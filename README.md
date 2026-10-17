# Barsaat · मेघदूत — The Cloud Messenger

**Live:** https://hapybeing.github.io/barsaat/

You are the first cloud of the monsoon. An exile on a hill in central India has given you a message for his wife, far north on the slopes of Kailasa. You scroll north through a living Pahari miniature. The rain thickens chapter by chapter, and each chapter is named for a Hindi word for rain:

बूँदाबाँदी → फुहार → रिमझिम → बौछार → झड़ी → मूसलाधार → खुल गया

At the end, the message you wrote at the start is written in rain on her window. Then you can **send the cloud** to someone real. The message travels inside the link and is never uploaded.

After Kalidasa's *Meghaduta* (c. 5th century), in Arthur W. Ryder's public-domain translation (1912).

## How it was made
1. **Research** (`research/`): what won Awwwards, FWA and CSSDA Site of the Year 2023–25 and why (`awards.md`); how scroll-driven WebGL storytelling is built (`tech.md`); the monsoon in Indian poetry, painting, music and daily life (`culture.md`).
2. **Plan** (`PLAN.md`): concept, jury mapping, structure, art direction, interaction model, stack and quality gates.
3. **Art**: six chapter paintings made in the manner of the Kangra school, using a CC0 Cleveland Museum folio as the style reference. `art/bake.py` crops them to the folio format and bakes a mask for each (sky, water, foliage) that tells the shader which parts are alive.
4. **Build**: one full-screen fragment shader (`web/src/gl/shader.ts`) draws the folio: an arched window, gold rules, a floral border, and inside it the painting with breathing clouds, flowing water, swaying leaves, painted rain, gold snake-lightning, crane rows, ink-bleed chapter changes, the cloudburst, and the message on misted glass. All story text is real HTML.
5. **Sound** (`web/src/audio.ts`): synthesised live, with no samples. A Karplus-Strong tanpura, a bowed voice improvising on Raag Megh and Miyan ki Malhar, rain drops tuned like a jal tarang, a tin roof, frogs, crickets, peacocks, and pakhawaj thunder.

## Use
- Scroll to fly north. Linger and the cloud loads with rain.
- Press and hold anywhere (or hold **T**) to thunder.
- Tap a rain word to jump to a chapter.
- Sound is off until you choose it. Reduced-motion settings are respected.

## Stack
Vite + TypeScript, three.js with a hand-written GLSL shader, Lenis, Web Audio and Fontsource fonts (Fraunces, Tiro Devanagari Hindi, Mukta, Kalam). `npm run build` writes to `dist/`, and `scripts/postbuild.mjs` publishes the build to the repo root, which GitHub Pages serves.

## Credits
Words: Kalidasa, tr. Arthur W. Ryder (1912), Project Gutenberg. Paintings in "The rain in paint": The Metropolitan Museum of Art (Open Access) and The Cleveland Museum of Art (CC0). Onset lines are approximate, after IMD normals. The map shows coastlines only.

Made by **hapybeing**. Version 2, the paper boat, is in this repo's history.

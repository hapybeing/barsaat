# Barsaat · बरसात

**Live:** https://hapybeing.github.io/barsaat/

Write a wish on a page torn from a school notebook. Fold it into a paper boat. Then steer it through one monsoon night: down a flooded lane between houses, under the bridges of a canal, through a lightning storm on a wide river lined with temples and ghats, and out to open water where the clouds tear open onto the moon.

Dark clay lamps float on the way. Steer through them and they catch, fall in behind your boat, and each one plays the next note of a phrase in Raag Megh, the raag of rain clouds. A good run ends with a long procession of light on still water.

## What makes it

- **Nothing is a photo or a recording.** The city, the river and the sky are generated from the distance you have travelled, chunk by chunk, so the journey is endless and costs almost nothing to stream.
- **Your writing is the boat.** The page canvas becomes the boat's texture. Every vertex knows where it lies on the flat sheet and where it lies on the boat, and the fold is a staggered, arcing blend between the two, so your ink travels with the paper. The paper slowly soaks as it rains.
- **Water in one shader.** A ring for every raindrop, wind chop, a Kelvin-style wake, reflections of the walls with their lit windows (ray-cast against the channel), the moon's path, and long broken streaks under every lamp from glossy reflection on a rough surface.
- **Lightning** grown by midpoint displacement with forks, re-striking along one channel, lighting the clouds from inside; thunder arrives after the flash, later for distant strikes.
- **Sound, all synthesised:** rain on tin roofs and water, the lap of the current, paper creasing, a tanpura drone (Pa, Sa, Sa, low Sa), santoor-like notes for each lamp, temple bells as you pass, crickets once it clears.
- **Built for a tablet:** adaptive resolution, one shared light list (16 nearest lights), instanced rain and glows, no post-processing pass.

## How to play

- Touch and hold to steer toward your finger; keep holding to blow the boat along.
- Keyboard: ← → steer, space blows.
- At the end: keep drifting (the rain comes and goes forever), fold another, or save a postcard.

## Code

- `web/src/main.ts` the state machine (gate, page, fold, sail, finale, drift), camera, lights, input
- `web/src/world/` path (the river as a function of distance), water, sky, banks (lane, canal, ghat, open), boat (the fold), diyas, rain, glows, lightning
- `web/src/page.ts` the notebook page you write on
- `web/src/audio.ts` the synthesised score

Vite + TypeScript + three.js with hand-written GLSL. `npm run build` builds to `dist/`, and `scripts/postbuild.mjs` publishes it to the repo root for GitHub Pages.

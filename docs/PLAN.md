# BARSAAT · बरसात
*A window in Bhagalpur, a monsoon evening on the Ganga. Touch the glass.*

## The idea in one breath
You stand at an upstairs window above a ghat at dusk. The glass is fogged; rain beads and runs down it. Your finger is your finger: wipe to see the river, write in the fog, hold still to breathe a fresh cloud onto the glass. Over about three minutes the monsoon builds to a downpour and lightning, then clears, and diya lamps float out on the water. Rain slowly erases everything you wrote. Nothing to scroll, nothing to click through. Just a place.

## Signature moments (what a juror remembers)
1. **The title is written for you, in the fog.** An invisible finger writes "बरसात" across the glass on arrival, then the drops start eating it. All UI text (title, hint, credits) is drawn into the fog this way. No HUD.
2. **Squeak.** Wiping makes a glass squeak whose pitch and grain follow your finger speed.
3. **Breath.** Press and hold: a warm patch of condensation blooms under your finger with a soft exhale. Then you write in it.
4. **Lightning.** The whole river is lit for a heartbeat through every drop on the glass; thunder arrives a distance-correct second later. (Soft, max one flash per 4 s, disable-able: photosensitivity safe.)
5. **Drops are lenses.** Each bead shows a tiny upside-down river, like real water on glass.
6. **The clearing.** Rain thins, the fog stops returning, lamps drift out from the ghat, a temple bell. A last line is written in the fog, then the cycle quietly begins again.

## Art direction
- One photographic plate (generated, art-directed: Ganga ghat, temple, boats, monsoon dusk; `art/plate-dusk.png`). It is always seen *through wet, fogged glass*, which hides any generation artefacts and makes it read as a real place.
- Window: a dark wooden frame with a classic Indian iron grille, out of focus in the foreground; warm room-lamp reflection on the glass.
- Palette is the plate's: indigo dusk, wet slate, sodium amber. Fog is a cool grey-blue scatter. No extra UI colour.
- Type: **Tiro Devanagari Hindi** for बरसात and Hindi lines, **Cormorant Garamond italic** for English lines. Text appears as finger-writing in fog, so the "font" is mostly the stroke.

## Weather score (state machine, ~180 s loop, also user-nudgeable)
`arrive (fog thick, drizzle) → build (drops multiply) → downpour (big runners, lightning) → ease → clear (fog stops regrowing, lamps, bell) → night → drizzle returns`.
One `Weather` object drives GL uniforms, the drop spawner, the fog regrow rate and the audio mix. Nothing else owns time.

## Tech (all hand-written, no engine)
- **Vite + TypeScript**, raw **WebGL2** (WebGL1 path for old devices), **GLSL**.
- Passes each frame:
  1. **Drop sim (CPU, ~150–400 drops)**: gravity vs. stickiness, merge on contact, runners leave trails of micro-beads. Rendered as instanced sprites into a half-res **water map** (normal.xy, thickness).
  2. **Fog sim (GPU ping-pong, quarter res)**: fog regrows by weather; finger strokes subtract (capsule brush between frames, speed-dependent width); breath adds; runner trails subtract; written-text masks subtract over time.
  3. **Composite**: plate (sharp + pre-blurred mip) → fogged areas sample the blur and lift toward fog colour → drops refract the sharp plate (inverted lens) with rim + specular from the room lamp → grille/frame in front → lightning exposure + bokeh lamps.
- **WebAudio, procedural**: rain bed (filtered noise layers tracking intensity), individual drop ticks, glass squeak (bandpassed noise driven by finger speed), breath, thunder (distance-delayed), temple bell (additive partials). One gesture-gated start: two buttons on the first screen, "Enter with sound" / "Enter quietly".
- **Performance**: sims at reduced resolution, one full-res composite pass, DPR cap 1.5 on tablets, render pauses when hidden, adaptive quality if frame time > 20 ms for 2 s. Target 60 fps on a mid-range Android tablet.
- **Fallbacks**: no WebGL → the plate with CSS blur and the poem as text. No JS → readable page. Reduced motion → no lightning, slow drops. Keyboard: arrow keys move a "finger", space breathes; every control focusable.

## Content (the 10%)
A short bilingual poem in six lines, one per weather phase, written into the fog when that phase starts. Plus a closing credit in the fog: "Barsaat · Gaurang Kumar · Bhagalpur".

## Build order (each gate checked in the QA rig before moving on)
1. Vertical slice: plate + fog sim + finger wipe + composite. **Gate:** screenshot reads as real fogged glass at tablet sizes.
2. Drop sim + refraction + trails clearing fog. **Gate:** looks like rain on glass, 60 fps budget on CPU-GL profile.
3. Weather state machine, lightning, grille, room reflection, lamps.
4. Sound.
5. Fog-writing UI (title, lines, credits), entry screen.
6. Fallbacks, a11y, meta, OG image, perf pass, full device matrix QA, then publish and inspect live.

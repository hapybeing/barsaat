# Barsaat · बरसात

**A monsoon evening at a window over the Ganga, in Bhagalpur.**
Live: https://hapybeing.github.io/barsaat/

You stand at an upstairs window above a ghat. The glass is fogged. Wipe it with your finger to see the river, write on it, hold still to breathe a fresh cloud onto it. Over about three minutes a storm builds, breaks and clears. Then diyas float out on the water, a temple bell rings across the river, and it starts to rain again.

There's no menu and no scrolling. The title, the hints and a short Hindi and English poem are all written into the fog by an invisible finger.

## How it works

| Piece | What it does |
| --- | --- |
| `web/src/gl/shaders.ts` | All the GLSL: drop sprites, the fog simulation, and the composite where drops act as lenses |
| `web/src/gl/renderer.ts` | Raw WebGL2, no engine. Four passes a frame: bead layer, water map, fog step, composite |
| `web/src/sim/drops.ts` | Rain on glass, simulated drop by drop: small drops cling, big ones slide, stall, merge and leave beaded trails |
| `web/src/weather.ts` | The single clock. Rain, fog regrowth, the grade, lightning, lamps, poem and sound all read from it |
| `web/src/input.ts` | Touch, mouse and keyboard become wipe strokes and breath. Multi-touch works |
| `web/src/writer.ts` | Writes text into the fog behind a wobbling pen front |
| `web/src/audio.ts` | Every sound is synthesised live: rain, ticks on the pane, finger squeak, breath, thunder that arrives after the flash, a temple bell, crickets |

**Realism comes from one photograph, and the life comes from code.** The river and temple are a single plate, always seen through the glass. Everything procedural is the stuff that moves: water, refraction, fog, light. That rule came out of the teardown of my last piece (`docs/TEARDOWN.md`).

### Rendering details

- The water map is stored premultiplied (normal, thickness × coverage), so drops can be faded and erased with plain blending without corrupting their normals.
- The fog is a ping-pong simulation at half resolution. It regrows unevenly (faster at the bottom of the pane), clears where water runs, takes the shape of a finger with a ragged edge, and keeps a separate breath channel that's whiter and evaporates faster.
- Each drop refracts a small, upside-down, sharp view of the world, with a darker rim and highlights from the room lamp behind you.
- Output resolution adapts to the device: it steps down when frames run long and recovers slowly. The simulations keep their state.
- Rendering pauses when the tab is hidden.

### Accessibility

- Readable with no JavaScript: the view from the window and the poem.
- Without WebGL2 it falls back to the same still view and the poem.
- The poem is announced to screen readers as it's written.
- Keyboard: arrow keys move your finger, space breathes, `n` moves the weather on.
- Lightning is two or three soft flickers, never faster than about 8 Hz, with long gaps. It's softened automatically with `prefers-reduced-motion`, and there's a toggle.

## Build

```
npm install
npm run build   # type-checks, builds web/ into dist/, then publishes dist/ to the repo root for GitHub Pages
```

GitHub Pages serves the repo root (main branch, `/`). Source lives in `web/`, `tools/icons.py` makes the icons.

## Credits

Made by Gaurang Kumar in Bhagalpur, on an Android tablet.
Type: Tiro Devanagari Hindi (Tiro Typeworks) and Cormorant Garamond (Christian Thalmann), both SIL Open Font License.

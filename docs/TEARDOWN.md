# Bixi teardown (from Gaurang's tablet recording, 2026-10-11)

What his recording showed, frame by frame, and the lesson each one forces.

| # | What happened on his tablet | Root cause | Rule for the next build |
|---|---|---|---|
| 1 | Carving is murky brown-on-black; letters barely read. The "lamp" looks like a smudge of fog. | I rendered a *material* (stone) procedurally. Procedural materials look like noise unless you have real scans. | Render only what procedural graphics does beautifully: **light, water, refraction, blur, particles, glow**. Anything that must look "real" comes from a single high-quality photographic plate. |
| 2 | Body text scrolls straight through the fixed nav and bottom HUD. | A document layout with fixed chrome and no masks. | No scrolling document. One full-screen stage; the few words on screen are placed by the scene, never under chrome. |
| 3 | The canvas carving ("ASCENT") and the DOM card ("Repro Audit") disagree and collide. | Two systems (WebGL + DOM) animated separately and only loosely synced to scroll. | One source of truth: a scene state machine drives both GL and DOM. |
| 4 | Hero canvas ends in a hard edge / black band. | Canvas section height didn't match the stage on a resizing Android viewport. | Stage is `position:fixed; inset:0` with `100dvh`, sized once per real resize. |
| 5 | Four minutes of scrolling, nothing that *rewards* you. | It was a portfolio wearing an effect. The interaction was decoration. | The interaction is the whole point: a verb you understand in 2 seconds and keep playing with for minutes. |
| 6 | Dark-on-dark at tablet brightness. | Designed on a bright monitor in my head. | Midtones must hold at 50% screen brightness; check luminance histograms of every QA shot. |
| 7 | Sound/Motion pills, a nav, a clock, a percentage: lots of UI. | Award checklists applied literally. | UI only where it earns its place. Everything else is diegetic (inside the world). |

What was good and stays: an authored idea with a myth behind it, a strict palette, a single hero interaction, fallbacks, no console errors, a11y discipline.

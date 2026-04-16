# Screenshot Gen — Doodle Mashups 2.1

Quick-start for building App Store screenshots for Doodle Mashups 2.1.

## Run the tool

```bash
cd ~/Projects/tools/screenshot-gen
npm run dev
```

Open http://localhost:5173

## Workflow

1. **Add your raw screenshots**
   - Drag any simulator screenshot onto the dropzone
   - Raw screenshots live at: `~/Projects/loving-art/carolina/ios/doodle-mashup-ios/screenshots/simulator/`

2. **Build each of the 10 screenshots**
   - Use the **+** button to add a new config for each screenshot
   - Paste the caption into Headline / Subheadline
   - Adjust scale + Y offset so the screenshot sits nicely on the gradient
   - Switch between device sizes to preview iPhone vs iPad

3. **Export**
   - **Export all configs · current size** — exports ZIP of all screenshots for the selected device size
   - **Export all configs · all sizes** — exports ZIP with folders for every device size

## Screenshot Copy (from SCREENSHOT_BRIEF)

| # | Headline | Subheadline | Recommended raw image |
|---|----------|-------------|----------------------|
| 1 | Mix 2 Words. Draw Something Wild! | 172 Mashup Prompts | `01-home.png` |
| 2 | Thousands of Silly Combos! | Every round is a surprise | `07-game-cupcake-tooth.png` |
| 3 | Race the Clock! | 30 sec to 5 min challenges | `02-draw-icecream-rainbow.png` |
| 4 | 15 Colors + Pro Tools | Pen, marker, eraser & more | `02-draw-icecream-rainbow.png` (colors expanded) |
| 5 | Or Just Draw — No Timer! | Perfect for calm creative time | `03-draw-lighthouse-octopus.png` |
| 6 | Every Drawing Is a Masterpiece | Save & share your art | `05-done-dialog.png` |
| 7 | No Ads. No Tracking. Just Fun. | COPPA compliant & kid-safe | `01-home.png` |
| 8 | Perfect for Ages 5-12 | Birthday parties • Road trips • Family nights | `04-draw-taco-bunny.png` |
| 9 | By Carolina The Doodler | The artist behind the doodle videos | `06-splash.png` |
| 10 | Start Mashing — Download Now! | $4.99 — one-time, no subscriptions | `01-home.png` |

## Brand defaults (already set)

- **Gradient**: Carolina blue `#1CADFA` → hot pink `#E42792` at 135°
- **Text**: white `#ffffff` with soft shadow for readability
- **Screenshot scale**: 78% (good starting point for phone screenshots)
- **Text Y offset**: 260px (places text in the top third)

## Tips

- **Newlines in headlines**: Type `\n` in the Headline field to force a line break (e.g. `Mix 2 Words.\nDraw Something Wild!`)
- **iPad screenshots**: You may want to increase **Screenshot scale** to ~85% and reduce **Y offset** slightly
- **Shadow**: Increase shadow blur if text competes with a busy screenshot
- **Simulator screenshots are 1320×2868** — the tool will render them at the exact App Store size (1290×2796)

## Required uploads for App Store Connect

You only need to upload:
- **iPhone 6.7"** (1290×2796) — Apple auto-scales to other iPhone sizes
- **iPad Pro 12.9"** (2048×2732) — Apple auto-scales to other iPad sizes

## Localization quick refs

**Spanish (es-MX)**
- 1: ¡Mezcla 2 Palabras. Dibuja Algo Loco!
- 2: ¡Miles de Combos Divertidos!
- 7: Sin Anuncios. Sin Rastreo. Solo Diversión.

**French (fr-CA)**
- 1: Mélange 2 Mots. Dessine Quelque Chose!
- 2: Des Milliers de Combos Amusants!
- 7: Pas de Pubs. Pas de Pistage. Que du Fun.

**Portuguese (pt-BR)**
- 1: Misture 2 Palavras. Desenhe Algo Louco!
- 2: Milhares de Combos Engraçados!
- 7: Sem Anúncios. Sem Rastreamento. Só Diversão.

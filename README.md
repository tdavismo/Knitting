# Daphne · Knitting Stitch Tracker

A small mobile-first web app for tracking progress on the **Daphne** lace
laurel-leaf scarf. Cast on 30 stitches, then work the 24 rows and repeat them
12 times. Tap each stitch group as you knit it to grey it out so you never lose
your place.

## Features

- **Tap to track** — every comma-separated stitch group in the pattern becomes a
  tappable chip (labelled S1, S2, …). Tap it once to mark it done (greyed out),
  tap again to undo.
- **Active row & next group** — the row you're working on is highlighted and the
  next group to knit gently pulses.
- **12 repeats** — use the `+` / `−` buttons in the header to move between
  repeats. Each repeat keeps its own progress.
- **Saved on your device** — progress is stored in your browser's
  `localStorage`, so it survives closing the tab or app.
- **Stitch glossary** — the pattern's abbreviations (ssk, p2tog, sk2p, …) are
  included for quick reference.

## Run locally

It's a static site — just open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publish on GitHub Pages

1. Push this repository to GitHub (already done if you're reading this there).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
4. Choose the branch (e.g. `main`) and the `/ (root)` folder, then **Save**.
5. After a minute the app is live at
   `https://<your-username>.github.io/<repo-name>/`.

Open that URL on your phone and add it to your home screen for an app-like
experience.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and pattern text |
| `styles.css` | Mobile-first styling |
| `app.js` | Pattern data, tracking logic, and `localStorage` persistence |

---

Pattern: *Daphne* © 2011 Saranac Hale Spencer & the Defarge Knittery.

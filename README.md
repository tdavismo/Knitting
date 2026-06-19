# Knitting Stitch Tracker

A mobile-first web app for tracking progress through knitting patterns. It opens
on a **project library** — import a pattern PDF (or paste rows manually) and tap
your way through each row. Ships with the **Daphne** lace scarf as a built-in
sample.

## Features

- **Multiple projects** — a library screen holds every pattern you track. Open
  one, knit, come back later, switch to another.
- **Import a PDF** — pick a pattern PDF and the app reads it *entirely in your
  browser* (via PDF.js), pulling out the cast-on line, the per-row instructions,
  and how many times to repeat them. You can review and edit everything before
  the project is created. If a PDF can't be parsed automatically, you can paste
  or type the rows in instead.
- **Robust pattern parsing** — handles varied row headers (`Row 1 (RS):`,
  `Row 1 — …`, `Rounds 1-3:`), expands range rows like
  *"Row 6 and all following WS rows until row 34"* into the individual rows,
  keeps bracketed/starred repeats (`[3/3, k1] × 2`, `*k1, p1*`) as single
  tappable groups, and strips stitch-count annotations (`(42 sts)`).
- **Stitch lexicon & glossary** — a built-in dictionary of *standard*,
  non-copyrightable knitting abbreviations (Craft Yarn Council–style: k, p,
  k2tog, ssk, yo, tbl, psso, m1, cables, …) auto-builds a glossary for whatever
  abbreviations a pattern actually uses. An imported PDF's own abbreviation key
  is also captured (kept on your device only).
- **Tap to track (cursor model)** — each comma-separated stitch group becomes a
  tappable chip (S1, S2, …). Tapping a group marks it *and every earlier group*
  done (greyed out). Tapping an already-done group rolls back to just before it.
- **Active row & next group** — the row you're working on is highlighted and the
  next group to knit gently pulses.
- **Knitting mode** — a full-screen, distraction-free view showing the current
  stitch group large. **Tap anywhere to advance**; a small ↶ button reverses.
  It shows the current row in context plus a preview of the next step, and
  prompts you to start the next repeat when one finishes.
- **Per-repeat progress** — the `+` / `−` buttons move between repeats and each
  repeat keeps its own progress.
- **Saved on your device** — patterns and progress live in `localStorage`; the
  app uploads nothing. Progress from the earlier single-pattern version is
  migrated automatically.
- **Stitch glossary** — abbreviations (ssk, p2tog, sk2p, …) are shown when the
  pattern includes them.

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
| `index.html` | Library, tracker, knitting-mode, and import-modal markup |
| `styles.css` | Mobile-first styling |
| `app.js` | Project model, PDF/manual import, cursor tracking, knitting mode, `localStorage` persistence + migration |

PDF reading uses [PDF.js](https://mozilla.github.io/pdf.js/) loaded from a CDN at
runtime, so importing a PDF needs an internet connection; everything else works
offline once the page has loaded.

## Copyright & privacy

Knitting patterns are copyrighted by their designers. This app is a personal
tracking tool: imported PDFs are parsed **in your browser** and the results are
stored only in your device's `localStorage` — nothing is uploaded, shared, or
committed to this repository. The only knitting content in the source code is
the public-domain *Daphne* sample and a dictionary of **standard stitch
abbreviations**, which are common terminology and not copyrightable. Please
don't redistribute patterns you've imported.

---

Built-in sample pattern: *Daphne* © 2011 Saranac Hale Spencer & the Defarge Knittery.

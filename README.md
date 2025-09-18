# Budget Planner (SPA Version)

This is a Single-Page App (SPA) version of the Budget Planner.

- `index.html` – shell with nav tabs and results panel
- `app.js` – router and calculator logic
- `income.js` – renders Income form
- `page.js` – renders generic expense form
- `utils.js` – storage, calculations, CSV handling
- `styles.css` – styling
- `manifest.json`, `sw.js` – PWA files

Navigation uses `#hash` routing. Example: `#income`, `#housing`.
All data stored in `localStorage`. CSV export/import supported.

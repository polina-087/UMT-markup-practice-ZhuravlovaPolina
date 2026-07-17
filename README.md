# Flora

A modern, responsive flower-shop landing page built with a scalable component-based architecture and a clean ES6+ client-side layer. Features retina graphics, accessible modals, and a data-driven dynamic catalogue.

**Live:** later

## Architecture & Features

**UI & Styling (Modern Approach)**
- **Design Tokens:** Extensive use of CSS Custom Properties for typography, colors, and layout metrics (e.g., `--c-brand-green`, `--fs-h2`, `--layout-pad-x`) to ensure consistency.
- **Component-Based CSS:** Clean, modular UI components (`.product-card`, `.btn-solid`, `.form-order`) instead of rigid legacy naming conventions.
- **Idiomatic CSS:** Strict property sorting standards (Positioning ➔ Box Model ➔ Typography ➔ Visuals ➔ Animation) for optimal readability and browser rendering.
- **Responsive Design:** Mobile-first approach scaling smoothly across 3 breakpoints (**375 / 768 / 1440**).
- **Optimized Assets:** Semantic image naming (e.g., `bg-hero-main.jpg`, `img-florist-about.jpg`) and a unified SVG sprite (`images/sprite.svg`) for UI icons.
- W3C-valid HTML and CSS.

**Interactive Layer (Advanced JavaScript)**
- **ES6+ Syntax:** Built with modern JS standards including arrow functions, optional chaining (`?.`), and concise spread operators.
- **Data-Driven Rendering:** The Bouquets catalogue and Top-Selling carousel are rendered dynamically from a REST API using `axios`, `async/await`, and ES Modules.
- **Pagination & Filtering:** Catalogue state is managed via a single source of truth, handling pagination ("Show More") and category filtering dynamically.
- **Accessible Modals & Forms:** Centralized modal engine featuring a focus trap, body scroll lock, backdrop click, and `Esc` key support. Form includes native validation, a custom SVG checkbox, and a success toast notification.
- **Retina Ready:** Dynamic `@2x` high-DPR assets loaded via `srcset` and `@media (min-resolution: 2dppx)`.

## Data / API

The frontend talks to a hosted **mockapi.io** project through a single adapter (Adapter Pattern), making the backend easily swappable.

- `js/config.js` — `API_BASE_URL` and `PAGE_LIMIT` (the single decoupling point).
- `js/api.js` — the axios adapter (`getBouquets`, `getBestsellers`, `postOrder`).
- `db.json` — the data seed (11 bouquets) that mirrors the API; also usable with a local `json-server` as a mock backend.

Endpoints used: `GET /bouquets?page=&limit=&category=&featured=`, `POST /orders`.
Top-Selling = `featured:true`; the Bouquets catalogue = `featured:false`.

To run against a **local json-server** instead of the hosted API:

```bash
npx json-server --watch db.json --port 3000
# then set API_BASE_URL in js/config.js to http://localhost:3000
Structure
index.html
css/styles.css
js/
  config.js     # API base URL + page limit configs
  api.js        # Axios adapter (backend boundary)
  render.js     # Template strings & DOM injection
  bouquets.js   # Catalogue state: pagination + category filtering
  carousel.js   # Horizontal scroll slider engine
  modal.js      # Accessible modal engine (focus trap, scroll lock)
  order.js      # Product details logic + form submission
  main.js       # App entry point & bootstraper
  menu.js       # Mobile navigation logic
images/         # Semantic assets (bg-*, img-*, bouquet-*), sprite.svg, favicon.svg
db.json         # Bouquet data seed / json-server source
Run locally
The app uses ES modules, so it must be served over HTTP (not opened directly as file://). From the project root:
python3 -m http.server 8000
Then open http://localhost:8000.
Validate
HTML:
curl -s -H "Content-Type: text/html; charset=utf-8" \
  --data-binary @index.html "https://validator.w3.org/nu/?out=json"
CSS:
curl -s -F "file=@css/styles.css;type=text/css" -F "profile=css3svg" -F "output=json" \
  "https://jigsaw.w3.org/css-validator/validator"

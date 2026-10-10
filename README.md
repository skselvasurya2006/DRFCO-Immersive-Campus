# DRFCO HOLDING — Immersive Campus

A responsive single-page company experience with a procedural Three.js campus, clickable service buildings, cinematic guided tour, service detail panels, content sections, partner marquee, and callback form.

## Requirements
- Node.js 18.18+ (Node 20 LTS recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (normally `http://localhost:5173`).

## Production build
```bash
npm run build
npm run preview
```
The optimized static build is written to `dist/`. Deploy that folder to your static hosting provider.

## Project structure
```text
drfco-campus/
├── index.html
├── package.json
├── README.md
└── src/
    ├── main.jsx       # React entry point
    ├── App.jsx        # Page sections, tour UI, panels, form
    ├── Campus.jsx     # Three.js campus and building interactions
    ├── data.js        # Editable services, content, partners, offices and tour order
    └── styles.css     # Responsive visual system and animations
```

## Edit the content
Edit `src/data.js`. Service records contain their descriptions, offerings, accent colors, icons, world-space positions, dimensions, shapes, and tour captions. The same data object drives the campus labels, details panel, service links, Alpha Doors product grid, and tour labels. Replace partner text wordmarks with approved logo assets when available.

## Adjust the tour
Edit `tourOrder` in `src/data.js`. The camera target for each stop comes from the selected service's `position` and `size` in `services`. Tour dwell time is in `src/App.jsx` in the `setTimeout` call inside the tour effect (currently 7.2 seconds). Pause freezes progression and camera movement while the scene remains rendered.

## Real assets and branding
- Replace the procedural building meshes in `src/Campus.jsx` with optimized GLTF/GLB models from your architect or 3D artist. Keep the service IDs from `src/data.js` to preserve interactions.
- Replace the geometric brand mark in `src/App.jsx` with DRFCO's approved SVG logo.
- Replace text wordmarks in the partner marquee with approved SVG/WEBP logos.
- Use compressed KTX2 textures and Draco-compressed GLB models for production assets.
- Verify any certification statement, phone numbers, addresses, and partner names with the business before launch.

## Callback form integration
The form validates required fields and email format, then shows a success state. It is deliberately front-end-only: connect `submit` in `CallbackForm` (`src/App.jsx`) to your CRM or secure backend endpoint before publishing, and avoid placing secret API keys in client code.

## Accessibility and performance notes
- Keyboard users can Tab to navigation and buttons; Escape closes the building detail panel and exits the tour.
- The visible Reduce motion toggle disables automatic tour progression and CSS motion. The system `prefers-reduced-motion` preference is also respected by CSS.
- Mobile uses a bottom-sheet detail panel and compact tour controls. Canvas pixel ratio is capped at 1.6.
- The scene is procedural and uses simple meshes; this is a lightweight starter, not a photorealistic architectural visualization. Add optimized models, real HDRI lighting, post-processing bloom, and adaptive quality monitoring for a final high-fidelity release.
- A 2D content fallback is provided by the full page sections if WebGL is unavailable, although the interactive campus itself requires WebGL.

# Who Is Shark — Design System

This is a React/Vite developer portfolio. The home route contains the cinematic 3D hero; `/design-system` keeps the Phase 1 preview available. Run `npm install` once and then `npm run dev` to start the Vite development server. Use `npm run build` to create a production build.

The hero loads the katana from `public/models/demon_slayer_kokushibo_sword.glb`. To replace it, place your GLB in `public/models/` and update `MODEL_PATH` in `src/scene/Katana.jsx`. The model is automatically centered and scaled to a 2.8-unit longest dimension; adjust that target in `src/scene/Katana.jsx` to change its displayed size. If the model is unavailable or fails to load, the scene uses a curved, procedural katana.

The hero scene is lazily loaded, pauses when the hero scrolls out of view, uses a reduced particle/effects setup on mobile and low-power devices, and switches to a CSS moon-and-water background if WebGL is unavailable. Lenis, the slash reveal, the custom cursor, and scene motion honor `prefers-reduced-motion`.

## Theme tokens

The default `water` palette is defined on `:root`. Set `data-style` on the root `<html>` element to `flame`, `thunder`, or `wind` to switch palettes. Every style provides:

- `--bg-deep`, `--bg`, `--surface`
- `--primary`, `--highlight`, `--accent`
- `--text`, `--text-muted`, `--glow`, `--border`

Tailwind color utilities are available as `bg-bg`, `bg-bg-deep`, `bg-surface`, `bg-primary`, `bg-highlight`, `bg-accent`, `text-text`, `text-text-muted`, and `border-border`. Font utilities are `font-heading`, `font-brush`, and `font-body`.

## CSS utilities

- `.pattern-haori` — low-contrast checkered surface
- `.pattern-uroko` — repeating triangle scale
- `.mist-overlay` — layered radial fog
- `.glow-edge` — border and theme glow
- `.slash-line` — short diagonal accent

## Base components

- `Button` — `primary` and `slash` variants
- `Card` — themed patterned surface
- `SectionHeading` — kanji, heading, subtitle, and slash accent
- `SlashDivider` — full-width diagonal divider
- `StyleSwitcher` — four persisted color-style controls

The style switcher stores its selection in local storage. All styles respect reduced-motion preferences.
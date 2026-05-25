# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (binds to all interfaces via --host)
npm run build     # Production build
npm run preview   # Preview production build locally
```

No lint or test commands are configured.

## Architecture

**Astro 5 SSR** portfolio site deployed on **Netlify** (`output: 'server'`, `@astrojs/netlify` adapter). Content is managed via **Keystatic CMS** (GitHub-backed, repo: `d3rdomi/portfolio`), accessible at `/admin`.

**React** is used only for `src/components/Carousel.jsx` (Embla Carousel). All other components are `.astro`.

**Styling** is vanilla CSS — no framework. Each page/section has a dedicated stylesheet in `src/styles/` (e.g., `design-style.css`, `about-me-style.css`). Global base styles are in `src/styles/global-style.css`. Component-scoped styles go inside `<style>` blocks in `.astro` files.

## Content Model

Three Keystatic collections, all using `.mdoc` (Markdoc) format except photography:

| Collection | Files | Format | Key fields |
|---|---|---|---|
| `design` | `src/content/design/` | `.mdoc` | `title`, `pubDate`, `heroImage`, `text`, `backgroundColor`, `ImageCarousel[]`, `link` |
| `concepts` | `src/content/concepts/` | `.mdoc` | same as design |
| `photography` | `src/content/photography/` | `.md` | `title`, `heroImage`, `images[]` |

Plus an **about-me singleton** (`src/content/about-me/`) with `portrait` and `text` fields.

Schemas are defined in [src/content/config.ts](src/content/config.ts).

## Routing & Layout Pattern

File-based routing under `src/pages/`. Dynamic collection pages follow this pattern:

```
src/pages/design/index.astro         → lists all design entries
src/pages/design/[...slug].astro     → renders a single entry
src/layouts/design-undersite.astro   → layout used by the slug page
```

The same pattern applies for `concepts/` and `photography-neu/`.

## Image Locations

- **Content images** (design, concepts, home): `public/assets/{design,concepts,home}/` — served as static assets, referenced by path string in Keystatic
- **Photography source images**: `src/assets/photography/` — processed by Astro's image pipeline
- **About section images**: `public/assets/about/`

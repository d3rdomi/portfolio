# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev         # Start dev server (binds to all interfaces via --host)
npm run build       # Production build
npm run preview     # Preview production build locally
npm run translate   # Fills empty `en` fields of bilingual content via scripts/translate.mjs
```

No lint or test commands are configured.

## Architecture

**Astro 5 SSR** portfolio site deployed on **Netlify** (`output: 'server'`, `@astrojs/netlify` adapter). Content is managed via **Keystatic CMS** (GitHub-backed, repo: `d3rdomi/portfolio`), accessible at `/keystatic` (see [keystatic.config.ts](keystatic.config.ts); set `storage.kind: 'local'` there for local testing, but don't commit it).

**React** is used only for `src/components/Carousel.jsx` (Embla Carousel). All other components are `.astro`.

**Styling** is vanilla CSS — no framework. Each page/section has a dedicated stylesheet in `src/styles/` (e.g., `design-style.css`, `design-undersite-style.css`, `about-me-style.css`). Global base styles and shared text classes (`.card-title`, `.subline`, `.download-btn`) are in `src/styles/global-style.css`. Component-scoped styles go inside `<style>` blocks in `.astro` files.

## Internationalization (DE / EN)

The site is bilingual; German is the default. All pages live under `src/pages/[lang]/…` and `src/middleware.ts` redirects `/` (by browser language) and unprefixed or legacy paths (`/design`, `/concepts`) to `/de/…` / `/en/…`.

- **UI strings**: `src/i18n/ui.ts`, accessed via `useTranslations(lang)`; paths via `localizePath(lang, '/online-design')`.
- **Content fields**: bilingual Keystatic fields use the `tText()` helper (`{ de, en }`, EN optional) with the matching Zod `tText` in `src/content/config.ts`. Render them with `pick(field, lang)` — it falls back to German when the English text is empty. Long body text is a Markdoc document (German) plus a `contentEn` text field.

## Content Model

Keystatic collections (all `.mdoc`, Markdoc with YAML frontmatter) and singletons:

| Name | Path | Key fields |
|---|---|---|
| `online-design` collection | `src/content/online-design/` | `title`, `subline`, `pubDate`, `thumbnail`, `heroImageDesktop/Mobile`, `altText`, `content`/`contentEn`, `button`, `backgroundColor`, `ImageCarousel[]`, `blocks[]`, `copyright` |
| `print-design` collection | `src/content/print-design/` | same as `online-design` |
| `photography` collection | `src/content/photography/` | `title`, `pubDate`, `altText`, `heroImage`, `text`, `images[]`, `content`/`contentEn` |
| `home`, `about` singletons | `src/content/home/`, `src/content/about-me/` | portrait, tagline / about text (+ English variants), CV PDFs |
| `portfolioDownloads` singleton | `src/content/portfolio-downloads/` | `pdfDe`, `pdfEn` |

`subline` (bilingual, 1–3 words, e.g. "Website-Redesign") says what was done in a project. It is shown below the card title on the Online-/Print-Design overview and above the H1 on the project page.

Schemas for Astro are defined in [src/content/config.ts](src/content/config.ts) — keep them in sync with `keystatic.config.ts`.

## Routing & Layout Pattern

File-based routing under `src/pages/[lang]/`. Dynamic collection pages follow this pattern:

```
src/pages/[lang]/online-design/index.astro      → lists all online-design entries
src/pages/[lang]/online-design/[...slug].astro  → renders a single entry
src/layouts/design-undersite.astro              → layout used by online-design AND print-design slug pages
```

`print-design/` mirrors `online-design/` (same layout). `photography/` uses `src/layouts/photography-undersite.astro`.

## Image Locations

All content images are static assets in `public/assets/<section>/` and referenced by path string in Keystatic: `online-design`, `print-design`, `photography`, `home`, `about`, `links`, `downloads` (PDFs).

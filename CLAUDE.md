# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static landing page for "Odesza" — a personal brand site for online tarot readings. Pure HTML/CSS/JS with no build tools, no frameworks, no package manager. Telegram is the primary lead channel (bot link + direct message).

## Local Development

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

No build step, no compilation. Edit files and refresh the browser.

## Architecture

- **`index.html`** — Single-page site. Sections: hero, about, specializations, pricing, testimonials, free-reading, footer. All navigation is anchor-based smooth scrolling.
- **`css/style.css`** — All styles in one file. Uses CSS custom properties (`:root` vars) for the dark/gold color theme. Responsive breakpoints at 1024px and 767px. Cache-busted via `?v=N` query param in the HTML link tag.
- **`js/main.js`** — All JS in one file. Four concerns:
  1. **Scroll-triggered animations** via `IntersectionObserver` (`.animate-on-scroll` → `.visible`)
  2. **Canvas spiral background** — full-viewport `<canvas>` with animated golden spiral + star field, reacts to scroll velocity
  3. **Navigation** — sticky nav state on scroll, mobile hamburger menu toggle, smooth anchor scrolling
  4. **Testimonials carousel** — arrow button click handlers (`.tst-prev` / `.tst-next`) using event delegation on `document` to scroll `.testimonials-container`
- **`assets/`** — Reserved for SVGs, favicon, and images.

## Design System

- Fonts: Playfair Display (headings, italic serif) + Inter (body, light sans-serif) via Google Fonts
- Color palette defined in CSS custom properties: `--color-bg` (near-black), `--color-gold` (#c9a84c), `--color-cream`, `--color-muted`
- Dark background with gold accents throughout; all decorative SVGs are inline in the HTML

## Known Gotchas

- **Smart quotes break everything.** The IDE auto-replaces `"` with `"` `"` (curly quotes). These break HTML attributes — classes won't apply, IDs won't resolve, styles silently fail. After any edit, verify no smart quotes leaked in: `python3 -c "print(open('index.html').read().count('\u201c') + open('index.html').read().count('\u201d'))"`
- **`body::after` overlay** has `z-index: 9999` with a star texture pattern. It has `pointer-events: none !important` but can interfere with click events in Safari. Interactive elements that need to be clickable must have `z-index` above the overlay or be in a stacking context above it.
- **`#spiral-canvas`** is `position: fixed` with `pointer-events: none !important`. Same Safari caveat as above.
- **CSS cache** — bump the `?v=N` query param on the stylesheet link in `index.html` when CSS changes aren't reflecting.

## Placeholders to Replace Before Launch

The site has `[PLACEHOLDER]` and `[REPLACE]` markers in `index.html`:
- Telegram bot link (`ODESZA_BOT_USERNAME`)
- Footer social links (Telegram, Instagram)
- Portrait photo in the about section

## Deployment

Netlify manual deploy — drag project folder to Netlify dashboard. No CI/CD pipeline.

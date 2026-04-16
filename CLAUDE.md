# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Job Expo '36 (JETS)** — full name **Jobs Expo Thirty Six** — is a static multi-page website for a three-day careers exhibition event (2–4 July 2026). No build tools, frameworks, or package managers are used — everything is plain HTML, CSS, and vanilla JavaScript.

## Event Source of Truth

Authoritative references: `Reference Material/for digital jets.pdf` and `Reference Material/jets_expo_app.html`

| Detail | Value |
|---|---|
| Full name | Jobs Expo Thirty Six (JETS) |
| Theme | "Future Workforce for Future Health" (INNOVATE 2026) |
| Dates | 2–4 July 2026 |
| Exhibition venue | Level 2 (three care environment zones) |
| Public programme venue | CHI L4 Kampong Square (4 July) |

**Three exhibition zones (care environments):**
1. **Smart Home of the Future** — "Healthy Living at Home"
2. **Neighbourhood of the Future** — "Support from Community" (includes Virtual Care Centre)
3. **Hospital of the Future** — "Advanced Care in Hospital"

Plus a cross-cutting **Learning Innovation Space** (Zone 2) — "A Prepared Workforce".

**4 July Main Stage programme (CHI L4 Kampong Square):**
- 10:00 AM — Fashion Show Kick-off
- 11:00 AM — Side Quest: Rapid Fire Kahoot
- 12:00 PM — Lunchtime Fireside Chat
- 1:00 PM — Side Quest: This or That?
- 2:00 PM — Closing Event (TBC)

**4 July Drop-In Activities (9:30 AM – 2:30 PM):**
- CHA Empathy Escape Room (every 30 mins)
- JETS Trading Card Café
- JETS Carnival Booth Games

**4-Step Visitor Journey:** Check-In → Seek (collect stamps) → Level-Up (skills development) → Time to Fly! (claim pin)

The exhibition features **36 new healthcare job roles** distributed across the three zones.

## Running the Site

Open any `.html` file directly in a browser. There is no build step, no dev server, and no dependencies to install.

## File Structure

| File | Purpose |
|---|---|
| `index.html` | Home page — hero, zone highlights, CTA cards |
| `schedule.html` | Programme schedule — tabs + day sub-tabs with shared day selection state |
| `exhibition.html` | Exhibitor listings — zone accordion UI |
| `job-roles.html` | Browseable job roles — filter + search + modal UI |
| `stamp-rally.html` | Boarding pass tracker — Step 2 "Seek" of the visitor journey |
| `station.html` | Individual stamp collection station — URL param `?id=home|neighbourhood|hospital` |
| `workshops.html` | Workshops page |
| `thanks.html` | Acknowledgements and sponsor grid |
| `css/styles.css` | Single stylesheet for the entire site |
| `js/main.js` | Single JS file for all interactivity |

## Architecture

### CSS Design System (`css/styles.css`)
All colours, spacing, radii, and shadows are defined as CSS custom properties on `:root`. The palette uses:
- **Cyan/teal** (`--cyan-*`, `--brand-teal`) — primary brand colour
- **Orange** (`--brand-orange: #ff8200`) — stamps, highlights, boarding pass
- **Blue** (`--blue-*`) — Smart Home Zone accent
- **Emerald** (`--emerald-*`) — Neighbourhood Zone accent
- **Red** (`--red-*`) — Hospital Zone accent
- **Slate** (`--slate-*`) — neutral/text colours

CSS classes follow a BEM-like convention (e.g. `.navbar__brand`, `.card__title`, `.card__color-bar--home`).

### Fonts
`css/styles.css` expects Nexa Bold at `fonts/NexaBold.woff2` and `fonts/NexaBold.woff` (relative to project root). **No `fonts/` directory currently exists** — only `nexa-font-family 2.zip` is present. Until the zip is extracted and the `.otf` files are converted to woff/woff2, the site falls back to Inter (loaded from Google Fonts).

### JavaScript (`js/main.js`)
All JS runs inside a single `DOMContentLoaded` listener. Sections are numbered and commented:
1. **Hamburger nav toggle** — `.navbar__hamburger` / `.navbar__nav` toggling `.open`
2. **Active nav link** — matches `window.location.pathname` to highlight current page
3. **Tab switching** — `[data-tab]` buttons + `.tab-panel` elements (Schedule page)
4. **Zone accordions** — `[data-target]` triggers controlling `maxHeight` (Exhibition page)
5. **Job role filtering & search** — `[data-zone]` on `.filter-btn` and `.role-card`, plus `.search-bar input`
6. **Job role modal** — `#roleModal` populated from clicked `.role-card` data attributes
7. **Smooth scroll** — anchor links with accordion-awareness (auto-opens accordion if target is inside one)
8. **Schedule advanced tab sync** — `.wo-tab` (category) and `.day-tab` (day) buttons share an `activeDayIndex` variable so day selection persists when switching between categories; `.wo-section[hidden]` / `.tl-section` handle nested visibility

### Page-specific Interactivity
- **schedule.html** — dual tab system; category tabs (Tours, Roleplay, Activities, Workshops) and day tabs (Thu/Fri/Sat) share state via `activeDayIndex`
- **exhibition.html** — accordion pattern; only one zone open at a time; smooth height animation via `maxHeight`
- **job-roles.html** — role cards carry `data-zone`, `data-qualification`, `data-contract`, `data-stand` attributes; the modal reads these to populate `#modalTitle`, `#modalDesc`, `#modalZone`, `#modalSalary`, `#modalQuali`, `#modalContract`, `#modalStand`
- **station.html** — reads `?id=` URL param to render the correct zone station; stamp success state shown via `.stamp-anim` overlay with bounce keyframe animation. Each station has a **Mentimeter iframe placeholder** (`#embedWrap`) — paste the `<iframe>` from Mentimeter before the event (replace the placeholder `<div class="station-embed-placeholder">`). Nav link for Stamp Rally is hardcoded `class="active"` (JS pathname detection doesn't apply since `station.html` is not itself in the nav).
- **stamp-rally.html** — boarding pass with 5 stamps (3 orange zone stamps + 1 blue skills + 1 red support); stamp state tracked via data attributes and localStorage

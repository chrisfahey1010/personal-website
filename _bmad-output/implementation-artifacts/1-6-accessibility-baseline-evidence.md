# Story 1.6 Accessibility Baseline Evidence

Date: 2026-03-11
Story: `1-6-accessibility-baseline-for-core-browsing`

## Automated Baseline

- `npm run check` - passed
- `npm test` - passed
- `npm run build` - passed

## Routes Covered by Automated Review

- `/`
- `/projects/`
- `/resume/`
- `/contact/`

## Verified by Automated Checks

- Shared skip link renders in the layout and points to `#main-content`
- Primary routes render one `main` landmark with a stable skip target
- Primary routes keep one `h1` and one primary navigation landmark
- Current-page navigation state remains exposed with `aria-current="page"`
- Same-page anchor targets include sticky-header-aware scroll offsets
- Reduced-motion CSS disables smooth scrolling and neutralizes non-essential timing
- Launch color tokens meet minimum tested contrast thresholds for body text, supporting text, accent labels, and focus indicators

## Manual QA Result

Manual QA completed on 2026-03-11.

- Keyboard-only tab order on `/`, `/projects/`, `/resume/`, and `/contact/` - passed
- Visible focus clarity at desktop and mobile widths - passed
- Reduced-motion behavior in a real browser session - passed
- 200% zoom and reflow sanity across primary routes - passed
- Screen-reader pass across the primary routes - passed

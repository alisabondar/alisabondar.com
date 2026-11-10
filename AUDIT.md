# Mobile polish audit

## Source spec (derived, approved by user)

"Polished mobile" = the desktop site's content and features, rendered cleanly at phone widths, keeping the
mobile setup that existed before the portfolio-polish refactor (base commit `0f113e2`).

Checked at 375×812 and 390×844.

## Checklist

- M1: No horizontal page overflow — `document.scrollWidth` equals the viewport width.
- M2: Project prints fit inside and are centered in their column at ≤640px (pre-refactor: `.polaroid.project` was `20rem`, matching the 320px wrapper).
- M3: Interactive controls are at least 24×24 CSS px (WCAG 2.5.8): project links, contribution-period chips, testimonial dots, contact icons.
- M4: Floating background icons are hidden at ≤640px (pre-refactor `AnimatedBackground.module.css`).
- M5: Projects stack in a single centered column at ≤768px (pre-refactor `Projects.module.css`).
- M6: Journey cards are centered horizontally on mobile (pre-refactor `leftPercent = 50` on mobile).
- M7: Every desktop section (Intro, Journey, Projects, Impact, Contact) appears and becomes fully visible while scrolling on mobile.
- M8: Project cards flip on tap and show their back face, as they do on desktop click.
- M9: The contribution graph is usable on mobile: horizontal scroll opens on the latest weeks, and the period switcher is visible below 900px.

## Round 1 (initial audit, before fixes)

| Item | Status | Evidence |
|---|---|---|
| M1 | MET | scrollWidth 375 = innerWidth 375 |
| M2 | MISSING | `.project` is `21rem` (336px) in a 320px wrapper; print spans 35–371px at 390w, so it sits 16px right of center (`Polaroid.module.css:46`) |
| M3 | PARTIAL | testimonial dots 8×8px; period chips 32×19px; project links 34px tall (OK); contact icons 48px (OK) |
| M4 | MET | `AnimatedBackground.module.css:124` hides `.iconsWrap` ≤640px |
| M5 | MET | `Projects.module.css:66` column layout ≤768px |
| M6 | MET | `Journey.tsx:147` `leftPercent = isMobile ? 50 : …` |
| M7 | MET | screenshots at each section; `#projects` opacity reaches 1 |
| M8 | MET | tapping sets `data-flipped="true"` |
| M9 | MET | `calendarScroll` scrollLeft 436 (end); `mobileYearRow` shown <900px |

Out of scope: `underTheHood` is hidden ≤640px on purpose (comment in `ProjectCard.module.css:203`).

## Round 2 (after fixes)

| Item | Status | Evidence |
|---|---|---|
| M1 | MET | scrollWidth 375 = innerWidth 375 |
| M2 | MET | `.project` back to `20rem`; all three prints are 320px wide with 28px on each side at 375w; flipped back has no overflow (scroll 320×240 = client 320×240) |
| M3 | MET | no `a`/`button` under 24×24 px; dots are 24px buttons with the 8px dot drawn by `::before`; period chips have `min-height: 1.5rem` |
| M4–M9 | MET | unchanged from round 1; tapping dot 4 activates it |

Result: zero PARTIAL/MISSING findings. Done in 2 rounds; the scope-creep breaker did not fire.

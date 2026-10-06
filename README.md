# alisabondar.com

My personal site: a scrapbook-style, scroll-driven walk through how I got from the operating room to software engineering, what I've built, and the impact I've had.

**Live:** [alisabondar.com](https://alisabondar.com)

<!-- TODO: add a screen recording of the Journey scroll here (e.g. docs/journey.gif) -->

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** and CSS Modules
- **GitHub GraphQL API** for the contribution graph, revalidated daily (ISR)
- `next/og` for the generated social preview card
- **Bun** for installs and scripts
- Deployed on **Vercel**, with Vercel Analytics

## How it works

### One scroll value drives the page

The page tracks a single `scrollProgress` number. Every section (hero crossfade, the Journey card strip, Projects and Impact fade-ins) derives its opacity and transforms from that value instead of keeping its own scroll listeners.

`app/utils/scrollTimeline.ts` maps scroll pixels to `scrollProgress` piecewise:

| Band | Progress | Scroll length |
| --- | --- | --- |
| Hero + Journey intro | `0 → parallaxStart` | fixed |
| Parallax card strip | `parallaxStart → parallaxEnd` | `cards × JOURNEY_CARD_SCROLL_VH` |
| Journey exit | `parallaxEnd → 1.2` | fixed |

The middle band grows with the number of timeline entries, so adding a memory never makes the others scroll by faster. The same map runs in reverse for the side navigation's "Journey" link.

The Journey section's height is computed at render time and applied with a CSS media query, so the document height is stable before hydration. That lets the browser restore your scroll position on reload and land on `#impact` / `#contact` links.

### Keeping scroll cheap

- Scroll work is batched into one `requestAnimationFrame` per frame.
- Components whose props don't change while scrolling (`Polaroid`, sticky notes, the background, the contribution graph) are memoized.
- The Impact section only updates state when a rounded opacity actually changes.
- The stat counters write to the DOM directly instead of re-rendering React each frame.

### Accessibility

- Honors `prefers-reduced-motion`: decorative loops, smooth scrolling, the signature draw-on, the stat count-up, and testimonial auto-rotation are all disabled.
- Content faded out by scroll stays in the accessibility tree and tab order. Focusing it scrolls it into view.
- The testimonial carousel pauses on hover/focus and has keyboard-operable controls.
- The contribution graph has a text summary for screen readers.

## Project layout

```
app/
  page.tsx              server component: fetches GitHub data, renders <Home>
  components/           Home (scroll owner), Journey, Projects, Impact, ...
  data/                 content: timeline.ts, projects.ts, career.ts, contribution snapshots
  lib/                  server-only data loaders
  utils/                scroll timeline math and hooks
  opengraph-image.tsx   generated 1200×630 preview card
```

Content lives in `app/data/`, so updating the site usually means editing one of those files.

## Running locally

```bash
bun install
bun dev
```

To pull live GitHub contributions, add a token to `.env.local`:

```bash
GITHUB_TOKEN=github_pat_...   # fine-grained token, no extra scopes needed (public data)
```

Without a token, the graph uses the snapshot in `app/data/githubContributions*.ts`.

## Scripts

| Command | What it does |
| --- | --- |
| `bun dev` | Start the dev server |
| `bun run build` | Production build |
| `bun run lint` | ESLint |
| `bun run typecheck` | `tsc --noEmit` |

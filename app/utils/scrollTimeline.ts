import {
  BREAKPOINTS,
  TIMELINE_CONSTANTS,
  MOBILE_SCROLL_SLOWDOWN,
  JOURNEY_CARD_SCROLL_VH,
  JOURNEY_END_PROGRESS,
  JOURNEY_SHOW_START,
  ENTRANCE_DURATION,
  HEADER_FROZEN_DURATION,
  HEADER_FROZEN_DURATION_MOBILE,
  INTRO_EVENTS,
} from '../constants';
import { timelineItems } from '../data/timeline';

/**
 * Maps scroll position (px) to the page-wide `scrollProgress` value.
 *
 * The mapping is piecewise-linear over three bands:
 *   hero + journey intro  ->  [0, parallaxStart]
 *   parallax card strip   ->  [parallaxStart, parallaxEnd]
 *   journey exit          ->  [parallaxEnd, JOURNEY_END_PROGRESS]
 * The intro and exit bands keep a fixed length; the parallax band grows with the
 * number of cards, so adding memories never speeds up the scroll.
 */

/** Converts Journey-local progress (see Journey.tsx) back to page scrollProgress. */
function localToProgress(local: number) {
  return JOURNEY_SHOW_START + (local * (1 - JOURNEY_SHOW_START)) / JOURNEY_END_PROGRESS;
}

export function isMobileViewport() {
  return window.innerWidth < BREAKPOINTS.MOBILE;
}

/** Band boundaries in viewport heights (vh units of 1 = one innerHeight). */
export function getTimelineBands(isMobile: boolean) {
  const frozen = isMobile ? HEADER_FROZEN_DURATION_MOBILE : HEADER_FROZEN_DURATION;
  const parallaxStart = localToProgress(ENTRANCE_DURATION + frozen);
  const parallaxEnd = localToProgress(1);

  const baseLength =
    1 + (isMobile ? TIMELINE_CONSTANTS.MOBILE_MULTIPLIER * MOBILE_SCROLL_SLOWDOWN : TIMELINE_CONSTANTS.DESKTOP_MULTIPLIER);
  const introVh = (parallaxStart / JOURNEY_END_PROGRESS) * baseLength;
  const exitVh = ((JOURNEY_END_PROGRESS - parallaxEnd) / JOURNEY_END_PROGRESS) * baseLength;
  const parallaxCards = Math.max(1, timelineItems.length - INTRO_EVENTS);
  const parallaxVh = parallaxCards * (isMobile ? JOURNEY_CARD_SCROLL_VH.MOBILE : JOURNEY_CARD_SCROLL_VH.DESKTOP);

  return {
    parallaxStart,
    parallaxEnd,
    introVh,
    parallaxVh,
    exitVh,
    /** Hero + Journey section height, i.e. where the journey end marker sits. */
    totalVh: introVh + parallaxVh + exitVh,
  };
}

/** Height of the #journey section (excludes the 100vh hero above it). */
export function getJourneySectionVh(isMobile: boolean) {
  return getTimelineBands(isMobile).totalVh - 1;
}

/** Knots of the piecewise-linear map as [scrollPx, progress] pairs. */
function getKnots(isMobile: boolean, viewportHeight: number, journeyEndPx?: number) {
  const bands = getTimelineBands(isMobile);
  const expectedEnd = bands.totalVh * viewportHeight;
  // The measured marker can differ slightly from the vh math (mobile URL bars, rounding); scale to match it.
  const scale = journeyEndPx && journeyEndPx > 0 ? journeyEndPx / expectedEnd : 1;
  const px = (vh: number) => vh * viewportHeight * scale;
  return [
    [0, 0],
    [px(bands.introVh), bands.parallaxStart],
    [px(bands.introVh + bands.parallaxVh), bands.parallaxEnd],
    [px(bands.totalVh), JOURNEY_END_PROGRESS],
  ] as const;
}

function interpolate(knots: readonly (readonly [number, number])[], value: number, from: 0 | 1, to: 0 | 1) {
  for (let i = 1; i < knots.length; i++) {
    const a = knots[i - 1];
    const b = knots[i];
    if (value <= b[from]) {
      const span = b[from] - a[from];
      const t = span > 0 ? (value - a[from]) / span : 0;
      return a[to] + Math.max(0, t) * (b[to] - a[to]);
    }
  }
  return knots[knots.length - 1][to];
}

export function scrollToProgress(scrollTop: number, viewportHeight: number, journeyEndPx: number | undefined, isMobile: boolean) {
  const knots = getKnots(isMobile, viewportHeight, journeyEndPx);
  const end = knots[knots.length - 1][0];
  if (scrollTop <= end) return interpolate(knots, scrollTop, 0, 1);
  // Past the Journey, keep advancing slowly so Projects/Impact fades can key off it.
  const additional = ((scrollTop - end) / viewportHeight) * 0.3;
  return Math.min(2.0, JOURNEY_END_PROGRESS + additional);
}

export function progressToScroll(progress: number, viewportHeight: number, journeyEndPx: number | undefined, isMobile: boolean) {
  return interpolate(getKnots(isMobile, viewportHeight, journeyEndPx), progress, 1, 0);
}

/** Document offset of the bottom of #journey, if it's rendered. */
export function measureJourneyEnd(): number | undefined {
  const el = document.getElementById('journey');
  if (!el) return undefined;
  return el.getBoundingClientRect().bottom + window.scrollY;
}

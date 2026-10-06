import { isMobileViewport, measureJourneyEnd, progressToScroll } from './scrollTimeline';
import { HEADER_OFFSET_PX, SECTION_TOP_PADDING_PX } from '../constants';

/** scrollProgress the Journey link jumps to: the header is settled and the first cards are in view. */
const JOURNEY_TARGET_PROGRESS = 0.25;

/** Smooth unless the reader prefers reduced motion. ('auto' would defer to the CSS smooth scroll-behavior.) */
export function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
}

/**
 * Scrolls to a section by id. Journey is a scroll-driven overlay rather than normal flow content,
 * so it targets a point on the scroll timeline instead of the element's top.
 */
export function scrollToSection(sectionId: string, behavior: ScrollBehavior = preferredScrollBehavior()) {
  if (sectionId === 'journey') {
    window.scrollTo({
      top: progressToScroll(JOURNEY_TARGET_PROGRESS, window.innerHeight, measureJourneyEnd(), isMobileViewport()),
      behavior,
    });
    return true;
  }

  const element = document.getElementById(sectionId);
  if (!element) return false;
  const sectionTopInDoc = element.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: sectionTopInDoc + SECTION_TOP_PADDING_PX - HEADER_OFFSET_PX, behavior });
  return true;
}

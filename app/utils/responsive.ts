import { useState, useEffect } from 'react';

export const BREAKPOINTS = {
  MOBILE: 640,
} as const;

export const TIMELINE_CONSTANTS = {
  MOBILE_MULTIPLIER: 1.6,
  DESKTOP_MULTIPLIER: 1.5,
} as const;

export const SCROLL_DESENSITIZE = {
  MOBILE: 2.2,
  DESKTOP: 1.5,
} as const;

export const PHASE_TIMING = {
  MOBILE: {
    PHASE_IN_DURATION: 0.32,
    PHASE_IN_START_MULTIPLIER: 0.15,
    PHASE_OUT_START: 0.75,
  },
  DESKTOP: {
    PHASE_IN_DURATION: 0.15,
    PHASE_IN_START_MULTIPLIER: 0.2,
    PHASE_OUT_START: 0.8,
  },
  PHASE_OUT_END: 1.0,
} as const;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export function calculateFadeOpacity(
  scrollProgress: number,
  fadeInStart: number,
  fadeInDuration: number
): { opacity: number; visibility: 'visible' | 'hidden' } {
  const opacity = scrollProgress >= fadeInStart
    ? Math.min(1, (scrollProgress - fadeInStart) / fadeInDuration)
    : 0;
  const visibility = scrollProgress >= fadeInStart ? 'visible' : 'hidden';
  return { opacity, visibility };
}

export function getTimelineMultiplier(isMobile: boolean): number {
  return isMobile ? TIMELINE_CONSTANTS.MOBILE_MULTIPLIER : TIMELINE_CONSTANTS.DESKTOP_MULTIPLIER;
}

export function scrollToTop() {
  window.scrollTo(0, 0);
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
  }
}

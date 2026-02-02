import { useState, useEffect } from 'react';

export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
} as const;

export const TIMELINE_CONSTANTS = {
  MOBILE_MULTIPLIER: 7.2,
  DESKTOP_MULTIPLIER: 9.6,
  HERO_THRESHOLD: 0.8,
  CURSOR_START_POSITION: 50,
} as const;

export const PHASE_TIMING = {
  MOBILE: {
    PHASE_IN_DURATION: 0.1,
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

export const OFFSETS = {
  MOBILE_HERO: {
    HIDDEN: '120px' as const,
    VISIBLE: '80px' as const,
  },
  MOBILE_HISTORY: {
    LEFT_HIDDEN: '-200px' as const,
    RIGHT_HIDDEN: '200px' as const,
    CENTERED: '0px' as const,
  },
  TABLET: {
    LEFT: { HIDDEN: '-320px' as const, VISIBLE: '-220px' as const },
    RIGHT: { HIDDEN: '260px' as const, VISIBLE: '100px' as const },
  },
  DESKTOP: {
    LEFT: { HIDDEN: '-480px' as const, VISIBLE: '-360px' as const },
    RIGHT: { HIDDEN: '320px' as const, VISIBLE: '120px' as const },
  },
};

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

import { useState, useEffect, useRef, RefObject } from 'react';

export const BREAKPOINTS = {
  MOBILE: 640,
} as const;

export const TIMELINE_CONSTANTS = {
  MOBILE_MULTIPLIER: 1.9,
  DESKTOP_MULTIPLIER: 1.75,
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
    INTRO_PHASE_IN_END: 0.35,
  },
  DESKTOP: {
    PHASE_IN_DURATION: 0.15,
    PHASE_IN_START_MULTIPLIER: 0.2,
    PHASE_OUT_START: 0.8,
    INTRO_PHASE_IN_END: 0.25,
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

/** Viewport-based fade for mobile: fades in when section enters viewport. */
export function useViewportFade(
  ref: RefObject<HTMLElement | null>,
  options: {
    startAt?: number;
    fullAt?: number;
    hideWhenPast?: number;
  } = {}
) {
  const {
    startAt = 0.92,
    fullAt = 0.6,
    hideWhenPast = -0.1,
  } = options;

  const [opacity, setOpacity] = useState(0);
  const [visibility, setVisibility] = useState<'visible' | 'hidden'>('hidden');
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      const fadeInStart = windowHeight * startAt;
      const fadeInEnd = windowHeight * fullAt;
      const fadeInDistance = fadeInStart - fadeInEnd;

      if (sectionBottom < windowHeight * hideWhenPast) {
        setOpacity(0);
        setVisibility('hidden');
        return;
      }

      if (sectionTop > fadeInStart) {
        setOpacity(0);
        setVisibility('visible');
        return;
      }

      if (sectionTop <= fadeInEnd) {
        setOpacity(1);
        setVisibility('visible');
        return;
      }

      const progress = (fadeInStart - sectionTop) / fadeInDistance;
      setOpacity(Math.max(0, Math.min(1, progress)));
      setVisibility('visible');
    };

    const handleScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        update();
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    update();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [ref, startAt, fullAt, hideWhenPast]);

  return { opacity, visibility };
}

/** Viewport-based opacities for staggered children (e.g. project cards). */
export function useViewportStaggerFade(
  containerRef: RefObject<HTMLElement | null>,
  childCount: number,
  options: {
    startAt?: number;
    fullAt?: number;
    staggerFraction?: number;
  } = {}
) {
  const {
    startAt = 0.92,
    fullAt = 0.5,
    staggerFraction = 0.08,
  } = options;

  const [opacities, setOpacities] = useState<number[]>(() => Array(childCount).fill(0));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const container = containerRef.current;
      if (!container || childCount === 0) return;

      const windowHeight = window.innerHeight;
      const childEls = container.querySelectorAll(':scope > *');
      const newOpacities: number[] = [];

      childEls.forEach((child, index) => {
        const rect = (child as HTMLElement).getBoundingClientRect();
        const center = rect.top + rect.height / 2;

        const fadeInStart = windowHeight * startAt;
        const fadeInEnd = windowHeight * (fullAt - index * staggerFraction);
        const fadeInDistance = fadeInStart - fadeInEnd;

        if (center > fadeInStart) {
          newOpacities.push(0);
        } else if (center <= fadeInEnd) {
          newOpacities.push(1);
        } else {
          const progress = (fadeInStart - center) / fadeInDistance;
          newOpacities.push(Math.max(0, Math.min(1, progress)));
        }
      });

      setOpacities(newOpacities.length === childCount ? newOpacities : Array(childCount).fill(0));
    };

    const handleScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        update();
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    update();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, childCount, startAt, fullAt, staggerFraction]);

  return opacities;
}

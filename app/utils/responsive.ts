import { useState, useEffect, useRef, RefObject } from 'react';
import { BREAKPOINTS, PHASE_TIMING } from '../constants';

export { BREAKPOINTS, PHASE_TIMING };

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

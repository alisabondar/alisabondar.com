'use client';

import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { AnimatedBackground } from "./components/AnimatedBackground";
import { Journey } from "./components/Journey";
import { Projects } from "./components/Projects";
import { Impact } from "./components/Impact";
import { scrollToTop, getTimelineMultiplier, SCROLL_DESENSITIZE } from './utils/responsive';
import { JOURNEY_SHOW_START, CROSSFADE_END, BREAKPOINTS } from './constants';

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [journeyHeight, setJourneyHeight] = useState('100vh');
  const journeyEndMarkerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateJourneyHeight = () => {
      if (typeof window !== 'undefined') {
        const isMobile = window.innerWidth < BREAKPOINTS.MOBILE;
        const timelineMultiplier = getTimelineMultiplier(isMobile);
        setJourneyHeight(`${timelineMultiplier * 100}vh`);
      }
    };

    updateJourneyHeight();
    window.addEventListener('resize', updateJourneyHeight);
    return () => window.removeEventListener('resize', updateJourneyHeight);
  }, []);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      scrollToTop();

      const timeouts = [
        setTimeout(scrollToTop, 0),
        setTimeout(scrollToTop, 10),
        setTimeout(scrollToTop, 50),
        setTimeout(scrollToTop, 100),
      ];

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      scrollToTop();
      const timeout = setTimeout(scrollToTop, 200);
      return () => clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const updateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const isMobile = window.innerWidth < BREAKPOINTS.MOBILE;
      const timelineMultiplier = getTimelineMultiplier(isMobile);
      const scrollDesensitize = isMobile ? SCROLL_DESENSITIZE.MOBILE : SCROLL_DESENSITIZE.DESKTOP;
      const timelineSectionHeight = windowHeight * timelineMultiplier;
      const fallbackScrollRange = timelineSectionHeight * scrollDesensitize;

      const marker = journeyEndMarkerRef.current;
      const markerOffsetTop = marker
        ? marker.getBoundingClientRect().top + scrollTop
        : 0;
      const effectiveScrollRange =
        markerOffsetTop > 0 ? markerOffsetTop : fallbackScrollRange;

      if (scrollTop <= effectiveScrollRange) {
        const progress = (scrollTop / effectiveScrollRange) * 1.2;
        setScrollProgress(progress);
      } else {
        const pastTimeline = scrollTop - effectiveScrollRange;
        const additionalProgress = (pastTimeline / windowHeight) * 0.3;
        setScrollProgress(Math.min(2.0, 1.2 + additionalProgress));
      }
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <>
      <AnimatedBackground />
      <Journey scrollProgress={scrollProgress} />

      <div className="relative z-20">
      <section id="about" className="relative flex min-h-screen items-center justify-center sm:justify-center font-sans z-10 px-4">
        <div className="relative z-10 text-center sm:text-center">
          <div
            className="transition-opacity duration-500 ease-out"
            style={{
              opacity:
                scrollProgress < JOURNEY_SHOW_START
                  ? 1
                  : scrollProgress > CROSSFADE_END
                    ? 0
                    : 1 - (scrollProgress - JOURNEY_SHOW_START) / (CROSSFADE_END - JOURNEY_SHOW_START),
              visibility: scrollProgress > CROSSFADE_END ? 'hidden' : 'visible',
            }}
          >
            <h1 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-black dark:text-zinc-200 mb-4">
              Hi, I&apos;m Alisa.
            </h1>
            <div className="flex justify-center mt-6 sm:mt-8">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-black/80 dark:text-zinc-300 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section
        id="journey"
        className="relative z-10"
        style={{ minHeight: journeyHeight }}
      >
        <div
          ref={journeyEndMarkerRef}
          className="absolute bottom-0 left-0 right-0 h-0 w-full"
          aria-hidden
        />
      </section>

      <Projects scrollProgress={scrollProgress} />
      <Impact scrollProgress={scrollProgress} />
      </div>
    </>
  );
}

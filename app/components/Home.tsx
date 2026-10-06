'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { AnimatedBackground } from './AnimatedBackground';
import { Journey } from './Journey';
import { Projects } from './Projects';
import { Impact } from './Impact';
import type { YearData } from './GitHubActivityGraph';
import { useIsMobile } from '../utils/responsive';
import { getJourneySectionVh, isMobileViewport, measureJourneyEnd, scrollToProgress } from '../utils/scrollTimeline';
import { scrollToSection } from '../utils/scrollToSection';
import { useRandomHobby } from '../utils/useRandomHobby';
import { JOURNEY_SHOW_START, CROSSFADE_END } from '../constants';
import styles from './Home.module.css';

// Both heights are known at render time, so the CSS media query can pick one before hydration.
// That keeps the document height stable, which lets the browser restore scroll position and honor #hash links.
const journeyHeightVars = {
  '--journey-height-mobile': `${getJourneySectionVh(true) * 100}vh`,
  '--journey-height-desktop': `${getJourneySectionVh(false) * 100}vh`,
} as CSSProperties;

export interface HomeProps {
  contributionYears: YearData[];
}

export function Home({ contributionYears }: HomeProps) {
  const isMobile = useIsMobile();
  const hobby = useRandomHobby();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPastJourney, setIsPastJourney] = useState(false);

  // Deep links like /#impact: browsers don't reliably apply the hash on a fresh load of this page,
  // so do it once on mount. A non-zero scrollY means the browser already restored a position (reload/back).
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && window.scrollY === 0) scrollToSection(id, 'instant');
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const updateScrollProgress = () => {
      rafId = null;
      const mobile = isMobileViewport();
      const journeyEnd = measureJourneyEnd();
      const progress = scrollToProgress(window.scrollY, window.innerHeight, journeyEnd, mobile);
      // Rounding lets React bail out of renders when sub-pixel scrolling doesn't change anything visible.
      setScrollProgress(Math.round(progress * 10000) / 10000);
      setIsPastJourney(mobile && journeyEnd !== undefined && window.scrollY >= journeyEnd);
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

  const heroOpacity =
    scrollProgress < JOURNEY_SHOW_START
      ? 1
      : isMobile || scrollProgress > CROSSFADE_END
        ? 0
        : 1 - (scrollProgress - JOURNEY_SHOW_START) / (CROSSFADE_END - JOURNEY_SHOW_START);

  return (
    <>
      <AnimatedBackground highlightedIcon={hobby?.icon} />
      <Journey scrollProgress={scrollProgress} isPastJourney={isPastJourney} />

      <main className="await-background relative z-20">
        <section id="about" className="relative flex min-h-screen items-center justify-center font-sans z-10 px-4">
          <div className="relative z-10 text-center">
            <div
              className="transition-opacity duration-500 ease-out"
              style={{ opacity: heroOpacity, visibility: heroOpacity <= 0 ? 'hidden' : 'visible' }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-4">
                Hi, I&apos;m Alisa.
              </h1>
              <p className={styles.tagline}>
                I went from the operating room to shipping LLM-powered products.
              </p>
              <p className={styles.obsession}>
                Currently obsessed with{' '}
                <span className={`${styles.hobby} ${hobby ? styles.hobbyVisible : ''}`}>
                  {/* Non-breaking space keeps the line's height before the client picks a hobby. */}
                  {hobby?.label ?? '\u00a0'}
                </span>
              </p>
              <div className="flex justify-center mt-6 sm:mt-8">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-black/80 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section id="journey" aria-label="Journey" className={`relative z-10 ${styles.journeySpacer}`} style={journeyHeightVars} />

        <Projects scrollProgress={scrollProgress} isPastJourney={isPastJourney} />
        <Impact scrollProgress={scrollProgress} contributionYears={contributionYears} />
      </main>
    </>
  );
}

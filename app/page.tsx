'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import AnimatedBackground from "./components/AnimatedBackground";
import ScrollTimeline from "./components/ScrollTimeline";
import Projects from "./components/Projects";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      const scrollToTop = () => {
        window.scrollTo(0, 0);
        if (document.documentElement) {
          document.documentElement.scrollTop = 0;
        }
        if (document.body) {
          document.body.scrollTop = 0;
        }
      };

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
      const scrollToTop = () => {
        window.scrollTo(0, 0);
        if (document.documentElement) {
          document.documentElement.scrollTop = 0;
        }
        if (document.body) {
          document.body.scrollTop = 0;
        }
      };

      scrollToTop();
      const timeout = setTimeout(scrollToTop, 200);
      return () => clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      const heroThreshold = windowHeight * 0.8;
      const isHeroPast = scrollTop > heroThreshold;

      if (isHeroPast) {
        const heroHeight = windowHeight;
        const adjustedScroll = Math.max(0, scrollTop - heroHeight);
        const timelineSectionHeight = windowHeight * 9.6;
        const progress = Math.min(1.2, (adjustedScroll / timelineSectionHeight) * 1.2);
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AnimatedBackground />
      <ScrollTimeline />

      <section id="about" className="relative flex min-h-screen items-center justify-center font-sans z-10">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-[-0.25rem]">
            Hi, I&apos;m Alisa.
          </h1>
          <div className="flex justify-center mt-8">
            <svg
              className="w-6 h-6 text-white/80 animate-bounce"
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
      </section>

      <section id="history" className="relative z-10" style={{ minHeight: '960vh' }}>
      </section>

      <Projects scrollProgress={scrollProgress} />
    </>
  );
}

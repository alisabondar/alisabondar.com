'use client';

import { useEffect, useState } from 'react';
import AnimatedBackground from "./components/AnimatedBackground";
import ScrollTimeline from "./components/ScrollTimeline";

export default function Home() {
  const [dynamicHeight, setDynamicHeight] = useState('400vh');

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const baseHeight = 400;
      const additionalHeight = Math.floor(scrollTop / windowHeight) * 50;
      const newHeight = baseHeight + additionalHeight;
      setDynamicHeight(`${newHeight}vh`);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AnimatedBackground />
      <ScrollTimeline />

      <section className="relative flex min-h-screen items-center justify-center font-sans z-10">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
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

      <section className="relative z-10 transition-all duration-300" style={{ minHeight: dynamicHeight }}>
      </section>

      <section id="projects" className="relative min-h-screen z-10 flex items-center justify-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white">Projects</h2>
      </section>
    </>
  );
}

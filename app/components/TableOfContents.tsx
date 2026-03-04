'use client';

import { useEffect, useRef, useState } from 'react';
import { getTimelineMultiplier } from '../utils/responsive';

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: 'about', label: 'Intro' },
  { id: 'journey', label: 'Journey' },
  { id: 'projects', label: 'Projects' },
  { id: 'impact', label: 'Impact' },
];

/** Match Journey header position: top 50px, horizontally centered */
const HEADER_OFFSET_PX = 50;
const SECTION_TOP_PADDING_PX = 80; /* pt-20 / paddingTop for Projects & Impact */
const SMOOTH_SCROLL_DURATION_MS = 1000;

export default function TableOfContents() {
  const [activeSection, setActiveSection] = useState<string>('about');
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const updateActiveSection = () => {
      if (isScrollingRef.current) return;
      const scrollPosition = window.scrollY + window.innerHeight * 0.3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveSection(section.id);
            return;
          }
        }
      }
    };

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                updateActiveSection();
              }
            });
          },
          {
            rootMargin: '-30% 0px -30% 0px',
            threshold: [0, 0.1, 0.3, 0.5, 0.7, 1],
          }
        );

        observer.observe(element);
        observers.push(observer);
      }
    });

    const handleScrollUpdate = () => {
      updateActiveSection();
    };

    window.addEventListener('scroll', handleScrollUpdate, { passive: true });
    updateActiveSection();

    return () => {
      observers.forEach((observer) => observer.disconnect());
      window.removeEventListener('scroll', handleScrollUpdate);
    };
  }, []);

  const handleClick = (sectionId: string) => {
    setActiveSection(sectionId);
    isScrollingRef.current = true;

    if (sectionId === 'journey') {
      const windowHeight = window.innerHeight;
      const isMobile = window.innerWidth < 640;
      const timelineMultiplier = getTimelineMultiplier(isMobile);
      const SCROLL_DESENSITIZE = 1.5;
      const effectiveScrollRange = windowHeight * timelineMultiplier * SCROLL_DESENSITIZE;
      const targetScrollProgress = 0.25;
      const targetTop = (targetScrollProgress / 1.2) * effectiveScrollRange;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const sectionTopInDoc = elementPosition + window.pageYOffset;
        /* Scroll so header (section top + padding) lands at HEADER_OFFSET_PX from viewport top */
        const offsetPosition = sectionTopInDoc + SECTION_TOP_PADDING_PX - HEADER_OFFSET_PX;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }

    setTimeout(() => {
      isScrollingRef.current = false;
    }, SMOOTH_SCROLL_DURATION_MS);
  };

  return (
    <nav className="fixed right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-50 pointer-events-auto hidden sm:block">
      <ul className="flex flex-col items-end gap-3 sm:gap-4 md:gap-6">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <li key={section.id}>
              <button
                onClick={() => handleClick(section.id)}
                className={`
                  relative px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base md:text-lg font-medium transition-all duration-300 text-right
                  ${
                    isActive
                      ? 'text-black'
                      : 'text-black/40 hover:text-black/65'
                  }
                `}
                aria-label={`Navigate to ${section.label} section`}
              >
                <span className="relative z-10">{section.label}</span>
                {isActive && (
                  <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-4 sm:h-6 bg-white transition-all duration-300"
                    aria-hidden="true"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

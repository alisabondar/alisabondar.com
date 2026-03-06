'use client';

import { useEffect, useRef, useState } from 'react';
import { getTimelineMultiplier, SCROLL_DESENSITIZE } from '../utils/responsive';
import { SECTIONS, HEADER_OFFSET_PX, SECTION_TOP_PADDING_PX, SMOOTH_SCROLL_DURATION_MS, BREAKPOINTS } from '../constants';
import styles from './TableOfContents.module.css';

export const TableOfContents = () => {
  const [activeSection, setActiveSection] = useState<string>('about');
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const updateActiveSection = () => {
      if (isScrollingRef.current) return;
      const scrollPosition = window.scrollY + window.innerHeight * 0.3;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = SECTIONS[i];
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

    SECTIONS.forEach((section) => {
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
      const isMobile = window.innerWidth < BREAKPOINTS.MOBILE;
      const timelineMultiplier = getTimelineMultiplier(isMobile);
      const scrollDesensitize = isMobile ? SCROLL_DESENSITIZE.MOBILE : SCROLL_DESENSITIZE.DESKTOP;
      const effectiveScrollRange = windowHeight * timelineMultiplier * scrollDesensitize;
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
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <li key={section.id}>
              <button
                onClick={() => handleClick(section.id)}
                className={`${styles.button} ${isActive ? styles.buttonActive : styles.buttonInactive}`}
                aria-label={`Navigate to ${section.label} section`}
              >
                <span className={styles.label}>{section.label}</span>
                {isActive && (
                  <span
                    className={styles.indicator}
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
};

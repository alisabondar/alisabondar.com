'use client';

import { useEffect, useState } from 'react';

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: 'about', label: 'Intro' },
  { id: 'history', label: 'History' },
  { id: 'projects', label: 'Projects' },
  { id: 'connect', label: 'Connect' },
];

export default function TableOfContents() {
  const [activeSection, setActiveSection] = useState<string>('about');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const updateActiveSection = () => {
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
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = typeof window !== 'undefined' && window.innerWidth < 640 ? 60 : 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
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
                  relative px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 text-right
                  ${
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white/80'
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

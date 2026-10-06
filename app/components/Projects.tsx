'use client';

import { useRef } from 'react';
import { useIsMobile, useViewportFade } from '../utils/responsive';
import { ProjectCard } from './ProjectCard';
import styles from './Projects.module.css';
import { projects } from '../data/projects';

export const Projects = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Fades in by where the section actually is on screen. It rises into view right behind the Journey as
  // that scrolls away, so tying the fade to position (not scroll progress) keeps the two in step.
  const sectionFade = useViewportFade(
    sectionRef,
    { startAt: isMobile ? 0.48 : 0.92, fullAt: isMobile ? 0.2 : 0.5 }
  );
  const cardsViewportFade = useViewportFade(cardsContainerRef, { startAt: 0.5, fullAt: 0.25 });

  const sectionOpacity = sectionFade.opacity;
  const cardsContainerOpacity = isMobile ? cardsViewportFade.opacity : undefined;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative z-30 flex flex-col items-center px-4 sm:px-6 md:px-12 md:pr-20 lg:pr-36 pt-20"
      style={{
        opacity: sectionOpacity,
        // Stay focusable while transparent (focus scrolls it into view), but don't catch stray clicks.
        pointerEvents: sectionOpacity < 0.05 ? 'none' : undefined,
        ...(isMobile && { minHeight: '100vh' }),
      }}
    >
      <h2 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-8 sm:mb-10 md:mb-12">
        Projects
      </h2>

      <div
        ref={cardsContainerRef}
        className={`${styles.section} ${styles.polaroidsContainer}`}
        style={isMobile ? { opacity: cardsContainerOpacity } : undefined}
      >
        {projects.map((project) => (
          <div key={project.title} className={styles.polaroidWrapper}>
            <div className={styles.polaroidInner}>
              <ProjectCard project={project} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

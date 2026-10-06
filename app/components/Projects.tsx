'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { calculateFadeOpacity, useIsMobile, useViewportFade } from '../utils/responsive';
import { Polaroid } from './Polaroid';
import styles from './Projects.module.css';
import { projects, type Project } from '../data/projects';

export interface ProjectsProps {
  scrollProgress: number;
  isPastJourney?: boolean;
}

function getDisplayOrder(isMobile: boolean): Project[] {
  if (isMobile) {
    return [projects[1], projects[2], projects[0]];
  }
  return projects;
}

export const Projects = ({ scrollProgress }: ProjectsProps) => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const sectionViewportFade = useViewportFade(
    sectionRef,
    { startAt: isMobile ? 0.48 : 0.92, fullAt: isMobile ? 0.2 : 0.5 }
  );
  const cardsViewportFade = useViewportFade(cardsContainerRef, { startAt: 0.5, fullAt: 0.25 });

  const sectionFadeInStart = 0.92;
  const sectionFadeInDuration = 0.1;
  const scrollFade = calculateFadeOpacity(scrollProgress, sectionFadeInStart, sectionFadeInDuration);

  const sectionOpacity = isMobile
    ? sectionViewportFade.opacity
    : scrollFade.opacity;

  const cardsContainerOpacity = isMobile
    ? cardsViewportFade.opacity
    : undefined;

  const projectFadeStarts = [0.94, 0.96, 0.98];
  const projectFadeDuration = 0.12;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative z-30 flex flex-col items-center px-4 sm:px-6 md:px-12 md:pr-20 lg:pr-36 pt-20 transition-opacity duration-700 ease-out"
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
        {getDisplayOrder(isMobile).map((project, index) => {
          const { opacity: cardOpacity } = calculateFadeOpacity(
            scrollProgress,
            projectFadeStarts[index],
            projectFadeDuration
          );

          return (
            <Link
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.polaroidWrapper}
              style={{ opacity: isMobile ? 1 : cardOpacity }}
              title={project.tooltip}
            >
              <div className={styles.polaroidInner}>
              <Polaroid
                variant="project"
                title={project.title}
                image={project.screenshot}
                enableMouseTilt
              />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

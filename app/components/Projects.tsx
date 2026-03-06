'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { calculateFadeOpacity, useIsMobile, useViewportFade } from '../utils/responsive';
import { Polaroid } from './Polaroid';
import styles from './Projects.module.css';

export interface Project {
  title: string;
  githubUrl: string;
  screenshot?: string;
  tooltip?: string;
}

export interface ProjectsProps {
  scrollProgress: number;
  isPastJourney?: boolean;
}

const projects: Project[] = [
  {
    title: 'Florascape',
    githubUrl: 'https://github.com/alisabondar/florascape',
    screenshot: '/warning.png',
    tooltip: 'WIP! Click me for the github roadmap',
  },
  {
    title: 'Inkloom',
    githubUrl: 'https://github.com/alisabondar/inkloom',
    screenshot: '/inkloom.png',
  },
  {
    title: 'Lumka',
    githubUrl: 'https://github.com/alisabondar/lumka',
    screenshot: '/lumka.png',
  },
];

export const Projects = ({ scrollProgress, isPastJourney = false }: ProjectsProps) => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const sectionViewportFade = useViewportFade(sectionRef, { startAt: 0.92, fullAt: 0.5 });
  const cardsViewportFade = useViewportFade(cardsContainerRef, { startAt: 0.5, fullAt: 0.25 });

  const sectionFadeInStart = 0.92;
  const sectionFadeInDuration = 0.1;
  const scrollFade = calculateFadeOpacity(scrollProgress, sectionFadeInStart, sectionFadeInDuration);

  const sectionOpacity = isMobile
    ? (isPastJourney ? sectionViewportFade.opacity : 0)
    : scrollFade.opacity;
  const sectionVisibility = isMobile
    ? (isPastJourney && sectionViewportFade.visibility === 'visible' ? 'visible' : 'hidden')
    : scrollFade.visibility;

  const cardsContainerOpacity = isMobile
    ? (isPastJourney ? cardsViewportFade.opacity : 0)
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
        visibility: sectionVisibility,
        ...(isMobile && { minHeight: '100vh' }),
      }}
    >
      <h2 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-black dark:text-zinc-200 mb-8 sm:mb-10 md:mb-12">
        Projects
      </h2>

      <div
        ref={cardsContainerRef}
        className={`${styles.section} ${styles.polaroidsContainer}`}
        style={isMobile ? { opacity: cardsContainerOpacity } : undefined}
      >
        {projects.map((project, index) => {
          const { opacity: cardOpacity } = calculateFadeOpacity(
            scrollProgress,
            projectFadeStarts[index],
            projectFadeDuration
          );

          return (
            <Link
              key={index}
              href={project.githubUrl}
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

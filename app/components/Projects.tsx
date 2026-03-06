'use client';

import Link from 'next/link';
import { PROJECTS_FADE_IN_START_MOBILE } from '../constants';
import { calculateFadeOpacity, useIsMobile } from '../utils/responsive';
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

export const Projects = ({ scrollProgress }: ProjectsProps) => {
  const isMobile = useIsMobile();
  const sectionFadeInStart = isMobile ? PROJECTS_FADE_IN_START_MOBILE : 0.92;
  const sectionFadeInDuration = 0.1;
  const { opacity: sectionOpacity, visibility: sectionVisibility } = calculateFadeOpacity(
    scrollProgress,
    sectionFadeInStart,
    sectionFadeInDuration
  );

  const projectFadeStarts = isMobile ? [0.86, 0.88, 0.9] : [0.94, 0.96, 0.98];
  const projectFadeDuration = isMobile ? 0.08 : 0.12;

  return (
    <section
      id="projects"
      className="relative z-30 flex flex-col items-center px-4 sm:px-6 md:px-12 md:pr-20 lg:pr-36 pt-20 transition-opacity duration-700 ease-out"
      style={{
        opacity: sectionOpacity,
        visibility: sectionVisibility,
      }}
    >
      <h2 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-black dark:text-zinc-200 mb-8 sm:mb-10 md:mb-12">
        Projects
      </h2>

      <div className={`${styles.section} ${styles.polaroidsContainer}`}>
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
              style={{ opacity: cardOpacity }}
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

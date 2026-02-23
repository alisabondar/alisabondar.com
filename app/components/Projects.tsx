'use client';

import Link from 'next/link';
import { useIsMobile, calculateFadeOpacity } from '../utils/responsive';
import Polaroid from './Polaroid';
import styles from './Projects.module.css';

interface ProjectsProps {
  scrollProgress: number;
}

interface Project {
  title: string;
  githubUrl: string;
  screenshot?: string;
}

const projects: Project[] = [
  {
    title: 'Florascape',
    githubUrl: 'https://github.com/yourusername/project1',
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

export default function Projects({ scrollProgress }: ProjectsProps) {
  const isMobile = useIsMobile();
  const sectionFadeInStart = 0.84;
  const sectionFadeInDuration = 0.16;
  const { opacity: sectionOpacity, visibility } = calculateFadeOpacity(
    scrollProgress,
    sectionFadeInStart,
    sectionFadeInDuration
  );

  const projectFadeStarts = [0.86, 0.90, 0.94];
  const projectFadeDuration = isMobile ? 0.1 : 0.12;

  return (
    <section
      id="projects"
      className="relative z-30 flex flex-col items-center px-4 sm:px-6 md:px-12 md:pr-20 lg:pr-36 pt-20 transition-opacity duration-700 ease-out"
      style={{
        opacity: sectionOpacity,
        visibility,
      }}
    >
      <h2 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 sm:mb-10 md:mb-12">
        Projects
      </h2>

      <div className={`${styles.section} ${styles.polaroidsContainer}`}>
        {projects.map((project, index) => {
          const { opacity } = calculateFadeOpacity(
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
              style={{ opacity }}
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
}

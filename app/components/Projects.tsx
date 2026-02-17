'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useIsMobile, calculateFadeOpacity } from '../utils/responsive';
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

  const fadeInStart = 0.8;
  const fadeInDuration = isMobile ? 0.1 : 0.2;
  const { opacity, visibility } = calculateFadeOpacity(scrollProgress, fadeInStart, fadeInDuration);

  return (
    <section
      id="projects"
      className="relative min-h-screen z-30 flex flex-col items-center px-4 sm:px-6 md:px-12 md:pr-16 lg:pr-32 transition-opacity duration-1000 ease-in-out"
      style={{
        opacity,
        visibility,
        paddingTop: '80px',
      }}
    >
      <h2 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-12 sm:mb-16 md:mb-32">Projects</h2>

      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
        {projects.map((project, index) => {
          const hasImage = project.screenshot ? styles.hasImage : '';

          return (
            <Link
              key={index}
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
            >
              <div className={`${styles.card} ${hasImage}`}>
                <div className={styles.cardInner}>
                  <h3 className={styles.title}>{project.title}</h3>
                  {project.screenshot && (
                    <Image
                      src={project.screenshot}
                      alt={project.title}
                      fill
                      className={styles.projectImage}
                    />
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

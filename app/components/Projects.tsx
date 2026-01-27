'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fadeInStart = 1.0;
  const fadeInDuration = isMobile ? 0.1 : 0.2;
  const opacity = scrollProgress >= fadeInStart
    ? Math.min(1, (scrollProgress - fadeInStart) / fadeInDuration)
    : 0;
  const visibility = scrollProgress >= fadeInStart ? 'visible' : 'hidden';

  return (
    <section
      id="projects"
      className="relative min-h-screen z-30 flex flex-col items-center pt-16 sm:pt-20 px-4 sm:px-6 md:px-12 md:pr-16 lg:pr-32 transition-opacity duration-1000 ease-in-out"
      style={{
        opacity,
        visibility,
      }}
    >
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-12 sm:mb-16 md:mb-32 tracking-[-0.05rem] sm:tracking-[-0.25rem]">Projects</h2>

      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {projects.map((project, index) => (
          <Link
            key={index}
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-zinc-900/90 backdrop-blur-md border border-white/40 rounded-xl overflow-hidden transition-all duration-500 hover:border-white hover:shadow-2xl hover:shadow-white/30"
          >
            <div className="w-full aspect-[4/3] bg-gray-800/50 flex items-center justify-center overflow-hidden relative">
              {project.screenshot ? (
                <Image
                  src={project.screenshot}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="text-white/40 text-sm">Screenshot placeholder</div>
              )}
            </div>

            <div className="p-4 sm:p-5 flex-1 flex flex-col">
              <h3 className="text-white font-bold text-base sm:text-lg mb-2 tracking-[-0.05rem] sm:tracking-[-0.1rem]">{project.title}</h3>
              <div className="mt-auto pt-2 text-white/70 text-xs sm:text-sm group-hover:text-white/80 transition-colors">
                View on GitHub →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}


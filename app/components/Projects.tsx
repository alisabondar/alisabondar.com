'use client';

import Link from 'next/link';

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
    title: 'Project 1',
    githubUrl: 'https://github.com/yourusername/project1',
  },
  {
    title: 'Project 2',
    githubUrl: 'https://github.com/yourusername/project2',
  },
  {
    title: 'Project 3',
    githubUrl: 'https://github.com/yourusername/project3',
  },
];

export default function Projects({ scrollProgress }: ProjectsProps) {
  return (
    <section
      id="projects"
      className="relative min-h-screen z-30 flex flex-col items-center pt-20 px-6 md:px-12 transition-opacity duration-1000 ease-in-out"
      style={{
        opacity: scrollProgress >= 1.0 ? Math.min(1, (scrollProgress - 1.0) / 0.2) : 0,
        visibility: scrollProgress >= 1.0 ? 'visible' : 'hidden',
      }}
    >
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-20 md:mb-32">Projects</h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {projects.map((project, index) => (
          <Link
            key={index}
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <div className="w-full aspect-[4/3] bg-gray-800/50 flex items-center justify-center overflow-hidden">
              {project.screenshot ? (
                <img
                  src={project.screenshot}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="text-white/40 text-sm">Screenshot placeholder</div>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-2xl font-semibold text-white mb-2">{project.title}</h3>
              <div className="mt-auto pt-2 text-white/70 text-base group-hover:text-white transition-colors">
                View on GitHub →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}


'use client';

import GitHubActivityGraph from './GitHubActivityGraph';
import { useIsMobile, calculateFadeOpacity } from '../utils/responsive';
import { contributions2023, totalContributions2023 } from '../data/githubContributions2023';
import { contributions2024, totalContributions2024 } from '../data/githubContributions2024';
import { contributions2025, totalContributions2025 } from '../data/githubContributions2025';
import { contributions2026, totalContributions2026 } from '../data/githubContributions2026';

interface ConnectProps {
  scrollProgress: number;
}

interface ContactLink {
  label: string;
  url: string;
  icon?: string;
}

const contactLinks: ContactLink[] = [
  {
    label: 'Email',
    url: 'mailto:your.email@example.com',
  },
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/yourprofile',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/yourusername',
  },
  {
    label: 'Twitter',
    url: 'https://twitter.com/yourusername',
  },
];

export default function Connect({ scrollProgress }: ConnectProps) {
  const isMobile = useIsMobile();

  const fadeInStart = 1.2;
  const fadeInDuration = isMobile ? 0.1 : 0.2;
  const { opacity, visibility } = calculateFadeOpacity(scrollProgress, fadeInStart, fadeInDuration);

  return (
    <section
      id="connect"
      className="relative min-h-screen z-30 flex flex-col items-center pt-16 sm:pt-20 px-4 sm:px-6 md:px-12 transition-opacity duration-1000 ease-in-out"
      style={{
        opacity,
        visibility,
      }}
    >
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-12 sm:mb-16 md:mb-32 tracking-[-0.05rem] sm:tracking-[-0.25rem]">
        Connect
      </h2>

      {/* GitHub Activity Graph */}
      <div className="w-full max-w-4xl mb-12 sm:mb-16 md:mb-24">
        <GitHubActivityGraph
          years={[
            {
              year: 2026,
              contributions: contributions2026,
              totalContributions: totalContributions2026,
            },
            {
              year: 2025,
              contributions: contributions2025,
              totalContributions: totalContributions2025,
            },
            {
              year: 2024,
              contributions: contributions2024,
              totalContributions: totalContributions2024,
            },
            {
              year: 2023,
              contributions: contributions2023,
              totalContributions: totalContributions2023,
            },
          ]}
        />
      </div>

      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8">
        {contactLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center bg-zinc-900/90 backdrop-blur-md border border-white/40 rounded-xl px-6 sm:px-8 py-4 sm:py-5 min-w-[200px] sm:min-w-[240px] transition-all duration-500 hover:border-white hover:shadow-2xl hover:shadow-white/30 hover:scale-105"
          >
            <span className="text-white font-medium text-base sm:text-lg tracking-[-0.05rem] sm:tracking-[-0.1rem] group-hover:text-white/90 transition-colors">
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

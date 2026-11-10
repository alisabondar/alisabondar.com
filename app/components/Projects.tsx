'use client';

import { useRef } from 'react';
import { useIsMobile, useViewportFade } from '../utils/responsive';
import { ProjectCard } from './ProjectCard';
import styles from './Projects.module.css';
import { projects } from '../data/projects';
import { getJourneyExitProgress } from '../utils/scrollTimeline';
import { JOURNEY_EXIT_FADE } from '../constants';

export const Projects = ({ scrollProgress }: { scrollProgress: number }) => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);

  // Fades in by where the section actually is on screen. It rises into view right behind the Journey as
  // that scrolls away, so tying the fade to position (not scroll progress) keeps the two in step.
  const sectionFade = useViewportFade(sectionRef, { startAt: 0.92, fullAt: 0.5 });

  // Held back until the last Journey card has faded out, then fades in over the next stretch of the exit.
  const handoff = Math.max(
    0,
    Math.min(
      1,
      (getJourneyExitProgress(scrollProgress) - JOURNEY_EXIT_FADE.CARDS_OUT_END) /
        (JOURNEY_EXIT_FADE.PROJECTS_IN_END - JOURNEY_EXIT_FADE.CARDS_OUT_END)
    )
  );
  const sectionOpacity = Math.min(sectionFade.opacity, handoff);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative z-30 flex flex-col items-center px-4 sm:px-6 md:px-12 md:pr-20 lg:pr-36 pt-20"
      style={{
        opacity: sectionOpacity,
        // Stay focusable while transparent (focus scrolls it into view), but don't catch stray clicks.
        pointerEvents: sectionOpacity < 0.05 ? 'none' : undefined,
        // The last Journey card ends ~30vh down its 100vh layer; pull Projects up into that empty space.
        marginTop: '-40vh',
        ...(isMobile && { minHeight: '100vh' }),
      }}
    >
      <h2 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-8 sm:mb-10 md:mb-12">
        Projects
      </h2>

      <div className={`${styles.section} ${styles.polaroidsContainer}`}>
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

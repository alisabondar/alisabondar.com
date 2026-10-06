'use client';

import { useRef, useState } from 'react';
import { Polaroid } from './Polaroid';
import type { Project } from '../data/projects';
import styles from './ProjectCard.module.css';

function ExternalArrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M5 11L11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A project polaroid. Projects with `details` flip over to show the pitch:
 * - mouse/trackpad: on hover (CSS, see ProjectCard.module.css)
 * - touch: tap toggles
 * - keyboard: tabbing onto the Live/Code links (which live on the back) flips it via :focus-within
 */
export function ProjectCard({ project }: { project: Project }) {
  const [flipped, setFlipped] = useState(false);
  const lastPointerType = useRef<string>('');
  const { details } = project;

  if (!details) {
    return (
      <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.plainLink}>
        <Polaroid variant="project" title={project.title} image={project.screenshot} enableMouseTilt />
      </a>
    );
  }

  return (
    <div
      className={styles.card}
      data-flipped={flipped}
      onPointerDown={(e) => {
        lastPointerType.current = e.pointerType;
      }}
      onClick={(e) => {
        // Mouse users flip by hovering; a click there shouldn't latch the card open.
        if (lastPointerType.current === 'mouse') return;
        if ((e.target as HTMLElement).closest('a')) return;
        setFlipped((f) => !f);
      }}
    >
      <div className={styles.flipper}>
        <div className={`${styles.face} ${styles.front}`}>
          <Polaroid variant="project" title={project.title} image={project.screenshot} />
          <span className={styles.flipHint} aria-hidden>
            <svg className={styles.flipIcon} viewBox="0 0 16 16" fill="none">
              <path
                d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v2.8h-2.8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.hintHover}>hover to flip</span>
            <span className={styles.hintTouch}>tap to flip</span>
          </span>
        </div>

        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.tape} aria-hidden />
          <div className={styles.header}>
            <h3 className={styles.title}>{project.title}</h3>
            {details.status ? <span className={styles.status}>{details.status}</span> : null}
          </div>
          <p className={styles.pitch}>{details.pitch}</p>
          {details.underTheHood ? (
            <p className={styles.underTheHood}>
              <span className={styles.underTheHoodLabel}>Under the hood: </span>
              {details.underTheHood}
            </p>
          ) : null}
          <ul className={styles.stack} aria-label="Built with">
            {details.stack.map((tech) => (
              <li key={tech} className={styles.chip}>
                {tech}
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <a href={project.url} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.buttonPrimary}`}>
              Live site <ExternalArrow />
              <span className="sr-only">: {project.title}</span>
            </a>
            {details.codeUrl ? (
              <a href={details.codeUrl} target="_blank" rel="noopener noreferrer" className={styles.button}>
                Code <ExternalArrow />
                <span className="sr-only">: {project.title} on GitHub</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

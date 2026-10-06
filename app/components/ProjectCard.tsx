'use client';

import { useRef, useState } from 'react';
import { Polaroid } from './Polaroid';
import { ConstructionSign } from './ConstructionSign';
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
 * A project polaroid. Projects with `details` flip over to show the pitch; a dog-eared corner hints at it.
 * - mouse/trackpad: on hover (CSS, see ProjectCard.module.css)
 * - touch: tap toggles
 * - keyboard: focus flips it via :focus-within (the Live/Code links live on the back; a card with no links
 *   is focusable itself)
 */
export function ProjectCard({ project }: { project: Project }) {
  const [flipped, setFlipped] = useState(false);
  const lastPointerType = useRef<string>('');
  const { details } = project;
  const photo = project.art === 'construction' ? <ConstructionSign label={`${project.title}: under construction`} /> : undefined;

  if (!details) {
    return (
      <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.plainLink}>
        {/* No back side yet, so the name is written on the print. */}
        <Polaroid
          variant="project"
          title={project.title}
          image={project.screenshot}
          liveUrl={project.url}
          photo={photo}
          tape="none"
          enableMouseTilt
        />
      </a>
    );
  }

  const hasLinks = Boolean(project.url || details.codeUrl);

  return (
    <div
      className={styles.card}
      data-flipped={flipped}
      tabIndex={hasLinks ? undefined : 0}
      aria-label={hasLinks ? undefined : `${project.title}: ${details.status ?? ''} ${details.pitch}`.trim()}
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
          <Polaroid
            variant="project"
            title={project.title}
            image={project.screenshot}
            liveUrl={project.url}
            photo={photo}
            showCaption={false}
            tape="none"
            cornerFold
          />
        </div>

        <div className={`${styles.face} ${styles.back} ${hasLinks || details.stack?.length ? '' : styles.backCompact}`}>
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
          {details.stack?.length ? (
            <ul className={styles.stack} aria-label="Built with">
              {details.stack.map((tech) => (
                <li key={tech} className={styles.chip}>
                  {tech}
                </li>
              ))}
            </ul>
          ) : null}
          {hasLinks ? (
            <div className={styles.actions}>
              {project.url ? (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.buttonPrimary}`}>
                  Live site <ExternalArrow />
                  <span className="sr-only">: {project.title}</span>
                </a>
              ) : null}
              {details.codeUrl ? (
                <a href={details.codeUrl} target="_blank" rel="noopener noreferrer" className={styles.button}>
                  Code <ExternalArrow />
                  <span className="sr-only">: {project.title} on GitHub</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

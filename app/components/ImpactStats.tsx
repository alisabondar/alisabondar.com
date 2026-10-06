'use client';

import { useEffect, useRef, useState } from 'react';
import { impactStats, type StatFigure } from '../data/career';
import { usePrefersReducedMotion } from '../utils/usePrefersReducedMotion';
import styles from './ImpactStats.module.css';

const COUNT_UP_MS = 1200;

function formatStat(figure: StatFigure, value: number) {
  return `${figure.prefix ?? ''}${value}${figure.suffix ?? ''}`;
}

/** Writes digits straight to the DOM so the count-up doesn't re-render React on every frame. */
function StatValue({ stat, play }: { stat: StatFigure; play: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Server HTML carries the real figure; after hydration we zero it out (while still offscreen) so it can count up.
    if (reducedMotion) {
      el.textContent = formatStat(stat, stat.value);
      return;
    }
    if (!play) {
      el.textContent = formatStat(stat, 0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_UP_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatStat(stat, Math.round(eased * stat.value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, reducedMotion, stat]);

  return (
    <span ref={ref} className={styles.value}>
      {formatStat(stat, stat.value)}
    </span>
  );
}

export function ImpactStats() {
  const ref = useRef<HTMLDListElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <dl ref={ref} className={styles.panel}>
      {impactStats.map((stat) => (
        <div key={stat.label} className={`${styles.cell} ${stat.figures.length > 1 ? styles.cellMerged : ''}`}>
          {/* Screen readers get the final figures; the animated digits are visual only. */}
          <dt className={styles.label}>{stat.label}</dt>
          <dd className={styles.figures}>
            <span className="sr-only">{stat.figures.map((figure) => formatStat(figure, figure.value)).join(' and ')}</span>
            {stat.figures.map((figure, index) => (
              <span key={formatStat(figure, figure.value)} className={styles.figure} aria-hidden>
                {index > 0 ? <span className={styles.joiner}>&amp;</span> : null}
                <StatValue stat={figure} play={inView} />
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

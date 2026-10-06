'use client';

import { useEffect, useState } from 'react';
import { testimonials } from '../data/career';
import { usePrefersReducedMotion } from '../utils/usePrefersReducedMotion';
import styles from './Impact.module.css';

const ROTATE_MS = 5200;

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  // Auto-rotation pauses while the reader is pointing at or tabbed into the carousel,
  // and is off entirely for reduced-motion users (they can still use the dots).
  const isRotating = !isHovered && !hasFocus && !reducedMotion;

  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [isRotating]);

  const active = testimonials[activeIndex];

  return (
    <section
      className={`${styles.jobsWrap} ${styles.testimonials}`}
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocus(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHasFocus(false);
      }}
    >
      <div className={styles.backdrop} style={{ background: 'rgba(255, 255, 255, 0.36)' }} />
      <div className={styles.testimonialViewport} aria-live={isRotating ? 'off' : 'polite'}>
        <div key={activeIndex} className={styles.testimonialSlide}>
          <blockquote className={styles.testimonialQuote}>&ldquo;{active.quote}&rdquo;</blockquote>
          <p className={styles.testimonialAttribution}>- {active.attribution}</p>
        </div>
      </div>
      <div className={styles.testimonialDots}>
        {testimonials.map((t, index) => (
          <button
            key={t.quote}
            type="button"
            className={`${styles.testimonialDot} ${index === activeIndex ? styles.testimonialDotActive : ''}`}
            aria-label={`Show testimonial ${index + 1} of ${testimonials.length}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}

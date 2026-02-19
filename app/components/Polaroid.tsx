'use client';

import { useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import styles from './Polaroid.module.css';

type PolaroidVariant = 'portrait' | 'landscape' | 'project';

interface PolaroidProps {
  variant: PolaroidVariant;
  title: string;
  image?: string;
  description?: string;
  year?: string;
  enableMouseTilt?: boolean;
  className?: string;
}

const MOUSE_TILT_MULTIPLE = 20;
const MAX_TILT_DEG = 12;

export default function Polaroid({
  variant,
  title,
  image,
  description,
  year,
  enableMouseTilt = false,
  className = '',
}: PolaroidProps) {
  const isLandscape = variant === 'landscape';
  const isProject = variant === 'project';
  const wrapperRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number | null>(null);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = wrapperRef.current;
    if (!el) return;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const box = el.getBoundingClientRect();
      const calcX = -(e.clientY - box.y - box.height / 2) / MOUSE_TILT_MULTIPLE;
      const calcY = (e.clientX - box.x - box.width / 2) / MOUSE_TILT_MULTIPLE;
      const clamp = (n: number) => Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, n));
      el.style.transform = `rotateX(${clamp(calcX)}deg) rotateY(${clamp(calcY)}deg)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.transform = 'rotateX(0) rotateY(0)';
  }, []);

  useEffect(() => {
    if (!enableMouseTilt) return;
    const el = wrapperRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableMouseTilt, handleMouseMove, handleMouseLeave]);

  return (
    <div
      className={`${styles.cardOuter} ${className}`}
    >
      <div
        ref={wrapperRef}
        className={styles.cardWrapper}
        style={enableMouseTilt ? { transition: 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)' } : undefined}
      >
        <div className={styles.tapedCard}>
          <div className={styles.tape} aria-hidden />
          <figure
            className={`${styles.polaroid} ${isProject ? styles.project : isLandscape ? styles.landscape : styles.portrait}`}
          >
            <div className={styles.polaroidImageWrap}>
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  width={isProject ? 360 : isLandscape ? 520 : 224}
                  height={isProject ? 240 : isLandscape ? 320 : 224}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={styles.placeholder}
                  style={{
                    fontFamily: 'var(--font-story-script), cursive, sans-serif',
                    letterSpacing: 'normal',
                  }}
                >
                  {title}
                </div>
              )}
            </div>
            <figcaption className={styles.polaroidCaption}>
              {isProject ? (
                <div className={styles.verticalText}>
                  <h3 className={styles.polaroidTitle}>{title}</h3>
                </div>
              ) : isLandscape ? (
                <div className={styles.textColumn}>
                  <h3 className={styles.polaroidTitle}>{title}</h3>
                </div>
              ) : (
                <>
                  <h3 className={styles.polaroidTitle}>{title}</h3>
                  {description ? (
                    <p className={styles.polaroidDescription}>{description}</p>
                  ) : null}
                  {year ? <div className={styles.polaroidYear}>{year}</div> : null}
                </>
              )}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}

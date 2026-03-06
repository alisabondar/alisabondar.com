'use client';

import Image from 'next/image';
import { useTilt } from '../utils/useTilt';
import styles from './Polaroid.module.css';

export type PolaroidVariant = 'portrait' | 'landscape' | 'project';

export interface PolaroidProps {
  variant: PolaroidVariant;
  title: string;
  image?: string;
  description?: string;
  year?: string;
  enableMouseTilt?: boolean;
  className?: string;
}

export const Polaroid = ({
  variant,
  title,
  image,
  description,
  year,
  enableMouseTilt = false,
  className = '',
}: PolaroidProps) => {
  const isLandscape = variant === 'landscape';
  const isProject = variant === 'project';
  const { ref: tiltRef, style: tiltStyle } = useTilt(enableMouseTilt);

  return (
    <div
      className={`${styles.cardOuter} ${className}`}
    >
      <div
        ref={tiltRef}
        className={styles.cardWrapper}
        style={tiltStyle}
      >
        <div className={styles.tapedCard}>
          <div className={styles.tape} aria-hidden />
          <figure
            className={`${styles.polaroid} ${isProject ? styles.project : isLandscape ? styles.landscape : styles.portrait}`}
          >
            <div className={`${styles.polaroidImageWrap} ${image === '/warning.png' ? styles.warningIconWrap : ''}`}>
              {image === '/warning.png' ? (
                <div
                  className={styles.warningIcon}
                  role="img"
                  aria-label={title}
                />
              ) : image ? (
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
                    fontFamily: 'var(--font-permanent-marker), cursive, sans-serif',
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
};

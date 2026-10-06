'use client';

import { memo, type ReactNode } from 'react';
import Image from 'next/image';
import { useTilt } from '../utils/useTilt';
import { LivePreview } from './LivePreview';
import { Tape, type TapeVariant } from './Tape';
import styles from './Polaroid.module.css';

/** portrait: square instant film (Journey photos). project: wide-format film (project screenshots). */
export type PolaroidVariant = 'portrait' | 'project';

export interface PolaroidProps {
  variant: PolaroidVariant;
  title: string;
  image?: string;
  /** Show this live URL in the photo area instead of a static image (project cards). */
  liveUrl?: string;
  /** Custom content for the photo area (an illustration), used when there's no image or live URL. */
  photo?: ReactNode;
  year?: string;
  /** Write the title in the bottom strip. Off for project cards, whose name is on the flip side. */
  showCaption?: boolean;
  tape?: TapeVariant | 'none';
  /** Dog-ear the bottom-right corner, hinting that the print can be turned over. */
  cornerFold?: boolean;
  enableMouseTilt?: boolean;
}

// Memoized: Journey re-renders on every scroll frame, but a card's own props never change.
export const Polaroid = memo(function Polaroid({
  variant,
  title,
  image,
  liveUrl,
  photo,
  year,
  showCaption = true,
  tape = 'clear',
  cornerFold = false,
  enableMouseTilt = false,
}: PolaroidProps) {
  const isProject = variant === 'project';
  const { ref: tiltRef, style: tiltStyle } = useTilt(enableMouseTilt);

  return (
    <div className={styles.cardOuter}>
      <div ref={tiltRef} className={styles.cardWrapper} style={tiltStyle}>
        <div className={`${styles.tapedCard} ${cornerFold ? styles.foldable : ''}`}>
          {tape === 'none' ? null : <Tape variant={tape} />}
          <figure className={`${styles.polaroid} ${isProject ? styles.project : styles.portrait}`}>
            <div className={styles.photo}>
              {liveUrl ? (
                <LivePreview url={liveUrl} title={title} poster={image} />
              ) : photo ? (
                photo
              ) : image ? (
                <Image
                  src={image}
                  alt={title}
                  width={isProject ? 480 : 304}
                  height={isProject ? 300 : 304}
                  className={styles.photoImage}
                />
              ) : null}
            </div>
            {showCaption ? (
              <figcaption className={styles.caption}>
                <h3 className={styles.title}>{title}</h3>
                {year ? <div className={styles.year}>{year}</div> : null}
              </figcaption>
            ) : (
              <>
                {/* An unlabeled print: the strip stays blank, and the title is kept for screen readers. */}
                <figcaption className="sr-only">{title}</figcaption>
                <div className={styles.blankStrip} aria-hidden />
              </>
            )}
          </figure>
          {cornerFold ? <span className={styles.fold} aria-hidden /> : null}
        </div>
      </div>
    </div>
  );
});

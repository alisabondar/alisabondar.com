'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './LivePreview.module.css';

/** The site is rendered at this desktop size, then scaled down to the photo's width. */
const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 800;

interface LivePreviewProps {
  url: string;
  title: string;
  /** Static screenshot shown until the live site has loaded (and kept if it never does). */
  poster?: string;
}

/**
 * A miniature, non-interactive view of a deployed project, so the polaroid always shows the latest version.
 * The iframe mounts only when the card is about to scroll into view, and the screenshot stays on top until
 * the site has loaded, so there's never a blank frame.
 */
export function LivePreview({ url, title, poster }: LivePreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const resize = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / FRAME_WIDTH));
    resize.observe(el);

    // Respect data-saver: keep the screenshot rather than loading a whole second app.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let visible: IntersectionObserver | null = null;
    if (!saveData) {
      visible = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setMounted(true);
            visible?.disconnect();
          }
        },
        { rootMargin: '300px' }
      );
      visible.observe(el);
    }

    return () => {
      resize.disconnect();
      visible?.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={styles.preview}>
      {mounted ? (
        // inert: the preview is a picture, not a second page to tab or click into.
        <div className={styles.frameWrap} inert>
          <iframe
            src={url}
            title={`Live preview of ${title}`}
            className={styles.frame}
            style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT, transform: `scale(${scale})` }}
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="no-referrer"
            loading="lazy"
            tabIndex={-1}
            // Give the app a beat to hydrate and paint before revealing it.
            onLoad={() => setTimeout(() => setLoaded(true), 400)}
          />
        </div>
      ) : null}
      {poster ? (
        <Image
          src={poster}
          alt={`Screenshot of ${title}`}
          fill
          sizes="(max-width: 640px) 320px, 480px"
          className={`${styles.poster} ${loaded ? styles.posterHidden : ''}`}
        />
      ) : null}
    </div>
  );
}

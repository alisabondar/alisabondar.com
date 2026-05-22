'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { icons } from '../constants';
import styles from './AnimatedBackground.module.css';

function getIconDelay(delay: number, isDesktop: boolean) {
  return isDesktop ? Math.min(delay * 0.2, 0.5) : delay;
}

export const AnimatedBackground = () => {
  const [iconsReady, setIconsReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const loadedCount = useRef(0);

  useEffect(() => {
    const check = () => setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 641);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleIconLoad = useCallback(() => {
    loadedCount.current += 1;
    if (loadedCount.current >= icons.length) {
      setIconsReady(true);
    }
  }, []);

  useEffect(() => {
    const fallback = setTimeout(() => setIconsReady(true), 4000);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.svgBackground} aria-hidden />

      <div
        className={styles.iconsWrap}
          aria-hidden
          style={{ visibility: iconsReady ? 'visible' : 'hidden' }}
        >
          {icons.map((icon, index) => {
            const animationClasses = [styles.iconFloat1, styles.iconFloat2, styles.iconFloat3, styles.iconFloat4];
            const animationClass = animationClasses[index % animationClasses.length];

            return (
              <div
                key={index}
                className={`${styles.icon} ${animationClass}`}
                style={{
                  left: `${icon.x}%`,
                  top: `${icon.y}%`,
                  animationDuration: `${icon.duration}s`,
                  animationDelay: `${getIconDelay(icon.delay, isDesktop)}s`,
                  animationPlayState: iconsReady ? 'running' : 'paused',
                }}
              >
                <div className={styles.iconInner}>
                  <Image
                    src={icon.src}
                    alt=""
                    width={icon.size}
                    height={icon.size}
                    className="pointer-events-none"
                    onLoad={handleIconLoad}
                  />
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
};

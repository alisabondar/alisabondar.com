'use client';

import Image from 'next/image';
import { icons } from '../constants/icons';
import styles from './AnimatedBackground.module.css';

export default function AnimatedBackground() {
  return (
    <div className={styles.container}>
      <div className={styles.svgBackground} aria-hidden />

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
              animationDelay: `${icon.delay}s`,
            }}
          >
            <div className={styles.iconInner}>
              <Image
                src={icon.src}
                alt=""
                width={icon.size}
                height={icon.size}
                className="pointer-events-none"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}


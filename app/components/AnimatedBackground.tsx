'use client';

import Image from 'next/image';
import { icons } from '../constants/icons';
import styles from './AnimatedBackground.module.css';

export default function AnimatedBackground() {
  return (
    <div className={styles.container}>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2} ${styles.animationDelay2000}`} />
      <div className={styles.blob3Wrapper}>
        <div className={`${styles.blob} ${styles.blob3} ${styles.animationDelay4000}`} />
      </div>

      {icons.map((icon, index) => (
        <div
          key={index}
          className={styles.icon}
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            animationDuration: `${icon.duration}s`,
            animationDelay: `${icon.delay}s`,
          }}
        >
          <Image
            src={icon.src}
            alt=""
            width={icon.size}
            height={icon.size}
            className="pointer-events-none"
          />
        </div>
      ))}
    </div>
  );
}


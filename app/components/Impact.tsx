'use client';

import { useEffect, useRef, useState } from 'react';
import { GitHubActivityGraph, type YearData } from './GitHubActivityGraph';
import { contributions2023, totalContributions2023 } from '../data/githubContributions2023';
import { contributions2024, totalContributions2024 } from '../data/githubContributions2024';
import { contributions2025, totalContributions2025 } from '../data/githubContributions2025';
import { contributions2026, totalContributions2026 } from '../data/githubContributions2026';
import { ImpactStats } from './ImpactStats';
import { Testimonials } from './Testimonials';
import { ContactIcon } from './ContactIcon';
import { useIsMobile, calculateFadeOpacity, useViewportFade } from '../utils/responsive';
import { contactLinks, jobs } from '../data/career';
import styles from './Impact.module.css';

export interface ImpactProps {
  scrollProgress: number;
}

const totalAchievements = jobs.reduce((sum, job) => sum + job.achievements.length, 0);
const achievementStartIndex = jobs.map((_, jobIndex) =>
  jobs.slice(0, jobIndex).reduce((sum, job) => sum + job.achievements.length, 0)
);

/** 1 when `position` is above `end`, 0 below `start`, linear in between (all in px from viewport top). */
function fadeBetween(position: number, start: number, end: number) {
  if (position > start) return 0;
  if (position < end) return 1;
  return 1 - (position - end) / (start - end);
}

const round = (n: number) => Math.round(n * 100) / 100;

function sameValues(a: number[], b: number[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

const contributionYears: YearData[] = [
  { year: 2026, contributions: contributions2026, totalContributions: totalContributions2026 },
  { year: 2025, contributions: contributions2025, totalContributions: totalContributions2025 },
  { year: 2024, contributions: contributions2024, totalContributions: totalContributions2024 },
  { year: 2023, contributions: contributions2023, totalContributions: totalContributions2023 },
];

export const Impact = ({ scrollProgress }: ImpactProps) => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const achievementRefs = useRef<(HTMLLIElement | null)[]>([]);
  const headerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastJobRef = useRef<HTMLDivElement | null>(null);
  const [achievementOpacities, setAchievementOpacities] = useState<number[]>(() => Array(totalAchievements).fill(0));
  const [headerOpacities, setHeaderOpacities] = useState<number[]>(() => Array(jobs.length).fill(1));
  const [lastJobOpacity, setLastJobOpacity] = useState(1);
  const signatureRef = useRef<SVGSVGElement>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const scrollFade = calculateFadeOpacity(scrollProgress, 1.2, 0.2);
  const viewportFade = useViewportFade(sectionRef, { startAt: 0.88, fullAt: 0.5 });
  const opacity = isMobile ? viewportFade.opacity : scrollFade.opacity;
  const sentimentOpacity = 1 - lastJobOpacity;

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const wh = window.innerHeight;

      const nextAchievements = achievementRefs.current.map((el) => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return round(fadeBetween(rect.top + rect.height / 2, wh * 0.85, wh * 0.6));
      });
      // Skip the state update (and the re-render) when nothing visibly changed.
      setAchievementOpacities((prev) => (sameValues(prev, nextAchievements) ? prev : nextAchievements));

      const nextHeaders = headerRefs.current.map((el) => {
        if (!el) return 1;
        const rect = el.getBoundingClientRect();
        // Once a header has reached the top of the viewport it stays fully visible.
        if (rect.top < 0) return 1;
        return round(fadeBetween(rect.top + rect.height / 2, wh * 0.9, wh * 0.7));
      });
      setHeaderOpacities((prev) => (sameValues(prev, nextHeaders) ? prev : nextHeaders));

      if (lastJobRef.current) {
        // As the last job leaves the top of the screen, crossfade the work history out and the sign-off in.
        const bottom = lastJobRef.current.getBoundingClientRect().bottom;
        setLastJobOpacity(round(1 - fadeBetween(bottom, wh * 0.18, wh * 0.02)));
      }
    };

    const handleScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    update();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!signatureRef.current) return;

    const paths = signatureRef.current.querySelectorAll('path');
    if (paths.length === 0) return;

    // Reduced motion: leave the signature fully drawn.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const pathLengths: number[] = [];
    paths.forEach((path) => {
      pathLengths.push(path.getTotalLength());
    });

    const resetAndAnimate = () => {
      animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      animationTimeoutsRef.current = [];

      paths.forEach((path, index) => {
        const length = pathLengths[index];
        path.style.transition = 'none';
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
      });

      const resetTimeout = setTimeout(() => {
        const dashDuration = 100;
        const otherDuration = 400;

        // The first path is the leading dash; it's drawn quickly, then each letter stroke follows in order.
        paths.forEach((path, index) => {
          const duration = index === 0 ? dashDuration : otherDuration;
          const delay = index === 0 ? 0 : dashDuration + (index - 1) * otherDuration;

          const animTimeout = setTimeout(() => {
            path.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
            path.style.strokeDashoffset = '0';
          }, delay);

          animationTimeoutsRef.current.push(animTimeout);
        });
      }, 100);

      animationTimeoutsRef.current.push(resetTimeout);
    };

    paths.forEach((path, index) => {
      path.style.strokeDasharray = `${pathLengths[index]}`;
      path.style.strokeDashoffset = `${pathLengths[index]}`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
          }
          if (entry.isIntersecting) {
            resetAndAnimate();
            animationIntervalRef.current = setInterval(resetAndAnimate, 5000);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(signatureRef.current);

    return () => {
      observer.disconnect();
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      animationTimeoutsRef.current = [];
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="impact"
      className={styles.section}
      style={{
        opacity,
        // Invisible content stays in the accessibility tree and tab order (focusing it scrolls it into view
        // and fades it in), but shouldn't swallow clicks while transparent.
        pointerEvents: opacity < 0.05 ? 'none' : undefined,
        paddingTop: '80px',
        paddingBottom: 0,
      }}
    >
      <h2 className={styles.heading}>
        Impact
      </h2>

      <div className={styles.container}>
        <ImpactStats />

        <div className={styles.jobsWrap} style={{ opacity: lastJobOpacity }}>
          <div className={styles.backdrop} style={{ background: 'rgba(255, 255, 255, 0.36)' }} />

          <div className={styles.graphWrap}>
            <GitHubActivityGraph years={contributionYears} />
          </div>

          <div className={styles.careerWrap}>
            <div className={styles.jobsInner}>
              {jobs.map((job, jobIndex) => {
                const isLastJob = jobIndex === jobs.length - 1;

                return (
                  <div
                    key={job.company}
                    ref={isLastJob ? (el) => { lastJobRef.current = el; } : undefined}
                    className={styles.jobBlock}
                    style={{ opacity: isLastJob ? lastJobOpacity : 1 }}
                  >
                    <div
                      ref={(el) => {
                        headerRefs.current[jobIndex] = el;
                      }}
                      className={styles.jobHeader}
                      style={{ opacity: headerOpacities[jobIndex] || 0 }}
                    >
                      <h3 className={styles.companyName}>
                        {job.company}
                      </h3>
                      <div className={styles.meta}>
                        <span className={styles.role}>
                          {job.role}
                        </span>
                        <span className={styles.period}>
                          {job.period}
                        </span>
                      </div>
                    </div>

                    <ul className={styles.achievementList}>
                      {job.achievements.map((text, index) => {
                        const achievementIndex = achievementStartIndex[jobIndex] + index;
                        const achievementOpacity = achievementOpacities[achievementIndex] || 0;
                        return (
                          <li
                            key={text}
                            ref={(el) => {
                              achievementRefs.current[achievementIndex] = el;
                            }}
                            className={styles.achievementItem}
                            style={{ opacity: achievementOpacity }}
                          >
                            <div className={styles.bulletWrap}>
                              <svg
                                className={achievementOpacity > 0 ? `${styles.bulletIcon} ${styles.bulletIconAnimated}` : styles.bulletIcon}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden
                              >
                                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
                                <circle cx="12" cy="10" r="1.5" fill="rgba(255, 255, 255, 1)" />
                              </svg>
                            </div>
                            <p className={styles.achievementText}>
                              {text}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <section
        id="contact"
        aria-label="Contact"
        className={styles.sentimentBlock}
        style={{
          opacity: sentimentOpacity,
          pointerEvents: sentimentOpacity < 0.05 ? 'none' : undefined,
        }}
      >
        <div className={styles.sentimentInner}>
          <div className={styles.signatureBlock}>
            <h2 className={styles.signatureHeading}>
              Your future favorite coworker,
            </h2>
            <div className={styles.signatureWrap}>
              <svg
                ref={signatureRef}
                width="197"
                height="86"
                viewBox="0 0 197 86"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.signatureSvg}
                role="img"
                aria-label="Alisa"
              >
          <g clipPath="url(#clip0_1_2)">
            <path d="M2.98058 45.3084C3.05598 45.0445 3.453 44.4561 4.33502 43.6386C4.8033 43.2046 5.5375 43.0097 10.6659 42.7606C15.7943 42.5116 25.3519 42.2854 30.6337 42.2159C35.9155 42.1465 36.6318 42.2408 37.6606 42.4119C38.6895 42.5829 40.009 42.828 41.3686 43.0805" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M78.7567 62.3608C78.88 61.3232 80.364 56.7572 81.7189 52.8793C81.9977 52.0815 81.9697 51.2388 81.8104 50.4864C81.6512 49.734 81.2565 49.068 80.4981 48.8482C79.7398 48.6284 78.6297 48.8751 77.5151 49.4339C73.0506 51.672 70.7714 55.2935 67.6818 59.4009C65.1255 62.7993 62.8205 67.2969 60.9532 71.1669C59.7532 73.6538 59.4716 75.5587 59.272 77.4837C59.1624 78.5408 59.2698 79.7786 59.7022 80.7717C60.1347 81.7649 60.9487 82.4803 62.0095 82.8611C64.248 83.6649 66.4394 83.1934 68.0175 82.8959C69.7123 82.5764 72.5566 81.1339 76.6946 78.9484C81.1454 76.5978 88.323 69.9349 97.319 61.1782C101.252 57.3497 103.527 54.395 108.99 46.1368C114.453 37.8787 122.94 24.3108 128.101 16.2728C134.677 6.03092 137.109 3.38549 138.043 2.88313C138.314 2.73789 138.263 3.76221 135.363 10.0031C132.463 16.244 126.74 27.9124 123.101 35.7119C117.843 46.9808 115.942 53.5614 114.772 58.3525C114.012 61.4614 113.917 64.954 113.509 68.2081C113.382 69.2247 112.484 68.7239 111.87 67.8661C105.053 58.3499 103.209 39.3305 101.464 36.0954C101.066 35.3577 100.495 34.8377 99.9452 34.2987C99.395 33.7597 98.8029 33.2664 97.9059 32.9752C97.0088 32.684 95.8247 32.61 94.6103 32.8432C93.3959 33.0765 92.1872 33.6192 91.0094 34.3181C89.8317 35.0171 88.7216 35.8558 87.8536 36.6826C86.9857 37.5094 86.3937 38.2989 86.0023 39.1496C85.611 40.0003 85.4383 40.8883 85.6824 41.5308C85.9264 42.1734 86.5925 42.5434 88.1197 42.734C89.647 42.9246 92.0152 42.9246 94.4552 42.9246" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M120.769 71.8546C120.719 71.904 120.151 72.4721 119.798 72.9367C119.674 73.0995 120.924 72.1432 121.975 70.9976C123.025 69.852 124.16 68.2978 129.098 59.2701C134.037 50.2424 142.745 33.7882 146.812 25.4228C150.878 17.0574 150.04 17.2794 148.67 18.6395C145.097 22.1883 140.213 30.7075 134.81 40.303C131.514 46.157 130.269 50.578 129.186 54.1872C127.893 58.4946 128.169 62.227 128.416 63.9183C128.534 64.7265 129.156 65.3136 129.867 65.6437C130.577 65.9737 131.49 65.9984 132.602 65.4931C137.887 63.0902 146.855 51.8309 151.407 46.7479C156.454 41.1118 142.09 62.2218 140.817 67.0068C140.584 67.883 140.728 68.7478 141.209 69.2416C141.69 69.7353 142.652 69.8587 143.555 69.6509C148.389 68.538 155.434 58.7756 160.811 51.4429C162.236 49.5004 162.456 47.6424 162.716 46.8037C162.959 46.0242 163.377 49.6645 163.738 52.9156C164.244 57.4746 163.631 61.2537 162.886 63.194C162.54 64.0959 162.042 64.7395 161.394 65.3787C160.746 66.0178 159.907 66.6098 159.068 67.0135C158.229 67.4172 157.415 67.6146 156.687 67.4079C155.959 67.2012 155.343 66.5844 155.272 65.798C155.201 65.0116 155.694 64.0742 156.405 63.2706C159.126 60.1925 163.652 58.958 177.219 54.2178C180.016 53.2407 180.732 52.9477 180.657 52.9802C177.256 54.4451 172.324 59.396 169.702 62.7114C169.184 63.3659 169.041 64.2386 169.382 64.8057C169.723 65.3727 170.685 65.6934 171.65 65.6242C172.614 65.5551 173.551 65.0864 174.737 64.3145C180.499 60.5646 183.877 56.0448 185.569 53.7061C186.302 52.6938 186.669 51.9595 186.379 51.702C186.089 51.4444 185.102 51.6664 184.36 52.1262C183.617 52.5859 183.148 53.2766 182.759 53.9778C182.37 54.679 182.073 55.3698 181.884 56.1696C181.694 56.9695 181.62 57.8576 181.854 58.6111C182.087 59.3646 182.63 59.9567 183.341 60.3481C184.052 60.7394 184.916 60.9121 186.199 60.9887C187.483 61.0653 189.16 61.0407 190.616 60.8676C192.073 60.6945 193.257 60.3738 194.477 60.0434" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M158.894 33.7298C158.696 33.6558 158.499 33.5818 157.99 33.3093C157.481 33.0369 156.667 32.5681 156.729 32.2527C156.791 31.9372 157.753 31.7892 159.716 31.8609" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_1_2">
              <rect width="197" height="86" fill="white" />
            </clipPath>
          </defs>
        </svg>
            </div>
          </div>

          <Testimonials />
        </div>

        <div className={styles.contactLinks}>
          {contactLinks.map((link) => {
            const isMailto = link.url.startsWith('mailto:');
            return (
              <a
                key={link.url}
                href={link.url}
                {...(isMailto ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                className={styles.contactLink}
                aria-label={link.label}
                title={link.label}
              >
                <ContactIcon icon={link.icon} />
              </a>
            );
          })}
        </div>
      </section>
    </section>
  );
};

'use client';

import { useEffect, useRef, useState } from 'react';
import GitHubActivityGraph from './GitHubActivityGraph';
import { useIsMobile, calculateFadeOpacity } from '../utils/responsive';
import { contributions2023, totalContributions2023 } from '../data/githubContributions2023';
import { contributions2024, totalContributions2024 } from '../data/githubContributions2024';
import { contributions2025, totalContributions2025 } from '../data/githubContributions2025';
import { contributions2026, totalContributions2026 } from '../data/githubContributions2026';

interface ImpactProps {
  scrollProgress: number;
}

interface ContactLink {
  label: string;
  url: string;
  icon?: string;
}

const contactLinks: ContactLink[] = [
  {
    label: 'Email',
    url: 'mailto:alisa.k.bondar@gmail.com',
    icon: 'email',
  },
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/alisabondar',
    icon: 'linkedin',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/alisabondar',
    icon: 'github',
  },
  {
    label: 'Resume',
    url: '/resume.pdf',
    icon: 'resume',
  },
];

interface Job {
  company: string;
  role: string;
  period: string;
  achievements: string[];
}

const jobs: Job[] = [
  {
    company: 'AlphaSights',
    role: 'Software Engineer',
    period: '2024 - Present',
    achievements: [
      'Completed 300+ tasks spanning bug fixes, robust feature builds, and new microservices',
      'Contributed to a backend, Ruby monolith breakdown into polished microservices',
      'Early contributor to the company&apos;s first AI integration, enabling tailored client communications and doubling workforce productivity and credit revenue',
      'Contributed to the launch of a new external, responsive, and accessible product serving 10K+ users, with a 30% return rate within 60 days of registration',
      'Helped capture 1.8x more structured data, improving internal data mapping accuracy and strengthening ancillary client offerings',
      'Implemented AWS Cognito authentication, supporting ~70% magic link, ~20% Google, and ~10% LinkedIn logins',
      'Investigated and optimized N+1 queries in our backend',
      'Partnered with adjacent teams on analytics integration, feature enhancements, and new endpoints',
    ],
  },
  {
    company: 'Inova Health System',
    role: 'Data Assistant',
    period: '2022 - 2023',
    achievements: [
      'Processed and structured patient transfer requests in Excel, ensuring accurate, analyzable data for night-shift intensivists',
      'Developed daily critical care unit capacity reports, enabling data-driven decision-making for senior management',
      'Analyzed patient records in Epic EMR for key health indicators, supporting timely alerts and workflow coordination across care teams',
    ],
  },
  {
    company: 'Virginia Hospital Center',
    role: 'Support Technician',
    period: '2020 - 2023',
    achievements: [
      'Assisted in surgical procedures as a second scrub',
      'Led the transition of roles during the COVID-19 pandemic, effectively resolving backorders through collaboration with vendors and neighboring hospitals',
      'Presented arguments and documentation to secure new surgical inventory, enhancing patient care with innovative solutions',
    ],
  },
];

export default function Impact({ scrollProgress }: ImpactProps) {
  const isMobile = useIsMobile();
  const careerHistoryRef = useRef<HTMLDivElement>(null);
  const [graphBackgroundOpacity, setGraphBackgroundOpacity] = useState(1);
  const achievementRefs = useRef<(HTMLLIElement | null)[]>([]);
  const headerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastJobRef = useRef<HTMLDivElement | null>(null);
  const totalAchievements = jobs.reduce((sum, job) => sum + job.achievements.length, 0);
  const [achievementOpacities, setAchievementOpacities] = useState<number[]>(Array(totalAchievements).fill(0));
  const [headerOpacities, setHeaderOpacities] = useState<number[]>(Array(jobs.length).fill(1));
  const [lastJobOpacity, setLastJobOpacity] = useState(1);
  const [jobsContainerOpacity, setJobsContainerOpacity] = useState(1);
  const signatureRef = useRef<SVGSVGElement>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const fadeInStart = 1.2;
  const fadeInDuration = isMobile ? 0.1 : 0.2;
  const { opacity, visibility } = calculateFadeOpacity(scrollProgress, fadeInStart, fadeInDuration);

  useEffect(() => {
    const handleScroll = () => {
      if (!careerHistoryRef.current) return;

      const careerSection = careerHistoryRef.current;
      const rect = careerSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const sectionTop = rect.top;

      const fadeStart = windowHeight;
      const fadeDistance = 300;
      const scrollProgress = Math.max(0, Math.min(1, (fadeStart - sectionTop) / fadeDistance));
      setGraphBackgroundOpacity(1 - scrollProgress);

      const newOpacities = achievementRefs.current.map((achievementRef) => {
        if (!achievementRef) return 0;

        const achievementRect = achievementRef.getBoundingClientRect();
        const achievementTop = achievementRect.top;
        const achievementCenter = achievementTop + achievementRect.height / 2;

        const fadeInStart = windowHeight * 0.85;
        const fadeInEnd = windowHeight * 0.6;
        const fadeDistance = fadeInStart - fadeInEnd;

        if (achievementCenter > fadeInStart) {
          return 0;
        } else if (achievementCenter < fadeInEnd) {
          return 1;
        } else {
          return 1 - ((achievementCenter - fadeInEnd) / fadeDistance);
        }
      });

      setAchievementOpacities(newOpacities);

      const newHeaderOpacities = headerRefs.current.map((headerRef) => {
        if (!headerRef) return 1;

        const headerRect = headerRef.getBoundingClientRect();
        const headerTop = headerRect.top;
        const headerBottom = headerRect.bottom;
        const headerCenter = headerTop + headerRect.height / 2;

        const fadeInStart = windowHeight * 0.9;
        const fadeInEnd = windowHeight * 0.7;
        const fadeDistance = fadeInStart - fadeInEnd;

        if (headerBottom < 0 || headerTop < 0) {
          return 1;
        }

        if (headerCenter > fadeInStart) {
          return 0;
        } else if (headerCenter < fadeInEnd) {
          return 1;
        } else {
          return 1 - ((headerCenter - fadeInEnd) / fadeDistance);
        }
      });

      setHeaderOpacities(newHeaderOpacities);

      if (lastJobRef.current) {
        const lastJobRect = lastJobRef.current.getBoundingClientRect();
        const lastJobBottom = lastJobRect.bottom;
        const windowHeight = window.innerHeight;

        const fadeOutStart = windowHeight * 0.5;
        const fadeOutEnd = windowHeight * 0.3;
        const fadeOutDistance = fadeOutStart - fadeOutEnd;

        let opacity = 1;
        if (lastJobBottom > fadeOutStart) {
          opacity = 1;
        } else if (lastJobBottom < fadeOutEnd) {
          opacity = 0;
        } else {
          const fadeProgress = (fadeOutStart - lastJobBottom) / fadeOutDistance;
          opacity = 1 - fadeProgress;
        }

        setLastJobOpacity(opacity);
        setJobsContainerOpacity(opacity);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!signatureRef.current) return;

    const paths = signatureRef.current.querySelectorAll('path');
    if (paths.length === 0) return;

    // Calculate total path lengths and set up animation
    const pathLengths: number[] = [];
    paths.forEach((path) => {
      const length = path.getTotalLength();
      pathLengths.push(length);
    });

    const resetAndAnimate = () => {
      // Clear any existing animation timeouts
      animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      animationTimeoutsRef.current = [];

      // Reset all paths to invisible
      paths.forEach((path, index) => {
        const pathElement = path as SVGPathElement;
        const length = pathLengths[index];
        // Force immediate reset without transition
        pathElement.style.transition = 'none';
        pathElement.style.strokeDasharray = `${length}`;
        pathElement.style.strokeDashoffset = `${length}`;
      });

      // Small delay to ensure reset is applied before starting animation
      const resetTimeout = setTimeout(() => {
        // Animation order: dash first, then A, then lisa, then flourish
        // path[0] = dash, path[1] = A, path[2] = lisa, path[3] = flourish
        const animationOrder = Array.from({ length: paths.length }, (_, i) => i);
        const dashDuration = 100; // 0.1 seconds for dash - very fast
        const otherDuration = 400; // 0.4 seconds for other paths

        animationOrder.forEach((pathIndex, orderIndex) => {
          if (pathIndex < paths.length) {
            const pathElement = paths[pathIndex] as SVGPathElement;
            const isDash = pathIndex === 0;
            const duration = isDash ? dashDuration : otherDuration;

            // Calculate delay: dash starts at 0, others wait for previous to complete
            let delay = 0;
            if (orderIndex === 0) {
              delay = 0; // Dash starts immediately
            } else if (orderIndex === 1) {
              delay = dashDuration; // A starts after dash completes
            } else {
              delay = dashDuration + (orderIndex - 1) * otherDuration; // Others wait for previous
            }

            const animTimeout = setTimeout(() => {
              pathElement.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
              pathElement.style.strokeDashoffset = '0';
            }, delay);

            animationTimeoutsRef.current.push(animTimeout);
          }
        });
      }, 100); // Small delay to ensure reset is complete

      animationTimeoutsRef.current.push(resetTimeout);
    };

    // Initial setup
    paths.forEach((path, index) => {
      const pathElement = path as SVGPathElement;
      const length = pathLengths[index];
      pathElement.style.strokeDasharray = `${length}`;
      pathElement.style.strokeDashoffset = `${length}`;
    });

    // Trigger animation when signature comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Clear any existing interval
            if (animationIntervalRef.current) {
              clearInterval(animationIntervalRef.current);
            }

            // Start the animation
            resetAndAnimate();

            // Loop every 15 seconds
            animationIntervalRef.current = setInterval(() => {
              resetAndAnimate();
            }, 5000);
          } else {
            // Stop animation when out of view
            if (animationIntervalRef.current) {
              clearInterval(animationIntervalRef.current);
              animationIntervalRef.current = null;
            }
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
    <>
      <style>{`
        @keyframes bulletSpin {
          from {
            transform: rotate(0deg) scale(0.8);
            opacity: 0;
          }
          to {
            transform: rotate(360deg) scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <section
        id="impact"
        className="relative min-h-screen z-30 flex flex-col items-center pt-16 sm:pt-20 px-4 sm:px-6 md:px-12 pb-8 transition-opacity duration-1000 ease-in-out"
        style={{
          opacity,
          visibility,
        }}
      >
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2 tracking-[-0.05rem] sm:tracking-[-0.25rem]">
        Impact
      </h2>

      <div className="w-full max-w-4xl relative">
        <div
          className="w-full relative rounded-xl overflow-hidden transition-opacity duration-700 ease-out"
          style={{
            opacity: jobsContainerOpacity,
          }}
        >
          <div
            className="absolute inset-0 backdrop-blur-md transition-all duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom,
                rgba(24, 24, 27, ${0.9 * graphBackgroundOpacity}) 0%,
                rgba(24, 24, 27, ${0.7 * graphBackgroundOpacity}) 30%,
                rgba(24, 24, 27, ${0.3 * graphBackgroundOpacity}) 60%,
                rgba(24, 24, 27, 0) 100%
              )`,
            }}
          />

          <div className="relative z-10">
            <GitHubActivityGraph
              years={[
                {
                  year: 2026,
                  contributions: contributions2026,
                  totalContributions: totalContributions2026,
                },
                {
                  year: 2025,
                  contributions: contributions2025,
                  totalContributions: totalContributions2025,
                },
                {
                  year: 2024,
                  contributions: contributions2024,
                  totalContributions: totalContributions2024,
                },
                {
                  year: 2023,
                  contributions: contributions2023,
                  totalContributions: totalContributions2023,
                },
              ]}
            />
          </div>

          <div
            ref={careerHistoryRef}
            className="relative z-10"
          >
            <div className="space-y-8 sm:space-y-10 md:space-y-12 px-4 sm:px-6 md:px-8 pb-16 sm:pb-20 md:pb-24 pt-6 sm:pt-8">
              {jobs.map((job, jobIndex) => {
                let achievementIndex = 0;
                for (let i = 0; i < jobIndex; i++) {
                  achievementIndex += jobs[i].achievements.length;
                }

                const isLastJob = jobIndex === jobs.length - 1;

                return (
                  <div
                    key={jobIndex}
                    ref={isLastJob ? (el) => { lastJobRef.current = el; } : undefined}
                    className="transition-opacity duration-700 ease-out"
                    style={{
                      opacity: isLastJob ? lastJobOpacity : 1,
                    }}
                  >
                    <div
                      ref={(el) => {
                        headerRefs.current[jobIndex] = el;
                      }}
                      className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 transition-opacity duration-700 ease-out"
                      style={{
                        opacity: headerOpacities[jobIndex] || 0,
                      }}
                    >
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent tracking-[-0.05rem] sm:tracking-[-0.1rem]">
                        {job.company}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <span className="text-base sm:text-lg md:text-xl text-white/90 font-semibold tracking-[-0.05rem] px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                          {job.role}
                        </span>
                        <span className="text-sm sm:text-base md:text-lg text-white/60 font-light italic">
                          {job.period}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-4 sm:space-y-5 md:space-y-6">
                      {job.achievements.map((text, index) => {
                        const currentAchievementIndex = achievementIndex + index;
                        return (
                          <li
                            key={index}
                            ref={(el) => {
                              achievementRefs.current[currentAchievementIndex] = el;
                            }}
                            className="relative flex items-start gap-4 sm:gap-5 transition-opacity duration-700 ease-out"
                            style={{
                              opacity: achievementOpacities[currentAchievementIndex] || 0,
                            }}
                          >
                            <div className="shrink-0 mt-1.5 sm:mt-2 flex items-center justify-center">
                              <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                  animation: achievementOpacities[currentAchievementIndex] > 0
                                    ? 'bulletSpin 1.2s ease-out'
                                    : 'none',
                                }}
                              >
                                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
                                <circle cx="12" cy="10" r="1.5" fill="rgba(24, 24, 27, 1)" />
                              </svg>
                            </div>
                            <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed tracking-[-0.02rem]">
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

      <div className="w-full px-4" style={{ marginBottom: '30vh' }}>
        <div className="text-center">
          <div className="inline-block">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-8 sm:mb-10 md:mb-12 tracking-[-0.05rem] sm:tracking-[-0.25rem]">
              Your future favorite coworker,
            </h2>
            <div className="pt-8 sm:pt-10 md:pt-12 flex justify-end">
              <svg
                ref={signatureRef}
                width="197"
                height="86"
                viewBox="0 0 197 86"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
          <g clipPath="url(#clip0_1_2)">
            <path d="M2.98058 45.3084C3.05598 45.0445 3.453 44.4561 4.33502 43.6386C4.8033 43.2046 5.5375 43.0097 10.6659 42.7606C15.7943 42.5116 25.3519 42.2854 30.6337 42.2159C35.9155 42.1465 36.6318 42.2408 37.6606 42.4119C38.6895 42.5829 40.009 42.828 41.3686 43.0805" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M78.7567 62.3608C78.88 61.3232 80.364 56.7572 81.7189 52.8793C81.9977 52.0815 81.9697 51.2388 81.8104 50.4864C81.6512 49.734 81.2565 49.068 80.4981 48.8482C79.7398 48.6284 78.6297 48.8751 77.5151 49.4339C73.0506 51.672 70.7714 55.2935 67.6818 59.4009C65.1255 62.7993 62.8205 67.2969 60.9532 71.1669C59.7532 73.6538 59.4716 75.5587 59.272 77.4837C59.1624 78.5408 59.2698 79.7786 59.7022 80.7717C60.1347 81.7649 60.9487 82.4803 62.0095 82.8611C64.248 83.6649 66.4394 83.1934 68.0175 82.8959C69.7123 82.5764 72.5566 81.1339 76.6946 78.9484C81.1454 76.5978 88.323 69.9349 97.319 61.1782C101.252 57.3497 103.527 54.395 108.99 46.1368C114.453 37.8787 122.94 24.3108 128.101 16.2728C134.677 6.03092 137.109 3.38549 138.043 2.88313C138.314 2.73789 138.263 3.76221 135.363 10.0031C132.463 16.244 126.74 27.9124 123.101 35.7119C117.843 46.9808 115.942 53.5614 114.772 58.3525C114.012 61.4614 113.917 64.954 113.509 68.2081C113.382 69.2247 112.484 68.7239 111.87 67.8661C105.053 58.3499 103.209 39.3305 101.464 36.0954C101.066 35.3577 100.495 34.8377 99.9452 34.2987C99.395 33.7597 98.8029 33.2664 97.9059 32.9752C97.0088 32.684 95.8247 32.61 94.6103 32.8432C93.3959 33.0765 92.1872 33.6192 91.0094 34.3181C89.8317 35.0171 88.7216 35.8558 87.8536 36.6826C86.9857 37.5094 86.3937 38.2989 86.0023 39.1496C85.611 40.0003 85.4383 40.8883 85.6824 41.5308C85.9264 42.1734 86.5925 42.5434 88.1197 42.734C89.647 42.9246 92.0152 42.9246 94.4552 42.9246" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M120.769 71.8546C120.719 71.904 120.151 72.4721 119.798 72.9367C119.674 73.0995 120.924 72.1432 121.975 70.9976C123.025 69.852 124.16 68.2978 129.098 59.2701C134.037 50.2424 142.745 33.7882 146.812 25.4228C150.878 17.0574 150.04 17.2794 148.67 18.6395C145.097 22.1883 140.213 30.7075 134.81 40.303C131.514 46.157 130.269 50.578 129.186 54.1872C127.893 58.4946 128.169 62.227 128.416 63.9183C128.534 64.7265 129.156 65.3136 129.867 65.6437C130.577 65.9737 131.49 65.9984 132.602 65.4931C137.887 63.0902 146.855 51.8309 151.407 46.7479C156.454 41.1118 142.09 62.2218 140.817 67.0068C140.584 67.883 140.728 68.7478 141.209 69.2416C141.69 69.7353 142.652 69.8587 143.555 69.6509C148.389 68.538 155.434 58.7756 160.811 51.4429C162.236 49.5004 162.456 47.6424 162.716 46.8037C162.959 46.0242 163.377 49.6645 163.738 52.9156C164.244 57.4746 163.631 61.2537 162.886 63.194C162.54 64.0959 162.042 64.7395 161.394 65.3787C160.746 66.0178 159.907 66.6098 159.068 67.0135C158.229 67.4172 157.415 67.6146 156.687 67.4079C155.959 67.2012 155.343 66.5844 155.272 65.798C155.201 65.0116 155.694 64.0742 156.405 63.2706C159.126 60.1925 163.652 58.958 177.219 54.2178C180.016 53.2407 180.732 52.9477 180.657 52.9802C177.256 54.4451 172.324 59.396 169.702 62.7114C169.184 63.3659 169.041 64.2386 169.382 64.8057C169.723 65.3727 170.685 65.6934 171.65 65.6242C172.614 65.5551 173.551 65.0864 174.737 64.3145C180.499 60.5646 183.877 56.0448 185.569 53.7061C186.302 52.6938 186.669 51.9595 186.379 51.702C186.089 51.4444 185.102 51.6664 184.36 52.1262C183.617 52.5859 183.148 53.2766 182.759 53.9778C182.37 54.679 182.073 55.3698 181.884 56.1696C181.694 56.9695 181.62 57.8576 181.854 58.6111C182.087 59.3646 182.63 59.9567 183.341 60.3481C184.052 60.7394 184.916 60.9121 186.199 60.9887C187.483 61.0653 189.16 61.0407 190.616 60.8676C192.073 60.6945 193.257 60.3738 194.477 60.0434" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M158.894 33.7298C158.696 33.6558 158.499 33.5818 157.99 33.3093C157.481 33.0369 156.667 32.5681 156.729 32.2527C156.791 31.9372 157.753 31.7892 159.716 31.8609" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_1_2">
              <rect width="197" height="86" fill="white" />
            </clipPath>
          </defs>
        </svg>
        </div>
        </div>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-5 md:gap-6 mt-10 sm:mt-12 md:mt-16">
          {contactLinks.map((link, index) => {
            const IconComponent = () => {
              switch (link.icon) {
                case 'email':
                  return (
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  );
                case 'linkedin':
                  return (
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  );
                case 'github':
                  return (
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  );
                case 'resume':
                  return (
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  );
                default:
                  return null;
              }
            };

            return (
              <a
                key={index}
                href={link.url}
                target={link.icon === 'resume' ? '_blank' : '_blank'}
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 bg-zinc-900/40 backdrop-blur-md border border-white/30 rounded-xl transition-all duration-500 hover:border-white/60 hover:shadow-2xl hover:shadow-white/20 hover:scale-110 text-white hover:text-white/90"
                aria-label={link.label}
              >
                <IconComponent />
              </a>
            );
          })}
        </div>
      </div>
    </section>
    </>
  );
}

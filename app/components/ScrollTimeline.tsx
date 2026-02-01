'use client';

import { useEffect, useState } from 'react';
import { useIsMobile, TIMELINE_CONSTANTS, PHASE_TIMING, OFFSETS, getTimelineMultiplier } from '../utils/responsive';

interface TimelineItem {
  title: string;
  description: string;
  year?: string;
}

const timelineItems: TimelineItem[] = [
  {
    title: 'Graduated Virginia Tech',
    description: 'With a double major in Biochemistry and Russian Language',
    year: 'May 2020',
  },
  {
    title: 'First day as a CVOR support tech',
    description: 'A second hand for two cardiac surgeons and their amazing staff of nurses',
    year: 'May 2020',
  },
  {
    title: 'My first ski trip out west!',
    description: 'Vail is still my favorite place on earth',
    year: 'December 2020',
  },
  {
    title: 'Official second scrub for bypass surgery (CABG)',
    description: 'Held my first heart 🫀',
    year: 'March 2021',
  },
  {
    title: 'First 8hr+ road trip',
    description: 'Had an epic time skiing in Stowe, Vermont!',
    year: 'December 2021',
  },
  {
    title: 'Surprise, I\'m no longer blind!',
    description: 'Had my first (and hopefully last) LASIK surgery',
    year: 'June 2022',
  },
  {
    title: 'Successfully hiked Precipice Trail',
    description: 'Another fun road trip exploring Maine!',
    year: 'July 2022',
  },
  {
    title: 'Time for a change - Bye bye CVOR',
    description: 'Started working as a night-shift, data assistant for the eICU team',
    year: 'August 2022',
  },
  {
    title: 'Inspired by the intersection of technology and medicine',
    description: 'I began to study javascript and python',
    year: 'March 2023',
  },
  {
    title: 'My first road bike',
    description: 'Added another outdoor hobby onto my list',
    year: 'April 2023',
  },
  {
    title: 'Enrolled into Hack Reactor',
    description: 'To learn full-stack development!',
    year: 'June 2023',
  },
  {
    title: 'Graduated Hack Reactor',
    description: 'I even was chosen to be the student speaker!',
    year: 'August 2023',
  },
  {
    title: 'Signed my first lease in New York City!',
    description: 'Yay, public transportation!',
    year: 'December 2023',
  },
  {
    title: 'My first software engineering gig!',
    description: 'Woohoo, began working at AlphaSights',
    year: 'January 2024',
  },
  {
    title: 'My first marathon!',
    description: 'And probably my last... 🤣',
    year: 'March 2025',
  },
  {
    title: 'First time renting a convertible',
    description: 'To explore Nevada and California in style!',
    year: 'May 2025',
  },
  {
    title: 'First time playing pickleball',
    description: 'It\'s quite addicting, might have to try to learn tennis again...',
    year: 'June 2025',
  },
  {
    title: 'Searching for my next chapter',
    description: 'What\'s next?',
    year: 'January 2026',
  }
];

export default function ScrollTimeline() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [heroScrolledPast, setHeroScrolledPast] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number>(TIMELINE_CONSTANTS.CURSOR_START_POSITION);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      const heroThreshold = windowHeight * TIMELINE_CONSTANTS.HERO_THRESHOLD;
      const isHeroPast = scrollTop > heroThreshold;
      setHeroScrolledPast(isHeroPast);

      setIsCursorVisible(isHeroPast);

      if (!isHeroPast) {
        setScrollProgress(0);
      } else {
        setCursorPosition(10);

        const heroHeight = windowHeight;
        const adjustedScroll = Math.max(0, scrollTop - heroHeight);
        const timelineMultiplier = getTimelineMultiplier(isMobile);
        const timelineSectionHeight = windowHeight * timelineMultiplier;
        const progress = Math.min(1.2, (adjustedScroll / timelineSectionHeight) * 1.2);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobile]);
  const numSections = 3;
  const sectionSize = 1 / numSections;
  const currentSection = heroScrolledPast
    ? Math.min(Math.floor(scrollProgress / sectionSize), numSections - 1)
    : -1;
  const sectionProgress = heroScrolledPast && currentSection >= 0
    ? Math.min(1.0, (scrollProgress - (currentSection * sectionSize)) / sectionSize)
    : 0;

  const maxVisibleEvents = Math.ceil(timelineItems.length / numSections);
  const sectionStartIndex = currentSection >= 0 ? currentSection * maxVisibleEvents : 0;
  const sectionEndIndex = currentSection >= 0
    ? Math.min(sectionStartIndex + maxVisibleEvents - 1, timelineItems.length - 1)
    : 0;

  const adjustedProgress = Math.pow(sectionProgress, 0.7);
  const activeIndex = heroScrolledPast && currentSection >= 0
    ? Math.min(
      sectionStartIndex + Math.floor(adjustedProgress * (sectionEndIndex - sectionStartIndex + 1)),
      sectionEndIndex
    )
    : -1;

  const calculatedCursorPosition = heroScrolledPast && activeIndex >= 0
    ? (() => {
        const eventsInSection = sectionEndIndex - sectionStartIndex + 1;
        const positionInSection = eventsInSection > 1
          ? (activeIndex - sectionStartIndex) / (eventsInSection - 1)
          : 0;
        return 10 + (positionInSection * 80);
      })()
    : heroScrolledPast ? 10 : cursorPosition;

  const lineStartPosition = heroScrolledPast ? 10 : 0;
  const lineHeight = calculatedCursorPosition - lineStartPosition;

  const lastSectionStart = (numSections - 1) * sectionSize;
  const phaseOutStartProgress = 0.8;
  const fadeOutStart = lastSectionStart + (phaseOutStartProgress * sectionSize);
  const fadeOutEnd = 1.0;
  const fadeOutDuration = fadeOutEnd - fadeOutStart;

  const isLastSection = currentSection === numSections - 1;
  const fadeOutProgress = isLastSection && scrollProgress >= fadeOutStart
    ? Math.min(1, (scrollProgress - fadeOutStart) / fadeOutDuration)
    : 0;

  const timelineOpacity = 1 - fadeOutProgress;


  return (
    <div
      className="fixed left-4 sm:left-1/2 top-1/2 sm:-translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-opacity duration-1000 ease-in-out"
      style={{
        opacity: timelineOpacity,
        ...(heroScrolledPast && isMobile && { left: '50%', transform: 'translate(-50%, -50%)' }),
      }}
    >
      <div className="relative w-full h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
        {heroScrolledPast && (
          <h2
            className="absolute left-1/2 -translate-x-1/2 top-[-100px] sm:top-[-120px] md:top-[-140px] text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-[-0.05rem] sm:tracking-[-0.25rem] pointer-events-none transition-opacity duration-200 ease-in-out"
            style={{
              opacity: scrollProgress >= 0 ? Math.min(1, scrollProgress / 0.02) : 0,
              visibility: scrollProgress >= 0 ? 'visible' : 'hidden',
            }}
          >
            History
          </h2>
        )}
        {heroScrolledPast && (
        <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-0.5 hidden md:block">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-white/60 via-white to-white/60 transition-all duration-300"
            style={{
              top: `${lineStartPosition}%`,
              height: `${Math.max(0, lineHeight)}%`,
              opacity: isCursorVisible ? 1 : 0,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/90 to-transparent animate-shimmer" />
          </div>
        </div>
        )}

        {heroScrolledPast && (
        <div
          className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 transition-all duration-1000 ease-in-out hidden md:block"
          style={{
            top: `${calculatedCursorPosition}%`,
            transform: 'translateY(-50%)',
            opacity: isCursorVisible ? 1 : 0,
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-white rounded-full blur-lg opacity-40 animate-pulse" />
            <div className="absolute inset-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-white rounded-full blur-md opacity-50" />
            <div className="relative w-5 h-5 bg-white rounded-full shadow-lg shadow-white/50">
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-50" />
            </div>
          </div>
        </div>
        )}

        {[0, 1, 2].map((layerIndex) => {
          const layerEvents = timelineItems.filter((_, index) => {
            const eventGroup = Math.floor(index / maxVisibleEvents);
            return eventGroup === layerIndex;
          });
          const layerStartIndex = layerIndex * maxVisibleEvents;

          const isCurrentSection = currentSection === layerIndex;

          return (
            <div key={layerIndex} className="absolute inset-0">
              {layerEvents.map((item, localIndex) => {
                const index = layerStartIndex + localIndex;
                const isActive = index === activeIndex;
                const isPast = index < activeIndex;
                const isLeft = isMobile
                  ? (heroScrolledPast ? (index % 2 === 1) : false)
                  : (index % 2 === 0);

                const isInCurrentSection = index >= sectionStartIndex && index <= sectionEndIndex;

                const eventsInSection = sectionEndIndex - sectionStartIndex + 1;
                const positionInSection = eventsInSection > 1 ? localIndex / (eventsInSection - 1) : 0;
                const fixedPosition = 10 + (positionInSection * 80);

                const eventPositionInSection = eventsInSection > 1
                  ? (index - sectionStartIndex) / (eventsInSection - 1)
                  : 0;

                const phaseTiming = isMobile ? PHASE_TIMING.MOBILE : PHASE_TIMING.DESKTOP;
                const phaseInDuration = phaseTiming.PHASE_IN_DURATION;
                const phaseInStart = eventPositionInSection * phaseTiming.PHASE_IN_START_MULTIPLIER;
                const phaseInEnd = Math.min(1, phaseInStart + phaseInDuration);

                const phaseOutStart = phaseTiming.PHASE_OUT_START;
                const phaseOutEnd = PHASE_TIMING.PHASE_OUT_END;

                const hasPhasedIn = isCurrentSection && isInCurrentSection && adjustedProgress >= phaseInEnd;
                const isPhasingIn = isCurrentSection && isInCurrentSection && adjustedProgress >= phaseInStart && adjustedProgress < phaseInEnd;
                const isVisible = hasPhasedIn && adjustedProgress < phaseOutStart;
                const isPhasingOut = isCurrentSection && isInCurrentSection && adjustedProgress >= phaseOutStart && adjustedProgress <= phaseOutEnd;
                const shouldBeVisible = isPhasingIn || isVisible || isPhasingOut;

                let opacity = 0;
                if (isActive) {
                  if (isPhasingIn) {
                    opacity = (adjustedProgress - phaseInStart) / (phaseInEnd - phaseInStart);
                  } else if (isVisible) {
                    opacity = 1;
                  } else if (isPhasingOut) {
                    opacity = 1 - ((adjustedProgress - phaseOutStart) / (phaseOutEnd - phaseOutStart));
                  }
                } else if (isPast && shouldBeVisible) {
                  if (isPhasingIn) {
                    opacity = 0.3 * ((adjustedProgress - phaseInStart) / (phaseInEnd - phaseInStart));
                  } else if (isVisible) {
                    opacity = 0.3;
                  } else if (isPhasingOut) {
                    opacity = 0.3 * (1 - ((adjustedProgress - phaseOutStart) / (phaseOutEnd - phaseOutStart)));
                  }
                }

                const scale = isActive ? 1.1 : isPast ? 0.95 : 1;

                const getResponsiveOffset = (isLeft: boolean, isHidden: boolean) => {
                  if (heroScrolledPast && isMobile) {
                    if (isHidden) {
                      return isLeft ? OFFSETS.MOBILE_HISTORY.LEFT_HIDDEN : OFFSETS.MOBILE_HISTORY.RIGHT_HIDDEN;
                    } else {
                      return OFFSETS.MOBILE_HISTORY.CENTERED;
                    }
                  }

                  if (isMobile) {
                    return isHidden ? OFFSETS.MOBILE_HERO.HIDDEN : OFFSETS.MOBILE_HERO.VISIBLE;
                  } else if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    const tabletOffsets = isLeft ? OFFSETS.TABLET.LEFT : OFFSETS.TABLET.RIGHT;
                    return isHidden ? tabletOffsets.HIDDEN : tabletOffsets.VISIBLE;
                  } else {
                    const desktopOffsets = isLeft ? OFFSETS.DESKTOP.LEFT : OFFSETS.DESKTOP.RIGHT;
                    return isHidden ? desktopOffsets.HIDDEN : desktopOffsets.VISIBLE;
                  }
                };

                const horizontalOffset = getResponsiveOffset(isLeft, false);
                const horizontalOffsetHidden = getResponsiveOffset(isLeft, true);
                let currentHorizontalOffset: string = horizontalOffsetHidden;

                if (isActive || (isPast && shouldBeVisible)) {
                  if (isPhasingIn) {
                    const slideProgress = (adjustedProgress - phaseInStart) / (phaseInEnd - phaseInStart);
                    const hiddenOffset = parseInt(horizontalOffsetHidden);
                    const visibleOffset = parseInt(horizontalOffset);
                    const offsetDiff = visibleOffset - hiddenOffset;
                    currentHorizontalOffset = `${hiddenOffset + (offsetDiff * slideProgress)}px`;
                  } else {
                    currentHorizontalOffset = horizontalOffset;
                  }
                }

                let zIndexValue = 10;
                if (isActive) {
                  zIndexValue = 1000;
                } else if (isPast) {
                  zIndexValue = 100 + index;
                } else {
                  zIndexValue = 10 + index;
                }

                const getTransform = () => {
                  if (heroScrolledPast && isMobile) {
                    const horizontalOffsetValue = parseInt(currentHorizontalOffset.replace('px', ''));
                    return `translate(calc(-50% + ${horizontalOffsetValue}px), -50%) scale(${scale})`;
                  } else {
                    return `translateX(${currentHorizontalOffset}) translateY(-50%) scale(${scale})`;
                  }
                };

                return (
                  <div
                    key={index}
                    className="absolute left-0 sm:left-1/2 transition-all duration-700 ease-out"
                    style={{
                      top: `${fixedPosition}%`,
                      zIndex: zIndexValue,
                      transform: getTransform(),
                      opacity: opacity,
                      ...(heroScrolledPast && isMobile && { left: '50%' }),
                    }}
                  >
                    <div
                      className={`bg-zinc-900/90 backdrop-blur-md border rounded-xl p-4 sm:p-5 min-w-[200px] max-w-[240px] sm:min-w-[240px] sm:max-w-[280px] transition-all duration-500 ${
                        isActive
                          ? 'border-white shadow-2xl shadow-white/30'
                          : isPast
                            ? 'border-white/30'
                            : 'border-white/40'
                        }`}
                    >
                      {item.year && (
                        <div className="text-xs text-white/70 mb-2 font-medium">
                          {item.year}
                        </div>
                      )}
                      <h3 className="text-white font-bold text-base sm:text-lg mb-2 tracking-[-0.05rem] sm:tracking-[-0.1rem]">
                        {item.title}
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

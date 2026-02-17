'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useIsMobile, TIMELINE_CONSTANTS, PHASE_TIMING, OFFSETS, getTimelineMultiplier } from '../utils/responsive';

interface TimelineItem {
  title: string;
  description: string;
  year?: string;
  picture?: string;
}

const timelineItems: TimelineItem[] = [
  {
    title: 'Graduated Virginia Tech 🎓',
    description: 'With a double major in Biochemistry and Russian Language',
    year: 'May 2020',
  },
  {
    title: 'First day as a CVOR support tech 🩺',
    description: '',
    year: 'May 2020',
    picture: 'CVOR-event.png',
  },
  {
    title: 'First ski trip out west! 🎿',
    description: '',
    year: 'December 2020',
    picture: 'colorado-event.png',
  },
  {
    title: 'First time scrubbing in to assist 🫀',
    description: '',
    year: 'March 2021',
    picture: 'scrub-event.png',
  },
  {
    title: 'First 8hr+ road trip 🚗',
    description: 'Had an epic time skiing in Stowe, Vermont!',
    year: 'December 2021',
  },
  {
    title: 'Surprise, I\'m no longer blind! 🤯',
    description: 'Had a successful LASIK surgery',
    year: 'June 2022',
  },
  {
    title: 'Successfully hiked Precipice Trail 🥾',
    description: '',
    year: 'July 2022',
    picture: 'maine-event.png',
  },
  {
    title: 'Time for a change - Bye bye CVOR 💔',
    description: 'Started working as a night-shift, data assistant for the eICU team',
    year: 'August 2022',
  },
  {
    title: 'Inspired by the intersection of technology and medicine 📚',
    description: 'I began to study javascript and python',
    year: 'March 2023',
  },
  {
    title: 'First road bike 🚴',
    description: '',
    year: 'April 2023',
    picture: 'bike-event.png',
  },
  {
    title: 'Enrolled into Hack Reactor 💻',
    description: '',
    year: 'June 2023',
    picture: 'hackreactor-event.png',
  },
  {
    title: 'Graduated Hack Reactor 📆',
    description: '',
    year: 'August 2023',
    picture: 'graduation-event.png',
  },
  {
    title: 'First lease signed! 🌃',
    description: '',
    year: 'December 2023',
    picture: 'nyc-event.png',
  },
  {
    title: 'First software engineering gig! 💼',
    description: '',
    year: 'January 2024',
    picture: 'alphasights-event.png',
  },
  {
    title: 'First marathon! ',
    description: '',
    year: 'March 2025',
    picture: 'marathon-event.png',
  },
  {
    title: 'First time renting a convertible 🌄',
    description: '',
    year: 'May 2025',
    picture: 'driving-event.png',
  },
  {
    title: 'First time playing pickleball 🎾',
    description: 'It\'s quite addicting, might have to try to learn tennis again...',
    year: 'June 2025',
  },
  {
    title: 'Searching for my next chapter 🔍',
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

    const checkHistorySection = () => {
      const historySection = document.getElementById('history');
      if (historySection) {
        const rect = historySection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInView) {
          const windowHeight = window.innerHeight;
          const scrollTop = window.scrollY;
          const heroThreshold = windowHeight * TIMELINE_CONSTANTS.HERO_THRESHOLD;
          if (scrollTop > heroThreshold) {
            setHeroScrolledPast(true);
            setIsCursorVisible(true);
            const heroHeight = windowHeight;
            const adjustedScroll = Math.max(0, scrollTop - heroHeight);
            const timelineMultiplier = getTimelineMultiplier(isMobile);
            const timelineSectionHeight = windowHeight * timelineMultiplier;
            const progress = Math.min(1.2, (adjustedScroll / timelineSectionHeight) * 1.2);
            setScrollProgress(Math.max(0.02, progress));
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    handleScroll();
    checkHistorySection();
    const timeout = setTimeout(checkHistorySection, 100);

    const handleHashChange = () => {
      setTimeout(() => {
        checkHistorySection();
        handleScroll();
      }, 100);
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
      clearTimeout(timeout);
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
        return 18 + (positionInSection * 72);
      })()
    : heroScrolledPast ? 18 : cursorPosition;

  const lineStartPosition = heroScrolledPast ? 18 : 0;
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
            className="absolute left-1/2 -translate-x-1/2 top-[-100px] sm:top-[-120px] md:top-[-140px] text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white pointer-events-none transition-opacity duration-200 ease-in-out"
            style={{
              opacity: scrollProgress >= 0.02 ? Math.min(1, scrollProgress / 0.02) : 1,
              visibility: 'visible',
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
            <div key={`timeline-layer-${layerIndex}`} className="absolute inset-0">
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
                const fixedPosition = 18 + (positionInSection * 72);

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
                    key={`timeline-${layerIndex}-${index}`}
                    className="absolute left-0 sm:left-1/2 transition-all duration-700 ease-out"
                    style={{
                      top: `${fixedPosition}%`,
                      zIndex: zIndexValue,
                      transform: getTransform(),
                      opacity: opacity,
                      ...(heroScrolledPast && isMobile && { left: '50%' }),
                    }}
                  >
                    {item.picture ? (
                      <div
                        className="relative transition-all duration-500 bg-zinc-900/90 backdrop-blur-md"
                        style={{
                          width: '20em',
                          height: '26em',
                          boxShadow: '0px 1px 13px rgba(0,0,0,0.1)',
                          padding: '0.5em',
                          paddingBottom: '6em',
                        }}
                      >
                        <div
                          className="image"
                          style={{
                            background: 'rgb(241, 241, 241)',
                            width: 'calc(100% - 1em)',
                            height: 'calc(100% - 6em - 0.5em)',
                            display: 'grid',
                            placeItems: 'center',
                            position: 'absolute',
                            top: '0.5em',
                            left: '0.5em',
                            right: '0.5em',
                            overflow: 'hidden',
                          }}
                        >
                          <Image
                            src={`/${item.picture}`}
                            alt={item.title}
                            width={190}
                            height={240}
                            className="w-full h-full object-cover"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                        <div
                          className="absolute left-0 bottom-0 w-full"
                          style={{
                            paddingTop: '1.25em',
                            paddingLeft: '1.25em',
                            paddingBottom: '0.625em',
                            zIndex: 10,
                          }}
                        >
                          <h3
                            className="title"
                            style={{
                              fontSize: item.description ? '1.25em' : '1.5em',
                              position: 'absolute',
                              left: '0.625em',
                              bottom: item.description ? '3.5em' : '2em',
                              fontWeight: 700,
                              color: 'rgba(255, 255, 255, 0.7)',
                              margin: 0,
                              maxWidth: 'calc(100% - 1.25em)',
                            }}
                          >
                            {item.title}
                          </h3>
                          {item.description ? (
                            <p
                              style={{
                                fontSize: '1.25em',
                                position: 'absolute',
                                left: '0.625em',
                                bottom: '2em',
                                color: 'rgba(255, 255, 255, 0.8)',
                                margin: 0,
                                maxWidth: 'calc(100% - 1.25em)',
                                lineHeight: '1.3',
                              }}
                            >
                              {item.description}
                            </p>
                          ) : null}
                          {item.year && (
                            <div
                              className="price"
                              style={{
                                fontSize: '1.25em',
                                position: 'absolute',
                                left: '0.625em',
                                bottom: '0.625em',
                                color: 'rgba(255, 255, 255, 0.7)',
                                margin: 0,
                                fontWeight: 700,
                              }}
                            >
                              {item.year}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="relative transition-all duration-500 bg-zinc-900/90 backdrop-blur-md"
                        style={{
                          width: '18em',
                          boxShadow: '0px 1px 13px rgba(0,0,0,0.1)',
                          padding: '1em 1.25em',
                          paddingTop: '1.25em',
                          paddingBottom: '1.25em',
                        }}
                      >
                        <div
                          className="w-full flex flex-col"
                          style={{
                            gap: '0.5em',
                            minWidth: 0,
                          }}
                        >
                          <h3
                            className="title"
                            style={{
                              fontSize: item.description ? '1.35em' : '1.65em',
                              fontWeight: 700,
                              color: 'rgba(255, 255, 255, 0.7)',
                              margin: 0,
                            }}
                          >
                            {item.title}
                          </h3>
                          {item.description && (
                            <p
                              style={{
                                fontSize: '1.2em',
                                color: 'rgba(255, 255, 255, 0.8)',
                                margin: 0,
                                lineHeight: '1.3',
                              }}
                            >
                              {item.description}
                            </p>
                          )}
                          {item.year && (
                            <div
                              className="price"
                              style={{
                                fontSize: '1.35em',
                                fontWeight: 700,
                                color: 'rgba(255, 255, 255, 0.7)',
                                margin: 0,
                                marginTop: 'auto',
                              }}
                            >
                              {item.year}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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

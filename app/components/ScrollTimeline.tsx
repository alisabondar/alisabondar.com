'use client';

import { useEffect, useState } from 'react';

interface TimelineItem {
  title: string;
  description: string;
  year?: string;
}

const timelineItems: TimelineItem[] = [
  {
    title: 'Graduated Virginia Tech',
    description: 'Believing my life will begin in med school',
    year: 'May 2020',
  },
  {
    title: 'First Job',
    description: 'Working for two cardiac surgeons 🫨',
    year: 'June 2020',
  },
  {
    title: 'Official second scrub for bypass surgery (CABG)',
    description: 'Held my first heart 🫀',
    year: 'March 2021',
  },
  {
    title: 'Ski trip to Stowe, Vermont',
    description: 'Longest road trip to date!',
    year: 'December 2021',
  },
  {
    title: 'Waitlisted',
    description: ' and eventually rejected from med school :(',
    year: 'May 2022',
  },
  {
    title: 'Hiking trip to Acadia National Park',
    description: 'Successfully made it to the top of Precipice Trail!',
    year: 'August 2022',
  },
  {
    title: 'Bye bye CVOR, hello eICU',
    description: 'Started working full time as a night-shift, data assistant',
    year: 'August 2022',
  },
  {
    title: 'Waitlisted',
    description: 'AGAIN from my top choice med school :((',
    year: 'January 2023',
  },
  {
    title: 'First concert at Red Rocks Amphitheatre',
    description: 'Began to study javascript and python',
    year: 'March 2023',
  },
  {
    title: 'Began to pivot',
    description: 'Enrolled into Hack Reactor to learn full-stack development',
    year: 'June 2023',
  },
  {
    title: 'Graduated Hack Reactor',
    description: 'I even was chosen to be the student speaker!',
    year: 'August 2023',
  },
  {
    title: 'Signed a lease in New York City',
    description: 'Yay, public transportation!',
    year: 'December 2023',
  },
  {
    title: 'Began working at AlphaSights',
    description: 'Wohoo, I did it!',
    year: 'January 2024',
  },
  {
    title: 'Ran a marathon!',
    description: 'And drank lots of wine in Napa Valley 🍷',
    year: 'March 2025',
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
  const [cursorPosition, setCursorPosition] = useState(70);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      setIsCursorVisible(scrollTop > 0);

      const heroThreshold = windowHeight * 0.8;
      const isHeroPast = scrollTop > heroThreshold;
      setHeroScrolledPast(isHeroPast);

      if (!isHeroPast) {
        const startPosition = 70;
        const endPosition = 0;
        const cursorProgress = Math.min(1, scrollTop / heroThreshold);
        const currentPosition = startPosition - (startPosition - endPosition) * cursorProgress;
        setCursorPosition(currentPosition);
        setScrollProgress(0);
      } else {
        setCursorPosition(0);

        const heroHeight = windowHeight;
        const adjustedScroll = Math.max(0, scrollTop - heroHeight);
        const timelineSectionHeight = windowHeight * 9.6;
        const progress = Math.min(1.2, (adjustedScroll / timelineSectionHeight) * 1.2);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const getActiveEventPosition = () => {
    if (activeIndex >= 0 && activeIndex < timelineItems.length) {
      const eventsInSection = sectionEndIndex - sectionStartIndex + 1;
      const localIndex = activeIndex - sectionStartIndex;
      const positionInSection = eventsInSection > 1 ? localIndex / (eventsInSection - 1) : 0;
      return 10 + (positionInSection * 80); // Same calculation as fixedPosition
    }
    return cursorPosition;
  };

  const heroLinePosition = heroScrolledPast
    ? getActiveEventPosition()
    : cursorPosition;

  return (
    <div
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-opacity duration-1000 ease-in-out"
      style={{
        opacity: timelineOpacity,
      }}
    >
      <div className="relative w-full h-full min-h-[600px]">
        {heroScrolledPast && (
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
            <div
              className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-white/60 via-white to-white/60 transition-all duration-300"
              style={{
                top: `${cursorPosition}%`,
                height: `${heroLinePosition - cursorPosition}%`,
                opacity: isCursorVisible ? 1 : 0,
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/90 to-transparent animate-shimmer" />
            </div>
          </div>
        )}

        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-1000 ease-in-out"
          style={{
            top: `${heroLinePosition}%`,
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
                const isLeft = index % 2 === 0;

                const isInCurrentSection = index >= sectionStartIndex && index <= sectionEndIndex;

                const eventsInSection = sectionEndIndex - sectionStartIndex + 1;
                const positionInSection = eventsInSection > 1 ? localIndex / (eventsInSection - 1) : 0;
                const fixedPosition = 10 + (positionInSection * 80);

                const eventPositionInSection = eventsInSection > 1
                  ? (index - sectionStartIndex) / (eventsInSection - 1)
                  : 0;

                const phaseInDuration = 0.15;
                const phaseInStart = eventPositionInSection * 0.2;
                const phaseInEnd = Math.min(1, phaseInStart + phaseInDuration);

                const phaseOutStart = 0.8;
                const phaseOutEnd = 1.0;

                const hasPhasedIn = isCurrentSection && isInCurrentSection && adjustedProgress >= phaseInEnd;
                const isPhasingIn = isCurrentSection && isInCurrentSection && adjustedProgress >= phaseInStart && adjustedProgress < phaseInEnd;
                const isVisible = hasPhasedIn && adjustedProgress < phaseOutStart;
                const isPhasingOut = isCurrentSection && isInCurrentSection && adjustedProgress >= phaseOutStart && adjustedProgress <= phaseOutEnd;
                const shouldBeVisible = isPhasingIn || isVisible || isPhasingOut;

                const baseOpacity = isActive ? 1 : isPast ? 0.3 : 1;

                let opacity = 0;
                if (isPhasingIn) {
                  opacity = baseOpacity * ((adjustedProgress - phaseInStart) / (phaseInEnd - phaseInStart));
                } else if (isVisible) {
                  opacity = baseOpacity;
                } else if (isPhasingOut) {
                  opacity = baseOpacity * (1 - ((adjustedProgress - phaseOutStart) / (phaseOutEnd - phaseOutStart)));
                }

                const scale = isActive ? 1.1 : isPast ? 0.95 : 1;

                const horizontalOffset = isLeft ? '-360px' : '200px';
                const horizontalOffsetHidden = isLeft ? '-480px' : '320px';
                let currentHorizontalOffset = horizontalOffsetHidden;

                if (shouldBeVisible) {
                  if (isPhasingIn) {
                    const slideProgress = (adjustedProgress - phaseInStart) / (phaseInEnd - phaseInStart);
                    const offsetDiff = isLeft
                      ? (parseInt(horizontalOffset) - parseInt(horizontalOffsetHidden))
                      : (parseInt(horizontalOffset) - parseInt(horizontalOffsetHidden));
                    currentHorizontalOffset = `${parseInt(horizontalOffsetHidden) + (offsetDiff * slideProgress)}px`;
                  } else {
                    currentHorizontalOffset = horizontalOffset;
                  }
                }

                return (
                  <div
                    key={index}
                    className="absolute left-1/2 transition-all duration-700 ease-out"
                    style={{
                      top: `${fixedPosition}%`,
                      zIndex: 10 + index,
                      transform: `translateX(${currentHorizontalOffset}) translateY(-50%) scale(${scale})`,
                      opacity: opacity,
                    }}
                  >
                    <div
                      className={`bg-zinc-900/90 backdrop-blur-md border rounded-xl p-5 min-w-[240px] max-w-[280px] transition-all duration-500 ${
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
                      <h3 className="text-white font-bold text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
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


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
    description: 'Waiting for my life to begin with an acceptance to med school',
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
    title: 'Waitlisted for med schools',
    description: 'guess I have to try again :(',
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
    title: 'Waitlisted AGAIN',
    description: 'hmmm... maybe I can make an impact through computer science?',
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

export default function UnifiedScrollTimeline() {
  const [rawProgress, setRawProgress] = useState(0);
  const [easedProgress, setEasedProgress] = useState(0);
  const [heroScrolledPast, setHeroScrolledPast] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(false);

  useEffect(() => {
    const easeInOut = (t: number) =>
      t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const heroThreshold = windowHeight * 0.8;
      const isPastHero = scrollTop > heroThreshold;
      setHeroScrolledPast(isPastHero);

      setIsCursorVisible(isPastHero);

      if (!isPastHero) {
        setRawProgress(0);
        setEasedProgress(0);
        return;
      }

      const heroHeight = windowHeight;
      const scrollableHeight = documentHeight - heroHeight;
      const adjustedScroll = Math.max(0, scrollTop - heroHeight);

      const progress = Math.min(1, adjustedScroll / scrollableHeight);
      setRawProgress(progress);
      setEasedProgress(easeInOut(progress));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const exactIndex = heroScrolledPast
    ? easedProgress * (timelineItems.length - 1)
    : -1;
  const activeIndex = heroScrolledPast
    ? Math.min(Math.floor(exactIndex), timelineItems.length - 1)
    : -1;
  const nextIndex = heroScrolledPast
    ? Math.min(activeIndex + 1, timelineItems.length - 1)
    : activeIndex;

  const totalEvents = timelineItems.length;
  const topPadding = 10;
  const bottomPadding = 10;
  const availableHeight = 100 - topPadding - bottomPadding;
  const spacing = availableHeight / (totalEvents - 1);

  const getEventPosition = (index: number) => {
    return topPadding + index * spacing;
  };

  const currentEventPosition = activeIndex >= 0 ? getEventPosition(activeIndex) : topPadding;
  const nextEventPosition = nextIndex >= 0 ? getEventPosition(nextIndex) : currentEventPosition;

  const eventProgress = activeIndex >= 0
    ? (exactIndex - activeIndex)
    : 0;

  const cursorPosition = heroScrolledPast
    ? currentEventPosition + eventProgress * (nextEventPosition - currentEventPosition)
    : topPadding;

  const firstEventPosition = getEventPosition(0);
  const lineTop = firstEventPosition;
  const lineHeight = cursorPosition - lineTop;

  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
      <div className="relative w-full h-full min-h-[1400px]">
        {heroScrolledPast && lineHeight > 0 && (
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
            <div
              className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-white/60 via-white to-white/60 transition-all duration-300"
              style={{
                top: `${lineTop}%`,
                height: `${lineHeight}%`,
                opacity: isCursorVisible ? 1 : 0,
                boxShadow:
                  '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)',
              }}
            />
          </div>
        )}

        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-out"
          style={{
            top: `${cursorPosition}%`,
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

        {timelineItems.map((item, index) => {
          const position = getEventPosition(index);

          const indexDistance = index - activeIndex;

          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          const isLeft = index % 2 === 0;

          const MAX_VISIBLE_BEFORE = 4;
          const MAX_VISIBLE_AFTER = 2;

          const shouldShow =
            heroScrolledPast &&
            indexDistance >= -MAX_VISIBLE_BEFORE &&
            indexDistance <= MAX_VISIBLE_AFTER;

          const distanceFromCursor = Math.abs(position - cursorPosition);
          const maxDistance = spacing * 2;
          const distanceOpacity = Math.max(0, 1 - distanceFromCursor / maxDistance);

          return (
            <div
              key={index}
              className="absolute left-1/3 transition-all duration-500 ease-out"
              style={{
                top: `${position}%`,
                zIndex: 10 + index,
                transform: `translateX(${
                  shouldShow
                    ? isLeft
                      ? '-360px'
                      : '200px'
                    : isLeft
                    ? '-480px'
                    : '320px'
                }) translateY(-50%)`,
                opacity: shouldShow
                  ? isActive
                    ? 1
                    : isPast
                    ? Math.max(0.35, distanceOpacity * 0.6)
                    : Math.max(0.6, distanceOpacity)
                  : 0,
              }}
            >
              <div
                className={`bg-zinc-900/90 backdrop-blur-md border rounded-xl p-5 min-w-[240px] max-w-[280px] transition-all duration-500 ${
                  isActive
                    ? 'border-white scale-110 shadow-2xl shadow-white/30'
                    : isPast
                    ? 'border-white/30 scale-95 opacity-40'
                    : 'border-white/40 scale-95'
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
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';

interface TimelineItem {
  title: string;
  description: string;
  year?: string;
}

const timelineItems: TimelineItem[] = [
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

export default function ScrollTimelinePart2() {
  const [rawProgress, setRawProgress] = useState(0);
  const [easedProgress, setEasedProgress] = useState(0);
  const [heroScrolledPast, setHeroScrolledPast] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const easeInOut = (t: number) =>
      t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const heroHeight = windowHeight;
      const part1End = heroHeight + windowHeight;

      const part2Start = part1End;
      const isPastPart2Start = scrollTop >= part2Start;

      setIsCursorVisible(isPastPart2Start);
      setHeroScrolledPast(isPastPart2Start);

      if (!isPastPart2Start) {
        setRawProgress(0);
        setEasedProgress(0);
        return;
      }

      const part2ScrollableHeight = windowHeight;
      const adjustedScroll = Math.max(0, scrollTop - part2Start);

      const progress = Math.min(1, adjustedScroll / part2ScrollableHeight);
      setRawProgress(progress);
      setEasedProgress(easeInOut(progress));

      setShouldShow(isPastPart2Start);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();
    const rafId = requestAnimationFrame(() => {
      handleScroll();
    });
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, []);

  const activeIndex = heroScrolledPast
    ? Math.min(
        Math.floor(easedProgress * timelineItems.length),
        timelineItems.length - 1
      )
    : -1;

  const topPadding = 10;
  const bottomPadding = 10;
  const availableHeight = 100 - topPadding - bottomPadding;
  const spacing = availableHeight / (timelineItems.length - 1);

  const firstItemPosition = topPadding;
  const lastItemPosition = topPadding + (timelineItems.length - 1) * spacing;

  const cursorPosition = heroScrolledPast
    ? firstItemPosition + easedProgress * (lastItemPosition - firstItemPosition)
    : firstItemPosition;

  return (
    <div
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-opacity duration-500"
      style={{ opacity: shouldShow ? 1 : 0, visibility: shouldShow ? 'visible' : 'hidden' }}
    >
      <div className="relative w-full h-full min-h-[800px]">
        {heroScrolledPast && (
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
            <div
              className="absolute left-1/2 w-0.5 bg-gradient-to-b from-white/60 via-white to-white/60 transition-all duration-300"
              style={{
                top: `${firstItemPosition}%`,
                height: `${cursorPosition - firstItemPosition}%`,
                opacity: isCursorVisible ? 1 : 0,
                boxShadow:
                  '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)',
                transform: `translateX(calc(-50% + ${Math.sin(easedProgress * Math.PI) * 2}px))`,
              }}
            />
          </div>
        )}

        <div
          className="absolute left-1/2 transition-all duration-700 ease-out"
          style={{
            top: `${cursorPosition}%`,
            opacity: isCursorVisible ? 1 : 0,
            transform: `translateX(calc(-50% + ${Math.sin(easedProgress * Math.PI * 3) * 3}px)) translateY(${Math.cos(easedProgress * Math.PI * 2) * 2}px)`,
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
          const totalEvents = timelineItems.length;
          const topPadding = 10;
          const bottomPadding = 10;
          const availableHeight = 100 - topPadding - bottomPadding;
          const spacing = availableHeight / (totalEvents - 1);
          const basePosition = topPadding + index * spacing;

          const indexDistance = index - activeIndex;

          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          const isLeft = index % 2 === 0;

          const shouldShow = heroScrolledPast;

          const parallaxSpeed = 1 - Math.abs(indexDistance) * 0.15;
          const parallaxOffset = (1 - parallaxSpeed) * easedProgress * 20;
          const parallaxPosition = basePosition + (isPast ? -parallaxOffset : parallaxOffset);

          const horizontalParallax = Math.sin(easedProgress * Math.PI * 2) * 10 * (1 - Math.abs(indexDistance) * 0.2);

          return (
            <div
              key={index}
              className="absolute left-1/3 transition-all duration-700 ease-out"
              style={{
                top: `${parallaxPosition}%`,
                zIndex: 10 + index,
                transform: `translateX(${
                  shouldShow
                    ? isLeft
                      ? `-${360 + horizontalParallax}px`
                      : `${200 + horizontalParallax}px`
                    : isLeft
                    ? '-480px'
                    : '320px'
                }) translateY(-50%)`,
                opacity: shouldShow ? 1 : 0,
              }}
            >
              <div
                className={`bg-zinc-900/90 backdrop-blur-md border rounded-xl p-5 min-w-[240px] max-w-[280px] transition-all duration-500 ${
                  isActive
                    ? 'border-white scale-110 shadow-2xl shadow-white/30'
                    : isPast
                    ? 'border-white/30 scale-95 opacity-30'
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


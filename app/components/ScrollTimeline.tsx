'use client';

import { useEffect, useState } from 'react';

interface TimelineItem {
  title: string;
  description: string;
  year?: string;
}

const timelineItems: TimelineItem[] = [
  {
    title: 'Started Coding',
    description: 'Began my journey into web development',
    year: '2020',
  },
  {
    title: 'First Project',
    description: 'Built my first full-stack application',
    year: '2021',
  },
  {
    title: 'Professional Experience',
    description: 'Joined a tech company as a developer',
    year: '2022',
  },
  {
    title: 'Current Role',
    description: 'Working on exciting projects and learning new technologies',
    year: '2024',
  },
];

export default function ScrollTimeline() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [heroScrolledPast, setHeroScrolledPast] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(70);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
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
        const scrollableHeight = documentHeight - windowHeight;
        const adjustedScroll = Math.max(0, scrollTop - heroHeight);
        const maxTimelineScroll = scrollableHeight * 0.7;
        const progress = Math.min(1, adjustedScroll / maxTimelineScroll);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeIndex = heroScrolledPast
    ? Math.min(Math.floor(scrollProgress * timelineItems.length), timelineItems.length - 1)
    : -1;

  return (
    <div
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
    >
      <div className="relative w-full h-full min-h-[600px]">
        {heroScrolledPast && (
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
            <div
              className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-white/60 via-white to-white/60 transition-all duration-300"
              style={{
                top: `${cursorPosition}%`,
                height: `${scrollProgress * (100 - cursorPosition)}%`,
                opacity: isCursorVisible ? 1 : 0,
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/90 to-transparent animate-shimmer" />
            </div>
          </div>
        )}

        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-out"
          style={{
            top: heroScrolledPast
              ? `${cursorPosition + (scrollProgress * (100 - cursorPosition))}%`
              : `${cursorPosition}%`,
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
          const position = 5 + (index / (timelineItems.length - 1)) * 90;
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          const isLeft = index % 2 === 0;

          const currentCursorPos = heroScrolledPast
            ? cursorPosition + (scrollProgress * (100 - cursorPosition))
            : cursorPosition;
          const distanceFromPointer = Math.abs(position - currentCursorPos);

          const shouldShow = heroScrolledPast && (isPast || distanceFromPointer < 10);

          return (
            <div
              key={index}
              className="absolute left-1/2 transition-all duration-700 ease-out"
              style={{
                top: `${position}%`,
                transform: `translateX(${
                  shouldShow
                    ? isLeft
                      ? '-280px'
                      : '280px'
                    : isLeft
                    ? '-400px'
                    : '400px'
                }) translateY(-50%)`,
                opacity: shouldShow ? 1 : 0,
              }}
            >
              <div
                className={`bg-zinc-900/90 backdrop-blur-md border rounded-xl p-5 min-w-[240px] max-w-[280px] transition-all duration-500 ${
                  isActive
                    ? 'border-white scale-110 shadow-2xl shadow-white/30'
                    : isPast
                    ? 'border-white/60 scale-100 shadow-lg'
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


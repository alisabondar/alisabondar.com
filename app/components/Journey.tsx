'use client';

import { useIsMobile, PHASE_TIMING } from '../utils/responsive';
import { useTilt } from '../utils/useTilt';
import { Polaroid } from './Polaroid';
import styles from './Journey.module.css';
import {
  EVENT_HEIGHT_VH,
  INTRO_EVENTS,
  STRIP_TOP_OFFSET_VH,
  STRIP_END_PADDING_VH,
  FOCUS_MULTIPLIER,
  EVENT_PLACEMENTS,
  JOURNEY_SHOW_START,
  JOURNEY_HIDE_START,
  JOURNEY_HIDE_DURATION,
  ENTRANCE_DURATION,
  HEADER_FROZEN_DURATION,
  HEADER_FROZEN_DURATION_MOBILE,
} from '../constants';

export interface TimelineItem {
  title: string;
  year?: string;
  picture?: string;
}

export interface JourneyProps {
  scrollProgress: number;
}

function getPlacement(index: number): { left: number; rotate: number } {
  return EVENT_PLACEMENTS[index % EVENT_PLACEMENTS.length] ?? EVENT_PLACEMENTS[0];
}

const timelineItems: TimelineItem[] = [
  {
    title: 'Graduated Virginia Tech with a double major!',
    year: 'May 2020',
  },
  {
    title: 'First day working at the CVOR',
    year: 'May 2020',
    picture: 'CVOR-event.png',
  },
  {
    title: 'First ski trip out west! 🎿',
    year: 'December 2020',
    picture: 'colorado-event.png',
  },
  {
    title: 'First time scrubbing in to assist',
    year: 'March 2021',
    picture: 'scrub-event.png',
  },
  {
    title: 'First 8hr+ road trip to Stowe, VT',
    year: 'December 2021',
  },
  {
    title: 'Ditching the contacts post LASIK surgery 🤯',
    year: 'June 2022',
  },
  {
    title: 'Visited Acadia National Park 🌿',
    year: 'July 2022',
    picture: 'maine-event.png',
  },
  {
    title: 'Bye bye CVOR, hello eICU',
    year: 'August 2022',
  },
  {
    title: 'Started to study javascript and python',
    year: 'March 2023',
  },
  {
    title: 'First road bike',
    year: 'April 2023',
    picture: 'bike-event.png',
  },
  {
    title: 'Enrolled into Hack Reactor 💻',
    year: 'June 2023',
    picture: 'hackreactor-event.png',
  },
  {
    title: 'Graduated Hack Reactor 📓',
    year: 'August 2023',
    picture: 'graduation-event.png',
  },
  {
    title: 'First lease signed! 🌃',
    year: 'December 2023',
    picture: 'nyc-event.png',
  },
  {
    title: 'First software engineering gig!',
    year: 'January 2024',
    picture: 'alphasights-event.png',
  },
  {
    title: 'First marathon! ',
    year: 'March 2025',
    picture: 'marathon-event.png',
  },
  {
    title: 'First time renting a convertible',
    year: 'May 2025',
    picture: 'driving-event.png',
  },
  {
    title: 'First time playing pickleball',
    year: 'June 2025',
  },
  {
    title: 'First solo headstand in yoga',
    year: 'August 2025',
  },
  {
    title: 'Visited Boston',
    year: 'September 2025',
    picture: 'boston.png',
  },
  {
    title: 'Spent most of the holiday season baking!',
    picture: 'pie.png',
    year: 'December 2025',
  },
  {
    title: 'First time ice skating on a lake!',
    picture: 'skating.png',
    year: 'February 2026',
  }
];

const StickyNote = ({ item, index, styles: s }: { item: TimelineItem; index: number; styles: Record<string, string> }) => {
  const { ref: tiltRef, style: tiltStyle } = useTilt(true);
  return (
    <div ref={tiltRef} className={s.eventCardWrapper} style={tiltStyle}>
      <div className={s.tapedCard}>
        <div className={s.tape} aria-hidden />
        <div className={`${s.stickyContainer} transition-all duration-500`}>
          <div className={s.stickyOuter}>
            <div className={s.sticky}>
              <div className={`${s.stickyContent} ${
                [s.paleLavender, s.paleBlue, s.paleGray, s.palePink][index % 4]
              }`}>
                <h3 className={s.stickyTitle}>{item.title}</h3>
                {item.year ? <div className={s.stickyYear}>{item.year}</div> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Journey = ({ scrollProgress }: JourneyProps) => {
  const isMobile = useIsMobile();
  const heroScrolledPast = scrollProgress >= JOURNEY_SHOW_START;

  const journeyLocalProgress = heroScrolledPast
    ? Math.min(1.2, ((scrollProgress - JOURNEY_SHOW_START) / (1.0 - JOURNEY_SHOW_START)) * 1.2)
    : 0;

  const totalEvents = timelineItems.length;
  const phaseTiming = isMobile ? PHASE_TIMING.MOBILE : PHASE_TIMING.DESKTOP;

  const enterProgress = Math.max(0, Math.min(1, (scrollProgress - JOURNEY_SHOW_START) / ENTRANCE_DURATION));
  const entranceTranslateY = (1 - enterProgress) * 80;
  const effectiveEnterProgress = isMobile ? (heroScrolledPast ? 1 : 0) : enterProgress;
  const effectiveEntranceTranslateY = isMobile ? (heroScrolledPast ? 0 : 80) : entranceTranslateY;

  const headerFrozenDuration = isMobile ? HEADER_FROZEN_DURATION_MOBILE : HEADER_FROZEN_DURATION;
  const parallaxStart = ENTRANCE_DURATION + headerFrozenDuration;
  const isIntroPhase = journeyLocalProgress < parallaxStart;
  const parallaxProgress = isIntroPhase ? 0 : Math.min(1, (journeyLocalProgress - parallaxStart) / (1 - parallaxStart));
  const parallaxEventCount = totalEvents - INTRO_EVENTS;
  const frozenPhaseProgress = isIntroPhase && journeyLocalProgress >= ENTRANCE_DURATION
    ? (journeyLocalProgress - ENTRANCE_DURATION) / headerFrozenDuration
    : 0;

  const rawFocus = isIntroPhase
    ? effectiveEnterProgress < 1
      ? 0
      : frozenPhaseProgress * 4
    : INTRO_EVENTS + parallaxProgress * parallaxEventCount * FOCUS_MULTIPLIER;

  const headerFadeInStart = 0;
  const headerFadeInDuration = isMobile ? 0.18 : 0.06;
  const headerFadeInOpacity = journeyLocalProgress >= headerFadeInStart
    ? Math.min(1, (journeyLocalProgress - headerFadeInStart) / headerFadeInDuration)
    : 0;
  const headerFadeOutOpacity = Math.max(0, 1 - parallaxProgress * 2);
  const headerOpacity = isIntroPhase ? headerFadeInOpacity : headerFadeOutOpacity;

  const stripHeight = STRIP_TOP_OFFSET_VH + totalEvents * EVENT_HEIGHT_VH + STRIP_END_PADDING_VH;
  const atLastEvent = !isIntroPhase && rawFocus >= totalEvents - 0.5;
  const displayRawFocus = atLastEvent ? totalEvents - 1 : rawFocus;
  const displayFocusIndex = heroScrolledPast
    ? Math.min(totalEvents - 1, Math.max(0, Math.floor(displayRawFocus)))
    : 0;

  const baseStripY = Math.max(
    -(stripHeight - 100),
    Math.min(0, -(STRIP_TOP_OFFSET_VH + displayRawFocus * EVENT_HEIGHT_VH - 50))
  );
  const stripTranslateY = baseStripY;

  const headerTranslateY = baseStripY * 8;

  const journeyHideStart = JOURNEY_HIDE_START;
  const journeyHideDuration = JOURNEY_HIDE_DURATION;
  const journeyHideProgress = Math.min(
    1,
    Math.max(0, (scrollProgress - journeyHideStart) / journeyHideDuration)
  );
  const viewportOpacity = 1 - journeyHideProgress;

  const scrollUpProgress = Math.min(1, Math.max(0, (scrollProgress - 0.9) / 0.15));
  const translateY = scrollUpProgress * -100;

  return (
    <div
      className={`fixed left-4 right-4 sm:right-20 md:right-24 sm:left-1/2 sm:-translate-x-1/2 h-screen z-40 pointer-events-none transition-opacity duration-500 ease-out ${styles.journeyViewport}`}
      style={{
        opacity: viewportOpacity,
        visibility: viewportOpacity <= 0 ? 'hidden' : 'visible',
      }}
    >
      {heroScrolledPast && (
        <div
          className="w-full h-full"
          style={{ transform: `translateY(${translateY}vh)` }}
        >
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{
            transform: `translateY(${effectiveEntranceTranslateY}vh)`,
            opacity: Math.min(1, effectiveEnterProgress * 2),
            transition: isMobile ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          <h2
            className={`${styles.journeyHeader} ${isMobile ? styles.journeyHeaderMobile : styles.journeyHeaderDesktop} text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-black dark:text-zinc-200`}
            style={{
              transform: `translateX(-50%) translateY(${headerTranslateY}px)`,
              opacity: headerOpacity,
            }}
          >
            Journey
          </h2>
          <div className={styles.eventsZone}>
        <div
          className={styles.eventsScroll}
          style={{
            height: `${stripHeight}vh`,
            transform: `translateY(${stripTranslateY}vh)`,
          }}
        >
        {heroScrolledPast &&
          timelineItems.map((item, index) => {
            const placement = getPlacement(index);
            const leftPercent = isMobile ? 50 : placement.left;

            const eventProgress = rawFocus - index;
            const phaseInStart = 0;
            const introPhaseInEnd = 'INTRO_PHASE_IN_END' in phaseTiming ? phaseTiming.INTRO_PHASE_IN_END : 0.25;
            const phaseInEnd = (isIntroPhase && index < INTRO_EVENTS)
              ? introPhaseInEnd
              : phaseTiming.PHASE_IN_DURATION;

            const hasPhasedIn = eventProgress >= phaseInEnd;
            const isPhasingIn = eventProgress >= phaseInStart && eventProgress < phaseInEnd;
            const shouldShow = (isIntroPhase && index >= INTRO_EVENTS)
              ? false
              : (hasPhasedIn || isPhasingIn);

            let opacity = 0;
            if (isPhasingIn) {
              opacity = (eventProgress - phaseInStart) / (phaseInEnd - phaseInStart);
            } else if (hasPhasedIn) {
              const distanceFromFocus = index - displayFocusIndex;
              opacity = Math.abs(distanceFromFocus) < 0.5 ? 1 : Math.max(0.2, 0.6 - Math.abs(distanceFromFocus) * 0.15);
            }

            const isFocused = Math.abs(index - displayFocusIndex) < 0.5;
            const scale = isFocused ? 1.1 : 0.95;
            const zIndexValue = 100 + index;

            const topValue = STRIP_TOP_OFFSET_VH + index * EVENT_HEIGHT_VH;

            return (
              <div
                key={`journey-${index}`}
                className={`absolute pointer-events-auto ${styles.eventCardOuter} ${isMobile ? styles.eventCardMobile : styles.eventCardDesktop}`}
                style={{
                  top: `${topValue}vh`,
                  left: `${leftPercent}%`,
                  zIndex: zIndexValue,
                  transform: `translate(-50%, -50%) rotate(${placement.rotate}deg) scale(${scale})`,
                  opacity: shouldShow ? opacity : 0,
                }}
              >
                    {item.picture ? (
                      <Polaroid
                        variant="portrait"
                        title={item.title}
                        image={`/${item.picture}`}
                        year={item.year}
                        enableMouseTilt
                      />
                    ) : (
                      <StickyNote item={item} index={index} styles={styles} />
                    )}
                  </div>
                );
          })}
        </div>
      </div>
        </div>
        </div>
      )}
    </div>
  );
};

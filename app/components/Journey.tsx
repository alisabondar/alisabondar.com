'use client';

import { memo, type CSSProperties } from 'react';
import { useIsMobile, PHASE_TIMING } from '../utils/responsive';
import { useTilt } from '../utils/useTilt';
import { Polaroid } from './Polaroid';
import styles from './Journey.module.css';
import { timelineItems, type TimelineItem } from '../data/timeline';
import { getJourneyExitProgress } from '../utils/scrollTimeline';
import {
  EVENT_HEIGHT_VH,
  INTRO_EVENTS,
  STRIP_TOP_OFFSET_VH,
  MOBILE_FIRST_CARD_CENTER_PX,
  MOBILE_HERO_FADE_SHARE,
  JOURNEY_EXIT_FADE,
  STRIP_END_PADDING_VH,
  FOCUS_MULTIPLIER,
  EVENT_PLACEMENTS,
  JOURNEY_SHOW_START,
  ENTRANCE_DURATION,
  HEADER_FROZEN_DURATION,
  HEADER_FROZEN_DURATION_MOBILE,
} from '../constants';


export interface JourneyProps {
  scrollProgress: number;
  isPastJourney?: boolean;
}

function getPlacement(index: number): { left: number; rotate: number } {
  return EVENT_PLACEMENTS[index % EVENT_PLACEMENTS.length] ?? EVENT_PLACEMENTS[0];
}


/** Life events rotate through these; career milestones are always pink, the closest to the coral career key. */
const LIFE_NOTE_COLORS = [styles.noteLavender, styles.noteBlue, styles.noteGray];

const StickyNote = memo(function StickyNote({ item, index }: { item: TimelineItem; index: number }) {
  const { ref: tiltRef, style: tiltStyle } = useTilt(true);
  return (
    <div ref={tiltRef} className={styles.eventCardWrapper} style={tiltStyle}>
      <div className={styles.tapedCard}>
        <div className={`${styles.stickyContainer} transition-all duration-500`}>
          <div className={styles.stickyOuter}>
            <div className={styles.sticky}>
              <div
                className={`${styles.stickyContent} ${
                  item.career ? styles.noteCareer : LIFE_NOTE_COLORS[index % LIFE_NOTE_COLORS.length]
                }`}
              >
                <h3 className={styles.stickyTitle}>{item.title}</h3>
                {item.year ? <div className={styles.stickyYear}>{item.year}</div> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

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
  // Mobile crossfades with the hero like desktop, without the slide up (it fights the phone's own scrolling).
  const effectiveEnterProgress = enterProgress;
  const effectiveEntranceTranslateY = isMobile ? 0 : entranceTranslateY;

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

  // The header is fixed in px, so on phones the first card is placed in px too (converted to vh), keeping the
  // same gap under the header on short and tall screens alike.
  const stripTopOffsetVh = isMobile
    ? (MOBILE_FIRST_CARD_CENTER_PX / window.innerHeight) * 100
    : STRIP_TOP_OFFSET_VH;

  const stripHeight = stripTopOffsetVh + totalEvents * EVENT_HEIGHT_VH + STRIP_END_PADDING_VH;
  // The strip keeps moving past the last card (no clamp), so it flows straight into the Journey's exit scroll.
  const displayRawFocus = rawFocus;
  const displayFocusIndex = heroScrolledPast
    ? Math.min(totalEvents - 1, Math.max(0, Math.floor(displayRawFocus)))
    : 0;

  const baseStripY = Math.max(
    -(stripHeight - 100),
    Math.min(0, -(stripTopOffsetVh + displayRawFocus * EVENT_HEIGHT_VH - 50))
  );
  const stripTranslateY = baseStripY;

  // The last card fades out before Projects fades in (see Projects.tsx).
  const exitOpacity = 1 - Math.min(1, getJourneyExitProgress(scrollProgress) / JOURNEY_EXIT_FADE.CARDS_OUT_END);

  const headerTranslateY = baseStripY * 8;

  return (
    // Pinned with position: sticky inside Home's pinned track; see .pinned in Journey.module.css.
    <div className={`${styles.journeyViewport} ${styles.pinned}`}>
      {heroScrolledPast && (
        <div className="w-full h-full">
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{
            transform: `translateY(${effectiveEntranceTranslateY}vh)`,
            opacity:
              (isMobile
                ? Math.max(0, (effectiveEnterProgress - MOBILE_HERO_FADE_SHARE) / (1 - MOBILE_HERO_FADE_SHARE))
                : Math.min(1, effectiveEnterProgress * 2)) * exitOpacity,
            transition: isMobile ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          <div
            className={`${styles.journeyHeader} ${isMobile ? styles.journeyHeaderMobile : styles.journeyHeaderDesktop}`}
            style={{
              transform: `translateX(-50%) translateY(${headerTranslateY}px)`,
              opacity: headerOpacity,
            }}
          >
            <h2 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-black">Journey</h2>
          </div>
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

            // Cards are solid objects, so background icons never show through them. Once a card has appeared it
            // stays fully opaque, and its faded look (dimmed out of focus) comes from a paper-colored veil laid
            // over it (--card-veil; see Polaroid.module.css and .stickyContent). While fading in, it turns opaque
            // within the first 40% of the fade and the veil carries the rest.
            const presence = shouldShow ? opacity : 0;
            const solidity = !shouldShow ? 0 : hasPhasedIn ? 1 : Math.min(1, presence * 2.5);

            const isFocused = Math.abs(index - displayFocusIndex) < 0.5;
            const scale = isFocused ? 1.1 : 0.95;
            // Stack in timeline order: the newest card to arrive is always on top, even while it's still
            // scrolling in and an earlier card holds focus. Hover still lifts any card to the top
            // (.eventCardOuter:hover).
            const zIndexValue = 1000 + index;

            const topValue = stripTopOffsetVh + index * EVENT_HEIGHT_VH;

            return (
              <div
                key={`journey-${index}`}
                className={`absolute pointer-events-auto ${styles.eventCardOuter} ${isMobile ? styles.eventCardMobile : styles.eventCardDesktop}`}
                style={{
                  top: `${topValue}vh`,
                  left: `${leftPercent}%`,
                  zIndex: zIndexValue,
                  transform: `translate(-50%, -50%) rotate(${placement.rotate}deg) scale(${scale})`,
                  opacity: solidity,
                  '--card-veil': (1 - presence).toFixed(3),
                } as CSSProperties}
              >
                    {item.picture ? (
                      <Polaroid
                        variant="portrait"
                        title={item.title}
                        image={`/${item.picture}`}
                        year={item.year}
                        tape={item.career ? 'career' : 'clear'}
                        enableMouseTilt
                      />
                    ) : (
                      <StickyNote item={item} index={index} />
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

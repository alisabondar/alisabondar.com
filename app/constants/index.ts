/** Re-export icon config */
export { icons } from './icons';

import type { Section } from '../types';

/** Page / scroll (hero crossfade) */
export const JOURNEY_SHOW_START = 0.08;
export const CROSSFADE_END = 0.22;

/** Journey section */
export const EVENT_HEIGHT_VH = 20;
export const INTRO_EVENTS = 4;
export const STRIP_TOP_OFFSET_VH = 30;
export const STRIP_END_PADDING_VH = 80;
export const FOCUS_MULTIPLIER = 1.0;

export const EVENT_PLACEMENTS: { left: number; rotate: number }[] = [
  { left: 32, rotate: -3 },
  { left: 72, rotate: 2 },
  { left: 40, rotate: -4 },
  { left: 65, rotate: 1 },
  { left: 50, rotate: -2 },
  { left: 35, rotate: 3 },
  { left: 68, rotate: 0 },
  { left: 42, rotate: -1 },
  { left: 75, rotate: 4 },
  { left: 28, rotate: -5 },
  { left: 58, rotate: 2 },
  { left: 38, rotate: -3 },
  { left: 72, rotate: 1 },
  { left: 45, rotate: -2 },
  { left: 30, rotate: 0 },
  { left: 55, rotate: 3 },
  { left: 78, rotate: -1 },
  { left: 40, rotate: 2 },
  { left: 48, rotate: -2 },
  { left: 70, rotate: 3 },
];

export const JOURNEY_HIDE_START = 0.94;
export const JOURNEY_HIDE_DURATION = 0.05;

export const JOURNEY_SCROLL_UP_START_MOBILE = 0.82;
export const JOURNEY_FADE_START_MOBILE = 0.88;
export const JOURNEY_FADE_DURATION_MOBILE = 0.18;
export const PROJECTS_FADE_IN_START_MOBILE = 0.82;
export const IMPACT_FADE_IN_START_MOBILE = 1.05;

export const ENTRANCE_DURATION = CROSSFADE_END - JOURNEY_SHOW_START;
export const HEADER_FROZEN_DURATION = 0.35;
export const HEADER_FROZEN_DURATION_MOBILE = 0.48;

/** Table of contents / scroll */
export const HEADER_OFFSET_PX = 50;
export const SECTION_TOP_PADDING_PX = 80;
export const SMOOTH_SCROLL_DURATION_MS = 1000;

/** GitHub activity graph */
export const STATIC_MONTH_WEEK_INDEX = [0, 4, 8, 13, 17, 22, 26, 30, 35, 39, 43, 48];
export const FIXED_WEEKS = 53;
export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** Tilt effect (Polaroid / cards) */
export const MOUSE_TILT_MULTIPLE = 40;
export const MAX_TILT_DEG = 5;

/** Breakpoints & timeline (used by responsive utils) */
export const BREAKPOINTS = {
  MOBILE: 640,
} as const;

export const TIMELINE_CONSTANTS = {
  MOBILE_MULTIPLIER: 1.9,
  DESKTOP_MULTIPLIER: 1.75,
} as const;

export const SCROLL_DESENSITIZE = {
  MOBILE: 2.2,
  DESKTOP: 1.5,
} as const;

export const MOBILE_SCROLL_SLOWDOWN = 1.43;

export const PHASE_TIMING = {
  MOBILE: {
    PHASE_IN_DURATION: 0.32,
    PHASE_IN_START_MULTIPLIER: 0.15,
    PHASE_OUT_START: 0.75,
    INTRO_PHASE_IN_END: 0.35,
  },
  DESKTOP: {
    PHASE_IN_DURATION: 0.15,
    PHASE_IN_START_MULTIPLIER: 0.2,
    PHASE_OUT_START: 0.8,
    INTRO_PHASE_IN_END: 0.25,
  },
  PHASE_OUT_END: 1.0,
} as const;

/** Nav sections (Table of contents) */
export const SECTIONS: Section[] = [
  { id: 'about', label: 'Intro' },
  { id: 'journey', label: 'Journey' },
  { id: 'projects', label: 'Projects' },
  { id: 'impact', label: 'Impact' },
  { id: 'contact', label: 'Contact Me' },
];

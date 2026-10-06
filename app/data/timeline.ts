/** Journey timeline. The first INTRO_EVENTS items appear during the header intro; the rest scroll by in the parallax strip. */
export interface TimelineItem {
  title: string;
  year?: string;
  picture?: string;
}

export const timelineItems: TimelineItem[] = [
  {
    title: 'Graduated Virginia Tech with a double major!',
    year: 'May 2020',
  },
  {
    title: 'First job: support tech in cardiac surgery!',
    year: 'May 2020',
    picture: 'CVOR-event.webp',
  },
  {
    title: 'Skied out west! 🎿',
    year: 'December 2020',
    picture: 'colorado-event.webp',
  },
  {
    title: 'Scrubbed in on my first open-heart surgery',
    year: 'March 2021',
    picture: 'scrub-event.webp',
  },
  {
    title: 'Ditched my contacts after LASIK 🤯',
    year: 'June 2022',
  },
  {
    title: 'Visited Acadia National Park 🌿',
    year: 'July 2022',
    picture: 'maine-event.webp',
  },
  {
    title: 'Bye bye OR, hello ICU',
    year: 'August 2022',
  },
  {
    title: 'Started learning JavaScript and Python',
    year: 'March 2023',
  },
  {
    title: 'Got into road cycling',
    year: 'April 2023',
    picture: 'bike-event.webp',
  },
  {
    title: 'Enrolled in Hack Reactor 💻',
    year: 'June 2023',
    picture: 'hackreactor-event.webp',
  },
  {
    title: 'Graduated Hack Reactor as class speaker 🎤',
    year: 'August 2023',
    picture: 'graduation-event.webp',
  },
  {
    title: 'Signed my first lease! 🌃',
    year: 'December 2023',
    picture: 'nyc-event.webp',
  },
  {
    title: 'Landed my first engineering role at AlphaSights!',
    year: 'January 2024',
    picture: 'alphasights-event.webp',
  },
  {
    title: 'Ran my first marathon!',
    year: 'March 2025',
    picture: 'marathon-event.webp',
  },
  {
    title: 'Mastered the solo headstand in yoga',
    year: 'August 2025',
  },
  {
    title: 'Visited Boston 🦞',
    year: 'September 2025',
    picture: 'boston.webp',
  },
  {
    title: 'Spent most of the holiday season baking!',
    picture: 'pie.webp',
    year: 'December 2025',
  },
  {
    title: 'Ice skated on a lake!',
    picture: 'skating.webp',
    year: 'February 2026',
  },
  {
    title: 'Joined the fiancée club!',
    picture: 'engagement.webp',
    year: 'March 2026',
  },
  {
    title: 'Moved out west to Colorado!',
    picture: 'west.webp',
    year: 'May 2026',
  }
];

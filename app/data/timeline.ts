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
    title: 'First job!',
    year: 'May 2020',
    picture: 'CVOR-event.webp',
  },
  {
    title: 'Skiied out west! 🎿',
    year: 'December 2020',
    picture: 'colorado-event.webp',
  },
  {
    title: 'Scrubbed in to assist open heart surgery',
    year: 'March 2021',
    picture: 'scrub-event.webp',
  },
  {
    title: 'Ditching the contacts post LASIK surgery 🤯',
    year: 'June 2022',
  },
  {
    title: 'Visited Acadia National Park 🌿',
    year: 'July 2022',
    picture: 'maine-event.webp',
  },
  {
    title: 'Bye bye CVOR, hello eICU',
    year: 'August 2022',
  },
  {
    title: 'Began studying javascript and python',
    year: 'March 2023',
  },
  {
    title: 'Got into road cycling',
    year: 'April 2023',
    picture: 'bike-event.webp',
  },
  {
    title: 'Enrolled into Hack Reactor 💻',
    year: 'June 2023',
    picture: 'hackreactor-event.webp',
  },
  {
    title: 'Graduated Hack Reactor 📓',
    year: 'August 2023',
    picture: 'graduation-event.webp',
  },
  {
    title: 'First lease signed! 🌃',
    year: 'December 2023',
    picture: 'nyc-event.webp',
  },
  {
    title: 'First software engineering gig!',
    year: 'January 2024',
    picture: 'alphasights-event.webp',
  },
  {
    title: 'Ran a marathon! ',
    year: 'March 2025',
    picture: 'marathon-event.webp',
  },
  {
    title: 'Mastered the solo headstand in yoga',
    year: 'August 2025',
  },
  {
    title: 'Visited Boston',
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

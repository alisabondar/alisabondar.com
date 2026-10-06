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
    title: 'First day working at the CVOR',
    year: 'May 2020',
    picture: 'CVOR-event.webp',
  },
  {
    title: 'First ski trip out west! 🎿',
    year: 'December 2020',
    picture: 'colorado-event.webp',
  },
  {
    title: 'First time scrubbing in to assist',
    year: 'March 2021',
    picture: 'scrub-event.webp',
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
    picture: 'maine-event.webp',
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
    title: 'First marathon! ',
    year: 'March 2025',
    picture: 'marathon-event.webp',
  },
  {
    title: 'First time renting a convertible',
    year: 'May 2025',
    picture: 'driving-event.webp',
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
    picture: 'boston.webp',
  },
  {
    title: 'Spent most of the holiday season baking!',
    picture: 'pie.webp',
    year: 'December 2025',
  },
  {
    title: 'First time ice skating on a lake!',
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

export interface Project {
  title: string;
  url: string;
  screenshot?: string;
  tooltip?: string;
}

export const projects: Project[] = [
  {
    title: 'Florascape',
    url: 'https://florascaper.vercel.app/',
    screenshot: '/florascape.webp',
    tooltip: 'WIP! Click me for the github roadmap',
  },
  {
    title: 'Inkloom',
    url: 'https://inkloom.vercel.app/',
    screenshot: '/inkloom.webp',
  },
  {
    title: 'Lumka',
    url: 'https://lumka-game.vercel.app/',
    screenshot: '/lumka.webp',
  },
];

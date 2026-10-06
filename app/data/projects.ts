export interface ProjectDetails {
  /** One-line pitch: what it does, for whom. */
  pitch: string;
  /** The engineering detail worth noticing. Hidden on the smallest screens. */
  underTheHood?: string;
  stack: string[];
  status?: string;
  codeUrl?: string;
}

export interface Project {
  title: string;
  url: string;
  screenshot?: string;
  /** When present, the card flips over to show these on hover/tap. */
  details?: ProjectDetails;
}

export const projects: Project[] = [
  {
    title: 'Florascape',
    url: 'https://florascaper.vercel.app/',
    screenshot: '/florascape.webp',
    details: {
      pitch: "Turns your yard's size, sunlight, and ZIP code into an illustrated, editable planting plan for beginner gardeners.",
      underTheHood: 'Gemini picks the plants; deterministic code owns every bed’s geometry. Model coordinates are never trusted.',
      stack: ['Next.js', 'Gemini', 'Rough.js'],
      status: 'In progress',
      codeUrl: 'https://github.com/alisabondar/florascape',
    },
  },
  {
    title: 'Inkloom',
    url: 'https://inkloom.vercel.app/',
    screenshot: '/inkloom.webp',
    details: {
      pitch: 'Describe an idea and get a clean reference template to paint or color from. No sketching required.',
      underTheHood: 'Accounts, saved templates, and a public gallery on Supabase, with AI image generation and Vitest coverage.',
      stack: ['Next.js', 'Supabase', 'Flux'],
      status: 'MVP',
      codeUrl: 'https://github.com/alisabondar/inkloom',
    },
  },
  {
    title: 'Lumka',
    url: 'https://lumka-game.vercel.app/',
    screenshot: '/lumka.webp',
  },
];

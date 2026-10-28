export interface ProjectDetails {
  /** One-line pitch: what it does, for whom. */
  pitch: string;
  /** The engineering detail worth noticing. Hidden on the smallest screens. */
  underTheHood?: string;
  stack?: string[];
  status?: string;
  codeUrl?: string;
}

export interface Project {
  title: string;
  /** Live site. Projects without one (not deployed yet) show `art` instead of a live preview. */
  url?: string;
  screenshot?: string;
  /** Illustration for the photo area when there's no site to preview yet. */
  art?: 'construction';
  /** When present, the card flips over to show these on hover/tap. */
  details?: ProjectDetails;
}

export const projects: Project[] = [
  {
    title: 'Florascape',
    url: 'https://florascaper.vercel.app/',
    screenshot: '/florascape.webp',
    details: {
      pitch: "Turns your yard's size, sunlight, and ZIP code into an editable pixel-art garden and a deck of plant cards for beginner gardeners.",
      underTheHood: 'Real frost dates and hardiness zones ground the AI’s picks; deterministic code owns every bed’s geometry, so model coordinates are never trusted.',
      stack: ['Next.js', 'Gemini', 'Zod'],
      status: 'In progress',
      codeUrl: 'https://github.com/alisabondar/florascape',
    },
  },
  {
    title: 'Inkloom',
    url: 'https://inkloom.vercel.app/',
    screenshot: '/inkloom.webp',
    details: {
      pitch: 'Describe an idea or upload a photo and get a ready-to-paint template: line art, a value study, a grid, a palette, and a step-by-step plan.',
      underTheHood: 'After one AI concept, everything is computed in a Web Worker (edge detection, posterization, k-means palettes), so the sliders redraw instantly.',
      stack: ['Next.js', 'Supabase', 'FLUX'],
      status: 'MVP',
      codeUrl: 'https://github.com/alisabondar/inkloom',
    },
  },
  {
    title: 'OpenToWork',
    art: 'construction',
    details: {
      pitch: 'A self-hosted job-search copilot: one deduplicated feed from the job boards you watch, and an agent that fills in applications for you to review.',
      underTheHood: 'A Playwright agent on your own machine fills in Greenhouse, Lever, Ashby, and Workday forms, and nothing is submitted until you approve it.',
      stack: ['FastAPI', 'Postgres', 'Next.js', 'Playwright'],
      status: 'In progress',
    },
  },
];

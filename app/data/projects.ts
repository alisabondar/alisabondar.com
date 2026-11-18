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
    title: 'CipherChart',
    art: 'construction',
    details: {
      pitch: 'A clinician-facing patient dashboard built HIPAA-ready: encrypted, searchable records, role-based access, and an audit trail on every view. All data is synthetic.',
      underTheHood: 'AI summaries are de-identified and leak-checked both ways before anything reaches the model; load-tested at 50 concurrent staff on 30K patients with p95 under 100 ms.',
      stack: ['FastAPI', 'Postgres', 'React', 'Presidio'],
      status: 'Case study',
      codeUrl: 'https://github.com/alisabondar/cipherchart',
    },
  },
  {
    title: 'Florascape',
    url: 'https://florascaper.vercel.app/',
    screenshot: '/florascape.png',
    details: {
      pitch: "Turns your yard's size, sunlight, and ZIP code into an editable pixel-art garden and a deck of plant cards for beginner gardeners.",
      underTheHood: 'Real frost dates and hardiness zones ground the AI’s picks; deterministic code owns every bed’s geometry, so model coordinates are never trusted.',
      stack: ['Next.js', 'Gemini', 'Zod'],
      status: 'Beta',
      codeUrl: 'https://github.com/alisabondar/florascape',
    },
  },
  {
    title: 'Inkloom',
    url: 'https://inkloom.vercel.app/',
    screenshot: '/inkloom.png',
    details: {
      pitch: 'Describe an idea or upload a photo and get a ready-to-paint template: line art, a value study, a grid, a palette, and a step-by-step plan.',
      underTheHood: 'After one AI concept, everything is computed in a Web Worker (edge detection, posterization, k-means palettes), so the sliders redraw instantly.',
      stack: ['Next.js', 'Supabase', 'FLUX'],
      status: 'Beta',
      codeUrl: 'https://github.com/alisabondar/inkloom',
    },
  },
  {
    title: 'Daily Diff',
    screenshot: '/daily-diff-v2.png',
    details: {
      pitch: 'A local-first daily AI & tech briefing: it reads your feeds, groups and ranks the stories with the LLM of your choice, and serves a short front page.',
      underTheHood: 'Runs entirely on your machine with any provider (Anthropic, OpenAI, Google, Bedrock, or a local Ollama), and builds each day’s digest the first time you open it.',
      stack: ['TypeScript', 'Node.js', 'LLMs'],
      status: 'Beta',
      codeUrl: 'https://github.com/alisabondar/daily-diff',
    },
  },
];

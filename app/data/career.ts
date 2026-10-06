export interface ContactLink {
  label: string;
  url: string;
  icon: 'email' | 'linkedin' | 'github' | 'resume';
}

export interface Job {
  company: string;
  role: string;
  period: string;
  achievements: string[];
}

export interface Testimonial {
  quote: string;
  attribution: string;
}

export const contactLinks: ContactLink[] = [
  {
    label: 'Email',
    url: 'mailto:alisa.k.bondar@gmail.com',
    icon: 'email',
  },
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/alisabondar',
    icon: 'linkedin',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/alisabondar',
    icon: 'github',
  },
  {
    label: 'Resume',
    url: '/resume.pdf',
    icon: 'resume',
  },
];

export const jobs: Job[] = [
  {
    company: 'AlphaSights',
    role: 'Software Engineer',
    period: '2024 - 2026',
    achievements: [
      'Designed and built the company\'s first LLM-powered outreach workflow, increasing associate productivity and credit revenue by 2x.',
      'Developed a responsive, accessible customer-facing product used by 30K+ users and generating $200K+ in revenue.',
      'Built a structured data capture workflow that increased usable data volume by 1.8x for downstream products.',
      'Implemented AWS Cognito authentication with magic link, Google, and LinkedIn login, simplifying onboarding and supporting a 30% 60-day return rate.',
      'Migrated a Ruby monolith into domain-aligned Kotlin microservices, contributing to 2x faster deployments.',
      'Authored technical design documents for 10+ shipped initiatives, defining implementation plans and aligning stakeholders.',
      'Resolved production page crashes by optimizing a 150+ field query and separating data retrieval across targeted endpoints.',
      'Led API and analytics design across 8 repositories, standardizing contracts and product instrumentation across frontend and backend systems.',
    ],
  },
  {
    company: 'Inova Health System',
    role: 'Data Assistant',
    period: '2022 - 2023',
    achievements: [
      'Organized 50+ patient transfer requests per shift for intensivists and nurses, supporting informed decisions during overnight shifts.',
      'Created daily critical care capacity reports across 200+ beds for senior leadership to support hospital staffing and capacity decisions.',
      'Identified and monitored key patient health indicators for 200+ patients in Epic EMR to support timely care team coordination.',
    ],
  },
  {
    company: 'Virginia Hospital Center',
    role: 'Support Technician',
    period: '2020 - 2023',
    achievements: [
      'Assisted in 75 open heart surgeries as a second scrub, constantly communicating and adapting to changing needs in a high-stakes environment.',
      'Coordinated with 20+ vendors and neighboring hospitals during COVID-19 to source backordered surgical supplies and maintain critical inventory.',
      'Presented supporting documentation for 10+ new surgical tools/equipment purchases to leadership, contributing to adoption of new equipment for patient care.',
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    quote: '... always happy, always proactive, always seeking to learn more and more...',
    attribution: 'Fellow SWE',
  },
  {
    quote: '... it was immediately clear how appreciated and valued you are by this team.',
    attribution: 'SWE Manager',
  },
  {
    quote: 'Your engineering growth these past few years speaks to your talent and dedication.',
    attribution: 'Lead Engineer',
  },
  {
    quote: 'You make the team a better place just by being in it.',
    attribution: 'Fellow SWE',
  },
  {
    quote: 'She is one of the pillars of the team.',
    attribution: 'Former Healthcare Manager',
  },
  {
    quote: 'Thank you for accepting the nomination to be our Graduation Class Speaker!',
    attribution: 'HR Class of S23 Coordinator',
  },
];

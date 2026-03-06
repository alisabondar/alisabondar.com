export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export interface Section {
  id: string;
  label: string;
}

export interface ContributionData {
  date: string;
  level: number;
  count: number;
}

export interface YearData {
  year: number;
  contributions: ContributionData[];
  totalContributions: number;
}

export interface ImpactProps {
  scrollProgress: number;
}

export interface ContactLink {
  label: string;
  url: string;
  icon?: string;
}

export interface Job {
  company: string;
  role: string;
  period: string;
  achievements: string[];
}

export interface ProjectsProps {
  scrollProgress: number;
}

export interface Project {
  title: string;
  githubUrl: string;
  screenshot?: string;
  tooltip?: string;
}

export interface TimelineItem {
  title: string;
  year?: string;
  picture?: string;
}

export interface JourneyProps {
  scrollProgress: number;
}

export type PolaroidVariant = 'portrait' | 'landscape' | 'project';

export interface PolaroidProps {
  variant: PolaroidVariant;
  title: string;
  image?: string;
  description?: string;
  year?: string;
  enableMouseTilt?: boolean;
  className?: string;
}

export interface GitHubActivityGraphProps {
  years: YearData[];
}

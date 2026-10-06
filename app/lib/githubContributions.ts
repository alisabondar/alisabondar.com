import 'server-only';
import type { ContributionData, YearData } from '../components/GitHubActivityGraph';
import { contributions2023, totalContributions2023 } from '../data/githubContributions2023';
import { contributions2024, totalContributions2024 } from '../data/githubContributions2024';
import { contributions2025, totalContributions2025 } from '../data/githubContributions2025';
import { contributions2026, totalContributions2026 } from '../data/githubContributions2026';

const GITHUB_LOGIN = 'alisabondar';
const FIRST_YEAR = 2023;
const REVALIDATE_SECONDS = 60 * 60 * 24;

let warnedAboutFallback = false;

/** Snapshot used when no GITHUB_TOKEN is configured or the API call fails. */
const STATIC_YEARS: YearData[] = [
  { year: 2026, contributions: contributions2026, totalContributions: totalContributions2026 },
  { year: 2025, contributions: contributions2025, totalContributions: totalContributions2025 },
  { year: 2024, contributions: contributions2024, totalContributions: totalContributions2024 },
  { year: 2023, contributions: contributions2023, totalContributions: totalContributions2023 },
];

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

interface CalendarResponse {
  data?: {
    user: Record<
      string,
      {
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
        };
      }
    > | null;
  };
  errors?: { message: string }[];
}

function buildQuery(years: number[]) {
  // contributionsCollection spans at most one year, so alias one per calendar year.
  const fields = years
    .map(
      (year) => `y${year}: contributionsCollection(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z") {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }`
    )
    .join('\n');
  return `query($login: String!) { user(login: $login) { ${fields} } }`;
}

export async function getContributionYears(): Promise<YearData[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return STATIC_YEARS;

  const currentYear = new Date().getUTCFullYear();
  const years = Array.from({ length: currentYear - FIRST_YEAR + 1 }, (_, i) => currentYear - i);

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: buildQuery(years), variables: { login: GITHUB_LOGIN } }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);

    const json = (await res.json()) as CalendarResponse;
    const user = json.data?.user;
    if (!user || json.errors?.length) throw new Error(json.errors?.[0]?.message ?? 'No user data');

    return years.map((year) => {
      const calendar = user[`y${year}`].contributionCalendar;
      // Only keep active days; the graph fills gaps with level 0, matching the static snapshot format.
      const contributions: ContributionData[] = calendar.weeks
        .flatMap((week) => week.contributionDays)
        .filter((day) => day.contributionCount > 0)
        .map((day) => ({ date: day.date, count: day.contributionCount, level: LEVELS[day.contributionLevel] ?? 0 }));
      return { year, contributions, totalContributions: calendar.totalContributions };
    });
  } catch (error) {
    if (!warnedAboutFallback) {
      warnedAboutFallback = true;
      console.warn(`Using static GitHub contributions snapshot (${error instanceof Error ? error.message : error}).`);
    }
    return STATIC_YEARS;
  }
}

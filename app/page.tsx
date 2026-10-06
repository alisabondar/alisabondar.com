import { Home } from './components/Home';
import { getContributionYears } from './lib/githubContributions';

// Re-fetch GitHub contributions at most once a day.
export const revalidate = 86400;

export default async function Page() {
  const contributionYears = await getContributionYears();
  return <Home contributionYears={contributionYears} />;
}

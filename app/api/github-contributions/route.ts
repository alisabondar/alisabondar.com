import { NextResponse } from 'next/server';

export async function GET() {
  const username = process.env.GITHUB_USERNAME || 'alisabondar';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('GITHUB_TOKEN is not set in environment variables');
    return NextResponse.json(
      { error: 'GitHub token not configured. Please set GITHUB_TOKEN in .env.local' },
      { status: 500 }
    );
  }

  if (token.length < 20) {
    console.error('GITHUB_TOKEN appears to be invalid (too short)');
    return NextResponse.json(
      { error: 'GitHub token appears to be invalid' },
      { status: 500 }
    );
  }


  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const from = oneYearAgo.toISOString();
  const to = now.toISOString();

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const testUserResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Portfolio-App',
      },
    });

    if (!testUserResponse.ok) {
      const errorText = await testUserResponse.text();
      console.error('User check failed:', testUserResponse.status, errorText);

      if (testUserResponse.status === 401) {
        return NextResponse.json(
          {
            error: 'Invalid GitHub token. The token may be expired or have insufficient permissions.',
            details: 'Please generate a new token at https://github.com/settings/tokens with "read:user" scope.'
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          error: `GitHub user "${username}" not found. Please verify the username is correct.`,
          status: testUserResponse.status
        },
        { status: testUserResponse.status }
      );
    }

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { username, from, to },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error:', errorText);

      if (response.status === 401) {
        return NextResponse.json(
          {
            error: 'Invalid GitHub token. Please check that GITHUB_TOKEN in .env.local is correct and has not expired.',
            details: 'Token should be a valid GitHub Personal Access Token with appropriate permissions.'
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch contributions', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      const errorMessage = data.errors[0]?.message || 'Unknown GraphQL error';

      if (errorMessage.includes('Could not resolve to a User')) {
        return NextResponse.json(
          { error: `User "${username}" not found. Please verify the username is correct. You can set GITHUB_USERNAME in .env.local` },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: errorMessage, details: data.errors },
        { status: 400 }
      );
    }

    if (!data.data?.user) {
      console.error('No user data in response:', data);
      return NextResponse.json(
        { error: 'User data not found in response' },
        { status: 404 }
      );
    }

    const totalContributions = data.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0;
    console.log(`Total contributions fetched: ${totalContributions}`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


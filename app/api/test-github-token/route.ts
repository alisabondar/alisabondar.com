import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN not set in .env.local' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Portfolio-App',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          status: response.status,
          error: data.message || 'Authentication failed',
          details: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      status: response.status,
      user: {
        login: data.login,
        name: data.name,
        public_repos: data.public_repos,
      },
      message: 'Token is valid!'
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


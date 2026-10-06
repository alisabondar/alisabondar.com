import { useId } from 'react';

/**
 * Stand-in "photo" for a project that isn't deployed yet: a yellow work-zone sign on a striped barricade.
 * Drawn at 16:10 to fill the wide-format polaroid.
 */
export function ConstructionSign({ label }: { label: string }) {
  const id = useId();
  const stripes = `${id}-stripes`;
  const backdrop = `${id}-backdrop`;

  return (
    <svg viewBox="0 0 400 250" role="img" aria-label={label} style={{ display: 'block', width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={backdrop} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe8dc" />
          <stop offset="1" stopColor="#d9cfbf" />
        </linearGradient>
        <pattern id={stripes} width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="13" height="26" fill="#f26a21" />
          <rect x="13" width="13" height="26" fill="#fbf7f0" />
        </pattern>
      </defs>

      <rect width="400" height="250" fill={`url(#${backdrop})`} />
      <rect y="206" width="400" height="44" fill="#c9bea9" />

      {/* Drawn at full size, then scaled down around the barricade feet so it stays standing on the ground. */}
      <g transform="translate(200 214) scale(0.62) translate(-200 -214)">
        {/* Sign post, behind the barricade */}
        <rect x="196" y="70" width="8" height="100" fill="#6f6a62" />

        {/* Barricade: legs, then two striped boards */}
        <rect x="92" y="150" width="10" height="70" rx="2" fill="#4a4743" />
        <rect x="298" y="150" width="10" height="70" rx="2" fill="#4a4743" />
        <rect x="68" y="148" width="264" height="30" rx="3" fill={`url(#${stripes})`} stroke="#3a3733" strokeWidth="2" />
        <rect x="84" y="186" width="232" height="14" rx="3" fill={`url(#${stripes})`} stroke="#3a3733" strokeWidth="2" />

        {/* Diamond work-zone sign */}
        <g transform="translate(200 76) rotate(45)">
          <rect x="-52" y="-52" width="104" height="104" rx="9" fill="#f7c600" stroke="#1f1d1a" strokeWidth="4" />
          <rect x="-44" y="-44" width="88" height="88" rx="6" fill="none" stroke="#1f1d1a" strokeWidth="2.5" />
        </g>
        <g fill="#1f1d1a" fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif" fontWeight="900" textAnchor="middle">
          <text x="200" y="73" fontSize="15" letterSpacing="0.5">UNDER</text>
          <text x="200" y="88" fontSize="8.4">CONSTRUCTION</text>
        </g>
      </g>
    </svg>
  );
}

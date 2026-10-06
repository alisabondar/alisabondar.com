import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Alisa Bondar, Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const asset = async (name: string) =>
  `data:image/jpeg;base64,${(await readFile(join(process.cwd(), 'app/assets', name))).toString('base64')}`;

/** Fetches just the glyphs we need from Google Fonts; returns null (default font) if offline. */
async function loadGoogleFont(family: string, weight: number, text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

const NAME = 'Alisa Bondar';
const ROLE = 'Software Engineer';
const DOMAIN = 'alisabondar.com';

export default async function OpengraphImage() {
  const [paper, inkloom, florascape, geist, marker] = await Promise.all([
    asset('og-paper.jpg'),
    asset('og-inkloom.jpg'),
    asset('og-florascape.jpg'),
    loadGoogleFont('Geist', 700, NAME + ROLE + DOMAIN),
    loadGoogleFont('Permanent+Marker', 400, 'FlorascapeInkloom'),
  ]);

  const fonts = [
    ...(geist ? [{ name: 'Geist', data: geist, weight: 700 as const }] : []),
    ...(marker ? [{ name: 'Marker', data: marker, weight: 400 as const }] : []),
  ];

  const polaroid = (src: string, caption: string, style: Record<string, string | number>) => (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        padding: '14px 14px 0',
        boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
        ...style,
      }}
    >
      <img src={src} width={280} height={168} alt="" style={{ objectFit: 'cover' }} />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 14px', fontFamily: 'Marker', fontSize: 22 }}>
        {caption}
      </div>
    </div>
  );

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', fontFamily: 'Geist' }}>
        <img src={paper} width={1200} height={630} alt="" style={{ position: 'absolute', inset: 0 }} />

        {polaroid(florascape, 'Florascape', { right: 300, top: 90, transform: 'rotate(-6deg)' })}
        {polaroid(inkloom, 'Inkloom', { right: 70, top: 250, transform: 'rotate(5deg)' })}

        <div
          style={{
            position: 'absolute',
            left: 64,
            top: 150,
            width: 470,
            display: 'flex',
            flexDirection: 'column',
            padding: '44px 44px 40px',
            background: 'rgba(255, 253, 248, 0.94)',
            boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
            transform: 'rotate(-1.5deg)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -16,
              left: 170,
              width: 130,
              height: 34,
              background: 'rgba(246, 132, 124, 0.55)',
              transform: 'rotate(-3deg)',
            }}
          />
          <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: '-0.05em', color: '#000', lineHeight: 0.95 }}>{NAME}</div>
          <div style={{ marginTop: 22, fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', color: 'rgb(226 104 96)' }}>
            {ROLE}
          </div>
          <div style={{ marginTop: 30, fontSize: 24, color: 'rgba(0,0,0,0.55)', letterSpacing: '-0.01em' }}>{DOMAIN}</div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}

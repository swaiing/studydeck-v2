import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Studydeck - Flashcard Deck'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #4f46e5, #7c3aed)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>
          📚 Studydeck
        </div>
        <div style={{ fontSize: 40, opacity: 0.9 }}>
          Smart Flashcard Study Platform
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

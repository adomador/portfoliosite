import Link from 'next/link'

const VIMEO_VIDEOS = [
  { id: '223854453', title: '.p0rtal x1' },
  { id: '226504773', title: '.p0rtal x2' },
]

export default function ArtPage() {
  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        background: '#000',
        padding: '2rem',
        paddingTop: '4rem',
      }}
    >
      <Link
        href="/?section=work"
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          color: '#a39e93',
          fontSize: '1rem',
          fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        ← Back
      </Link>
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4rem',
        }}
      >
        {VIMEO_VIDEOS.map((video) => (
          <section key={video.id}>
            <h2
              style={{
                color: '#a39e93',
                fontSize: '0.875rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              {video.title}
            </h2>
            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
              }}
            >
              <iframe
                src={`https://player.vimeo.com/video/${video.id}`}
                title={video.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

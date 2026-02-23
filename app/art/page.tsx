import Link from 'next/link'

export default function ArtPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#000',
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
    </main>
  )
}

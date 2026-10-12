import type { Metadata, Viewport } from 'next'
import { NAME, ROLE } from '@/lib/profile'
import { SoftDissolveProvider } from '@/components/mosaic/SoftDissolve'
import { REVIEW_PREFIX } from '@/lib/reviewHref'
import '../globals.css'

export const metadata: Metadata = {
  title: `${NAME} — ${ROLE}`,
  description:
    'Senior product designer and builder working in freight tech. Selected work and how to get in touch.',
  robots: { index: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f2e9d9',
}

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://inflight.co/widget.js"
          data-org="aius9qpt"
          data-path={REVIEW_PREFIX}
          async
        />
      </head>
      <body>
        <SoftDissolveProvider>{children}</SoftDissolveProvider>
      </body>
    </html>
  )
}

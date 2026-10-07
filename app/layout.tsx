import type { Metadata, Viewport } from 'next'
import { NAME, ROLE } from '@/lib/profile'
import { PixelBurstProvider } from '@/components/mosaic/PixelBurst'
import './globals.css'

export const metadata: Metadata = {
  title: `${NAME} — ${ROLE}`,
  description:
    'Senior product designer and builder working in freight tech. Selected work and how to get in touch.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f2e9d9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PixelBurstProvider>{children}</PixelBurstProvider>
      </body>
    </html>
  )
}

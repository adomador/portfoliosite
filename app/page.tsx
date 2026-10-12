import type { Viewport } from 'next'
import MosaicHome from '@/components/mosaic/MosaicHome'

export const viewport: Viewport = {
  themeColor: '#14100e',
}

export default function Page() {
  return <MosaicHome />
}

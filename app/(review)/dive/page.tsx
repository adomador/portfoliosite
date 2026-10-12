import type { Viewport } from 'next'
import MosaicHome from '@/components/mosaic/MosaicHome'
import { REVIEW_PREFIX } from '@/lib/reviewHref'

export const viewport: Viewport = {
  themeColor: '#14100e',
}

export default function Page() {
  return <MosaicHome pathPrefix={REVIEW_PREFIX} />
}

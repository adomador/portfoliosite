import { ArtPage } from '@/app/(site)/art/ArtPage'
import { REVIEW_PREFIX } from '@/lib/reviewHref'

export default function Page() {
  return <ArtPage pathPrefix={REVIEW_PREFIX} />
}

import { TrochiCaseStudyPage } from '@/app/(site)/work/trochi/TrochiCaseStudy'
import { REVIEW_PREFIX } from '@/lib/reviewHref'

export default function Page() {
  return <TrochiCaseStudyPage pathPrefix={REVIEW_PREFIX} />
}

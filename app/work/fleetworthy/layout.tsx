import type { Metadata } from 'next'
import { NAME } from '@/lib/profile'

export const metadata: Metadata = {
  title: `Fleetworthy, ${NAME}`,
  description:
    'Fleetworthy: unifying a suite of powerful, but siloed, software products for fleets that want to win more business.',
}

export default function FleetworthyLayout({ children }: { children: React.ReactNode }) {
  return children
}

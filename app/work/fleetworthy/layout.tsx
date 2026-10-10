import type { Metadata } from 'next'
import { NAME } from '@/lib/profile'

export const metadata: Metadata = {
  title: `Making four products behave like one, ${NAME}`,
  description:
    'Command Center gives a fleet one account, one vehicle record, and one place to see what needs attention, while tolls, bypass, safety, and compliance keep their own backends.',
}

export default function FleetworthyLayout({ children }: { children: React.ReactNode }) {
  return children
}

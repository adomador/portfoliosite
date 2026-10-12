import type { Metadata } from 'next'
import { NAME } from '@/lib/profile'

export const metadata: Metadata = {
  title: `Take the load or pass — ${NAME}`,
  description:
    'Diezl: a profitability calculator that gives owner-operators a defensible verdict, most of the time in under a minute.',
}

export default function DiezlLayout({ children }: { children: React.ReactNode }) {
  return children
}

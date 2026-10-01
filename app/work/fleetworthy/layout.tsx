import type { Metadata } from 'next'
import { NAME } from '@/lib/profile'

export const metadata: Metadata = {
  title: `Tell fleets what to do next, ${NAME}`,
  description:
    'One command center connects tolling, bypass, safety and compliance around each vehicle, then tells fleet managers what needs attention and what to do about it.',
}

export default function FleetworthyLayout({ children }: { children: React.ReactNode }) {
  return children
}

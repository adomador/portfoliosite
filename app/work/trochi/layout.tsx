import type { Metadata } from 'next'
import { NAME } from '@/lib/profile'

export const metadata: Metadata = {
  title: `A rate market brokers actually own — ${NAME}`,
  description:
    'Trochi: a cooperative freight rate platform designed from zero to one, now the primary tool for broker recruitment.',
}

export default function TrochiLayout({ children }: { children: React.ReactNode }) {
  return children
}

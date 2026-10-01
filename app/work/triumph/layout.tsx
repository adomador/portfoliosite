import type { Metadata } from 'next'
import { NAME } from '@/lib/profile'

export const metadata: Metadata = {
  title: `Stop jumping between profiles, ${NAME}`,
  description:
    "Triumph: a Global Search tool that puts a customer's invoice, payor relationship and factoring status on one screen, cutting chat handle time 49% and phone handle time 33%.",
}

export default function TriumphLayout({ children }: { children: React.ReactNode }) {
  return children
}

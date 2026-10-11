import { closeSync, openSync, readSync } from 'node:fs'
import path from 'node:path'
import type { CaseSlide } from '@/components/case-study/CaseCarousel'

export type CaseScreen = { src: string; alt: string; caption: string; surface?: string }

/** Reads a PNG's size from its header at build time. Null means the file isn't in /public yet. */
export function pngSize(src: string): { width: number; height: number } | null {
  let fd: number | undefined
  try {
    fd = openSync(path.join(process.cwd(), 'public', src), 'r')
    const header = Buffer.alloc(24)
    readSync(fd, header, 0, 24, 0)
    if (header.toString('ascii', 1, 4) !== 'PNG') return null
    return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) }
  } catch {
    return null
  } finally {
    if (fd !== undefined) closeSync(fd)
  }
}

/** One shared frame ratio for the set, so cycling cannot change page height. */
export function toSlides(screens: readonly CaseScreen[], stage?: string) {
  const sizes = screens.map((s) => pngSize(s.src))
  const first = sizes.find(Boolean)
  const slides: CaseSlide[] = screens.map((s, i) => {
    const size = sizes[i]
    return {
      src: size ? s.src : undefined,
      alt: s.alt,
      caption: s.caption,
      placeholder: path.basename(s.src),
      surface: s.surface,
    }
  })
  return { slides, ratio: stage ?? (first ? `${first.width} / ${first.height}` : '16 / 10') }
}

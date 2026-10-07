/**
 * Shatter the living mosaic into pixels, then reform them into a baked
 * first-fold of the case study. Destination is composed from known assets
 * (surface, type, cover image) at idle — never from a live DOM sample —
 * so production stays smooth while still reading as reconstitution.
 */

/** Shatter outward. */
export const PIXEL_SHATTER_MS = 180
/** Home into the baked case-study first fold. */
export const PIXEL_REFORM_MS = 320
/** Total motion window (shatter + reform). */
export const PIXEL_BURST_MS = PIXEL_SHATTER_MS + PIXEL_REFORM_MS

const SCALE = 0.38
const CAP_DESKTOP = 6400
const CAP_MOBILE = 3200
const BG_THRESH = 28
/** Skip every Nth pixel when scanning so getImageData work stays bounded. */
const SCAN_STEP = 2

const easeOutQuart = (t: number) => 1 - (1 - t) ** 4
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

type RGB = [number, number, number]

export type DestWarmOpts = {
  href: string
  label: string
  tag: string
  surface: string
  cover: string
  /** Title ink; defaults to warm off-white. */
  ink?: string
}

type BurstOpts = {
  sourceRoot: HTMLElement
  origin: { x: number; y: number }
  accent?: string
  dest?: DestWarmOpts
  onReadyToNav: () => void
  onComplete: () => void
}

function parseRgb(input: string, fallback: RGB): RGB {
  const m = input.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i)
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])]
  if (input.startsWith('#')) {
    const h = input.slice(1)
    if (h.length === 3) {
      return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
    }
    if (h.length >= 6) {
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
    }
  }
  return fallback
}

function near(r: number, g: number, b: number, bg: RGB, thresh: number) {
  return Math.abs(r - bg[0]) + Math.abs(g - bg[1]) + Math.abs(b - bg[2]) < thresh
}

function visible(el: Element) {
  if (el.id === 'pixel-burst') return false
  const cs = getComputedStyle(el)
  if (cs.display === 'none' || cs.visibility === 'hidden') return false
  if (parseFloat(cs.opacity) === 0) return false
  return true
}

/**
 * Snapshot only the mosaic canvas (plus a large panel image if open).
 * Avoids walking the whole DOM — that was the local-vs-prod freeze.
 */
function rasterizeMosaic(root: HTMLElement, w: number, h: number, scale: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) return canvas

  const bg = getComputedStyle(root).backgroundColor
  ctx.fillStyle = bg && bg !== 'rgba(0, 0, 0, 0)' ? bg : '#14100e'
  ctx.fillRect(0, 0, w, h)

  const mosaic = root.querySelector('canvas:not(#pixel-burst)')
  if (mosaic instanceof HTMLCanvasElement && visible(mosaic) && mosaic.width > 2) {
    const r = mosaic.getBoundingClientRect()
    try {
      ctx.drawImage(mosaic, r.left * scale, r.top * scale, r.width * scale, r.height * scale)
    } catch {
      /* detached */
    }
  }

  const images = root.querySelectorAll('img')
  for (let i = 0; i < images.length; i++) {
    const img = images[i]
    if (!visible(img) || !img.naturalWidth) continue
    const ir = img.getBoundingClientRect()
    if (ir.width < 100 || ir.height < 100) continue
    if (ir.bottom < 0 || ir.top > window.innerHeight) continue
    try {
      ctx.drawImage(img, ir.left * scale, ir.top * scale, ir.width * scale, ir.height * scale)
    } catch {
      /* cross-origin */
    }
  }

  return canvas
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (let i = 0; i < words.length; i++) {
    const next = line ? `${line} ${words[i]}` : words[i]
    if (ctx.measureText(next).width <= maxWidth) {
      line = next
      continue
    }
    if (line) lines.push(line)
    line = words[i]
    if (lines.length >= maxLines - 1) {
      /* Pack the rest onto the last line and stop. */
      const rest = [line, ...words.slice(i + 1)].join(' ')
      lines.push(rest)
      return lines
    }
  }
  if (line) lines.push(line)
  return lines
}

/**
 * Compose a cheap first-fold stand-in: surface + eyebrow + title + cover.
 * Painted at burst resolution so sampling stays cheap.
 */
function paintDestFold(
  opts: DestWarmOpts,
  w: number,
  h: number,
  scale: number,
  coverImg: HTMLImageElement | null
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) return canvas

  const cssW = w / scale
  const gutter = Math.max(22, Math.min(64, cssW * 0.05)) * scale
  const measure = Math.min(1080 * scale, w - gutter * 2)
  const ink = opts.ink ?? '#f4f1ea'
  const inkMuted = 'rgba(244, 241, 234, 0.5)'

  ctx.fillStyle = opts.surface
  ctx.fillRect(0, 0, w, h)

  /* Sticky-bar hint — thin top rule so the fold reads as a page, not a poster. */
  ctx.fillStyle = 'rgba(244, 241, 234, 0.1)'
  ctx.fillRect(0, Math.round(52 * scale), w, 1)

  const topPad = Math.max(56, Math.min(96, h / scale * 0.09)) * scale
  let y = topPad + 8 * scale

  ctx.fillStyle = inkMuted
  ctx.font = `500 ${Math.max(7, 11 * scale)}px Satoshi, system-ui, sans-serif`
  ctx.letterSpacing = `${0.12 * scale}px`
  ctx.fillText(opts.tag.toUpperCase(), gutter, y)
  ctx.letterSpacing = '0px'
  y += 28 * scale

  ctx.fillStyle = ink
  const titleSize = Math.max(18, Math.min(36, 28 * scale + (cssW > 900 ? 8 : 0)))
  ctx.font = `500 ${titleSize}px Satoshi, system-ui, sans-serif`
  const titleLines = wrapLines(ctx, opts.label, Math.min(measure, 700 * scale), 3)
  const lineH = titleSize * 1.08
  for (let i = 0; i < titleLines.length; i++) {
    ctx.fillText(titleLines[i], gutter, y + lineH * (i + 0.85))
  }
  y += lineH * titleLines.length + 36 * scale

  if (coverImg && coverImg.naturalWidth > 0) {
    const maxW = measure
    const maxH = Math.max(80, h - y - 24 * scale)
    const aspect = coverImg.naturalWidth / coverImg.naturalHeight
    let dw = maxW
    let dh = dw / aspect
    if (dh > maxH) {
      dh = maxH
      dw = dh * aspect
    }
    const dx = gutter
    const dy = y
    ctx.save()
    ctx.beginPath()
    const r = 8 * scale
    ctx.moveTo(dx + r, dy)
    ctx.arcTo(dx + dw, dy, dx + dw, dy + dh, r)
    ctx.arcTo(dx + dw, dy + dh, dx, dy + dh, r)
    ctx.arcTo(dx, dy + dh, dx, dy, r)
    ctx.arcTo(dx, dy, dx + dw, dy, r)
    ctx.closePath()
    ctx.clip()
    try {
      ctx.drawImage(coverImg, dx, dy, dw, dh)
    } catch {
      /* decode race */
    }
    ctx.restore()
  }

  return canvas
}

/** Stride the bitmap straight into typed arrays — no growing JS arrays. */
function sample(canvas: HTMLCanvasElement, bg: RGB, cap: number) {
  const empty = {
    x: new Float32Array(0),
    y: new Float32Array(0),
    r: new Uint8Array(0),
    g: new Uint8Array(0),
    b: new Uint8Array(0),
    n: 0,
  }
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return empty
  const { width: w, height: h } = canvas
  const data = ctx.getImageData(0, 0, w, h).data

  let count = 0
  for (let y = 0; y < h; y += SCAN_STEP) {
    for (let x = 0; x < w; x += SCAN_STEP) {
      const i = (y * w + x) * 4
      if (data[i + 3] < 18) continue
      if (near(data[i], data[i + 1], data[i + 2], bg, BG_THRESH)) continue
      count++
    }
  }

  const n = Math.min(count, cap)
  const xArr = new Float32Array(n)
  const yArr = new Float32Array(n)
  const rArr = new Uint8Array(n)
  const gArr = new Uint8Array(n)
  const bArr = new Uint8Array(n)
  if (n === 0) return { x: xArr, y: yArr, r: rArr, g: gArr, b: bArr, n: 0 }

  const stride = count > n ? count / n : 1
  let seen = 0
  let written = 0
  let next = 0

  outer: for (let y = 0; y < h; y += SCAN_STEP) {
    for (let x = 0; x < w; x += SCAN_STEP) {
      const i = (y * w + x) * 4
      if (data[i + 3] < 18) continue
      if (near(data[i], data[i + 1], data[i + 2], bg, BG_THRESH)) continue
      if (seen >= next) {
        xArr[written] = x
        yArr[written] = y
        rArr[written] = data[i]
        gArr[written] = data[i + 1]
        bArr[written] = data[i + 2]
        written++
        next = written * stride
        if (written >= n) break outer
      }
      seen++
    }
  }

  return { x: xArr, y: yArr, r: rArr, g: gArr, b: bArr, n: written }
}

function packBg(rgb: RGB): number {
  /* ImageData is RGBA little-endian → 0xAABBGGRR in a Uint32 view. */
  return (255 << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0]
}

type Field = {
  w: number
  h: number
  n: number
  x: Float32Array
  y: Float32Array
  r: Uint8Array
  g: Uint8Array
  b: Uint8Array
  bg: RGB
}

/** Built while the mosaic is idle so a click never has to scan pixels. */
let warmed: Field | null = null
const warmedDest = new Map<string, Field>()
const coverCache = new Map<string, HTMLImageElement>()

function burstSize() {
  const cssW = window.innerWidth
  const cssH = window.innerHeight
  return {
    cssW,
    cssH,
    w: Math.max(1, Math.round(cssW * SCALE)),
    h: Math.max(1, Math.round(cssH * SCALE)),
    cap: cssW < 720 ? CAP_MOBILE : CAP_DESKTOP,
  }
}

function loadCover(src: string): Promise<HTMLImageElement | null> {
  const hit = coverCache.get(src)
  if (hit && hit.complete && hit.naturalWidth > 0) return Promise.resolve(hit)
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      coverCache.set(src, img)
      resolve(img)
    }
    img.onerror = () => resolve(null)
    img.src = src
  })
}

function fieldFromCanvas(canvas: HTMLCanvasElement, bg: RGB, cap: number, w: number, h: number): Field | null {
  const sampled = sample(canvas, bg, cap)
  if (sampled.n < 8) return null
  return {
    w,
    h,
    n: sampled.n,
    x: sampled.x,
    y: sampled.y,
    r: sampled.r,
    g: sampled.g,
    b: sampled.b,
    bg,
  }
}

export function warmBurst(root: HTMLElement) {
  const { w, h, cap } = burstSize()
  if (warmed && warmed.w === w && warmed.h === h && warmed.n > 0) return
  const bg = parseRgb(getComputedStyle(root).backgroundColor, [20, 16, 14])
  const source = rasterizeMosaic(root, w, h, SCALE)
  const field = fieldFromCanvas(source, bg, cap, w, h)
  if (field) warmed = field
}

/** Idle-bake a first-fold dest field for one case study. Safe to call repeatedly. */
export async function warmDest(opts: DestWarmOpts) {
  const { w, h, cap } = burstSize()
  const cached = warmedDest.get(opts.href)
  if (cached && cached.w === w && cached.h === h && cached.n > 0) return

  const cover = await loadCover(opts.cover)
  const bg = parseRgb(opts.surface, [16, 17, 20])
  const canvas = paintDestFold(opts, w, h, SCALE, cover)
  const field = fieldFromCanvas(canvas, bg, cap, w, h)
  if (field) warmedDest.set(opts.href, field)
}

function getDestField(opts: DestWarmOpts | undefined, bw: number, bh: number): Field | null {
  if (!opts) return null
  const cached = warmedDest.get(opts.href)
  /* Cache only — never paint or getImageData on the click frame. */
  if (cached && cached.w === bw && cached.h === bh && cached.n > 0) return cached
  return null
}

export class PixelBurstController {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private buffer: ImageData | null = null
  private pixels: Uint32Array | null = null
  private raf = 0
  private startAt = 0
  private running = false
  private navSent = false
  private onReadyToNav: () => void = () => {}
  private onComplete: () => void = () => {}
  private bw = 1
  private bh = 1
  private n = 0
  private ox: Float32Array<ArrayBufferLike> = new Float32Array(0)
  private oy: Float32Array<ArrayBufferLike> = new Float32Array(0)
  private vx: Float32Array<ArrayBufferLike> = new Float32Array(0)
  private vy: Float32Array<ArrayBufferLike> = new Float32Array(0)
  private tx: Float32Array<ArrayBufferLike> = new Float32Array(0)
  private ty: Float32Array<ArrayBufferLike> = new Float32Array(0)
  private sr: Uint8Array<ArrayBufferLike> = new Uint8Array(0)
  private sg: Uint8Array<ArrayBufferLike> = new Uint8Array(0)
  private sb: Uint8Array<ArrayBufferLike> = new Uint8Array(0)
  private tr: Uint8Array<ArrayBufferLike> = new Uint8Array(0)
  private tg: Uint8Array<ArrayBufferLike> = new Uint8Array(0)
  private tb: Uint8Array<ArrayBufferLike> = new Uint8Array(0)
  private fromBg: RGB = [20, 16, 14]
  private toBg: RGB = [16, 17, 20]
  private fromPacked = 0
  private toPacked = 0
  private hasDest = false

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
    if (!ctx) throw new Error('Canvas 2D is unavailable')
    this.ctx = ctx
  }

  start(opts: BurstOpts) {
    this.cancel()
    const { cssW, cssH, w: bw, h: bh, cap } = burstSize()
    this.bw = bw
    this.bh = bh
    this.canvas.width = bw
    this.canvas.height = bh
    this.canvas.style.width = `${cssW}px`
    this.canvas.style.height = `${cssH}px`
    this.buffer = this.ctx.createImageData(bw, bh)
    this.pixels = new Uint32Array(this.buffer.data.buffer)

    const cached = warmed && warmed.w === bw && warmed.h === bh && warmed.n > 0 ? warmed : null
    this.fromBg = cached?.bg ?? parseRgb(getComputedStyle(opts.sourceRoot).backgroundColor, [20, 16, 14])
    const destField = getDestField(opts.dest, bw, bh)
    this.toBg = destField?.bg ?? (opts.dest ? parseRgb(opts.dest.surface, [16, 17, 20]) : this.fromBg)
    this.fromPacked = packBg(this.fromBg)
    this.toPacked = packBg(this.toBg)
    this.hasDest = !!destField && destField.n > 0

    if (!cached) {
      const source = rasterizeMosaic(opts.sourceRoot, bw, bh, SCALE)
      const sampled = sample(source, this.fromBg, cap)
      this.n = sampled.n
      this.ox = sampled.x
      this.oy = sampled.y
      this.sr = sampled.r
      this.sg = sampled.g
      this.sb = sampled.b
    } else {
      this.n = cached.n
      this.ox = cached.x.slice()
      this.oy = cached.y.slice()
      this.sr = cached.r.slice()
      this.sg = cached.g.slice()
      this.sb = cached.b.slice()
    }
    this.vx = new Float32Array(this.n)
    this.vy = new Float32Array(this.n)

    const originX = opts.origin.x * SCALE
    const originY = opts.origin.y * SCALE
    const accent = opts.accent ? parseRgb(opts.accent, this.fromBg) : null

    for (let i = 0; i < this.n; i++) {
      const s = Math.random()
      const dx = this.ox[i] - originX
      const dy = this.oy[i] - originY
      const dist = Math.hypot(dx, dy) || 1
      let nx = dx / dist
      let ny = dy / dist
      if (Math.abs(nx) > Math.abs(ny)) ny *= 0.28
      else nx *= 0.28
      const throwD = 28 + s * 96 + Math.min(64, dist * 0.12)
      const swirl = (s - 0.5) * 0.65
      const c = Math.cos(swirl)
      const sn = Math.sin(swirl)
      this.vx[i] = (nx * c - ny * sn) * throwD
      this.vy[i] = (nx * sn + ny * c) * throwD
    }

    if (accent && this.n > 0) {
      const extra = Math.min(180, Math.max(60, (this.n * 0.03) | 0))
      const n2 = this.n + extra
      this.ox = growF32(this.ox, n2)
      this.oy = growF32(this.oy, n2)
      this.vx = growF32(this.vx, n2)
      this.vy = growF32(this.vy, n2)
      this.sr = growU8(this.sr, n2)
      this.sg = growU8(this.sg, n2)
      this.sb = growU8(this.sb, n2)
      for (let i = this.n; i < n2; i++) {
        const s = Math.random()
        const ang = s * Math.PI * 2
        this.ox[i] = originX
        this.oy[i] = originY
        this.vx[i] = Math.cos(ang) * (16 + s * 64)
        this.vy[i] = Math.sin(ang) * (16 + s * 64)
        this.sr[i] = accent[0]
        this.sg[i] = accent[1]
        this.sb[i] = accent[2]
      }
      this.n = n2
    }

    this.assignHomes(destField, originX, originY)

    this.onReadyToNav = opts.onReadyToNav
    this.onComplete = opts.onComplete
    this.navSent = false
    this.running = true
    this.startAt = performance.now()
    this.canvas.style.opacity = '1'
    this.canvas.classList.add('pixelBurstOn')
    this.draw(0, 0)
    this.raf = requestAnimationFrame(this.tick)
  }

  /** Pair source particles with dest homes; spawn extras from the click origin. */
  private assignHomes(dest: Field | null, originX: number, originY: number) {
    const srcN = this.n
    const destN = dest?.n ?? 0
    const to = this.toBg

    if (!dest || destN === 0) {
      this.tx = new Float32Array(srcN)
      this.ty = new Float32Array(srcN)
      this.tr = new Uint8Array(srcN)
      this.tg = new Uint8Array(srcN)
      this.tb = new Uint8Array(srcN)
      for (let i = 0; i < srcN; i++) {
        this.tx[i] = this.ox[i] + this.vx[i]
        this.ty[i] = this.oy[i] + this.vy[i]
        this.tr[i] = to[0]
        this.tg[i] = to[1]
        this.tb[i] = to[2]
      }
      this.hasDest = false
      return
    }

    /* Shuffle dest indices so neighbors don't map in scan order. */
    const order = new Uint32Array(destN)
    for (let i = 0; i < destN; i++) order[i] = i
    for (let i = destN - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0
      const tmp = order[i]
      order[i] = order[j]
      order[j] = tmp
    }

    const n = Math.max(srcN, destN)
    this.ox = growF32(this.ox, n)
    this.oy = growF32(this.oy, n)
    this.vx = growF32(this.vx, n)
    this.vy = growF32(this.vy, n)
    this.sr = growU8(this.sr, n)
    this.sg = growU8(this.sg, n)
    this.sb = growU8(this.sb, n)
    this.tx = new Float32Array(n)
    this.ty = new Float32Array(n)
    this.tr = new Uint8Array(n)
    this.tg = new Uint8Array(n)
    this.tb = new Uint8Array(n)

    for (let i = 0; i < srcN; i++) {
      if (i < destN) {
        const d = order[i]
        this.tx[i] = dest.x[d]
        this.ty[i] = dest.y[d]
        this.tr[i] = dest.r[d]
        this.tg[i] = dest.g[d]
        this.tb[i] = dest.b[d]
      } else {
        /* Excess mosaic pixels dissolve into the dest surface near a real home. */
        const d = order[i % destN]
        this.tx[i] = dest.x[d] + (Math.random() - 0.5) * 12
        this.ty[i] = dest.y[d] + (Math.random() - 0.5) * 12
        this.tr[i] = to[0]
        this.tg[i] = to[1]
        this.tb[i] = to[2]
      }
    }

    for (let i = srcN; i < destN; i++) {
      const d = order[i]
      const s = Math.random()
      const ang = s * Math.PI * 2
      const throwD = 20 + s * 72
      this.ox[i] = originX
      this.oy[i] = originY
      this.vx[i] = Math.cos(ang) * throwD
      this.vy[i] = Math.sin(ang) * throwD
      this.sr[i] = to[0]
      this.sg[i] = to[1]
      this.sb[i] = to[2]
      this.tx[i] = dest.x[d]
      this.ty[i] = dest.y[d]
      this.tr[i] = dest.r[d]
      this.tg[i] = dest.g[d]
      this.tb[i] = dest.b[d]
    }

    this.n = n
    this.hasDest = true
  }

  cancel() {
    this.running = false
    cancelAnimationFrame(this.raf)
    this.canvas.classList.remove('pixelBurstOn')
    this.canvas.style.opacity = '1'
  }

  private tick = (now: number) => {
    if (!this.running) return
    const elapsed = now - this.startAt

    if (elapsed < PIXEL_SHATTER_MS) {
      const shatterT = clamp01(elapsed / PIXEL_SHATTER_MS)
      this.draw(shatterT, 0)
      this.raf = requestAnimationFrame(this.tick)
      return
    }

    const reformT = clamp01((elapsed - PIXEL_SHATTER_MS) / PIXEL_REFORM_MS)
    this.draw(1, reformT)

    if (reformT >= 1) {
      /* Hold the reconstituted frame. Route work starts now, under a still
         picture that already looks like the case study — never during rAF. */
      this.running = false
      if (!this.navSent) {
        this.navSent = true
        this.onReadyToNav()
      }
      this.onComplete()
      return
    }
    this.raf = requestAnimationFrame(this.tick)
  }

  /**
   * @param shatterT 0→1 during outward throw
   * @param reformT 0→1 during home (0 while still shattering)
   */
  private draw(shatterT: number, reformT: number) {
    const img = this.buffer
    const pixels = this.pixels
    if (!img || !pixels) return
    const w = this.bw
    const h = this.bh

    const phase = this.hasDest
      ? clamp01(shatterT * 0.45 + reformT * 0.55)
      : clamp01(shatterT)
    const bgT = easeInOutCubic(phase)
    const packed =
      bgT < 0.01
        ? this.fromPacked
        : bgT > 0.99
          ? this.toPacked
          : packBg([
              mix(this.fromBg[0], this.toBg[0], bgT) | 0,
              mix(this.fromBg[1], this.toBg[1], bgT) | 0,
              mix(this.fromBg[2], this.toBg[2], bgT) | 0,
            ])
    pixels.fill(packed)

    const explode = easeOutQuart(shatterT)
    const home = easeOutCubic(reformT)
    const to = this.toBg

    for (let i = 0; i < this.n; i++) {
      const peakX = this.ox[i] + this.vx[i] * explode
      const peakY = this.oy[i] + this.vy[i] * explode

      let x: number
      let y: number
      let r: number
      let g: number
      let b: number

      if (reformT <= 0 || !this.hasDest) {
        x = peakX
        y = peakY
        /* Without a dest field, soft-tint toward the surface like before. */
        const tint = this.hasDest ? 0 : shatterT * 0.45
        r = mix(this.sr[i], to[0], tint) | 0
        g = mix(this.sg[i], to[1], tint) | 0
        b = mix(this.sb[i], to[2], tint) | 0
      } else {
        /* From the exploded cloud into the baked first-fold homes. */
        const peakAtFull = this.ox[i] + this.vx[i]
        const peakYFull = this.oy[i] + this.vy[i]
        x = mix(peakAtFull, this.tx[i], home)
        y = mix(peakYFull, this.ty[i], home)
        r = mix(this.sr[i], this.tr[i], home) | 0
        g = mix(this.sg[i], this.tg[i], home) | 0
        b = mix(this.sb[i], this.tb[i], home) | 0
      }

      const xi = x | 0
      const yi = y | 0
      if ((xi | yi) < 0 || xi >= w || yi >= h) continue
      pixels[yi * w + xi] = (255 << 24) | (b << 16) | (g << 8) | r
    }

    this.ctx.putImageData(img, 0, 0)
  }
}

function growF32(src: Float32Array<ArrayBufferLike>, n: number) {
  const next = new Float32Array(n)
  next.set(src)
  return next
}

function growU8(src: Uint8Array<ArrayBufferLike>, n: number) {
  const next = new Uint8Array(n)
  next.set(src)
  return next
}

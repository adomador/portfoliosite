/**
 * Shatter the living mosaic into pixels, then let them settle as the case
 * study arrives underneath. Tuned for production: one cheap mosaic sample,
 * no mid-flight DOM rasterize, navigation deferred until the shatter peaks
 * so React's route work hides inside the chaos.
 */

/** How long the shatter itself runs. Navigation waits until this finishes. */
export const PIXEL_BURST_MS = 340

const SCALE = 0.38
const CAP_DESKTOP = 6400
const CAP_MOBILE = 3200
const BG_THRESH = 28
/** Skip every Nth pixel when scanning so getImageData work stays bounded. */
const SCAN_STEP = 2

const easeOutQuart = (t: number) => 1 - (1 - t) ** 4
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

type RGB = [number, number, number]

type BurstOpts = {
  sourceRoot: HTMLElement
  origin: { x: number; y: number }
  accent?: string
  /** Case-study surface; particles tint toward this instead of re-sampling the DOM. */
  destBg?: string
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

export function warmBurst(root: HTMLElement) {
  const cssW = window.innerWidth
  const cssH = window.innerHeight
  const w = Math.max(1, Math.round(cssW * SCALE))
  const h = Math.max(1, Math.round(cssH * SCALE))
  if (warmed && warmed.w === w && warmed.h === h && warmed.n > 0) return
  const bg = parseRgb(getComputedStyle(root).backgroundColor, [20, 16, 14])
  const source = rasterizeMosaic(root, w, h, SCALE)
  const cap = cssW < 720 ? CAP_MOBILE : CAP_DESKTOP
  const sampled = sample(source, bg, cap)
  if (sampled.n < 8) return
  warmed = {
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
  private sr: Uint8Array<ArrayBufferLike> = new Uint8Array(0)
  private sg: Uint8Array<ArrayBufferLike> = new Uint8Array(0)
  private sb: Uint8Array<ArrayBufferLike> = new Uint8Array(0)
  private fromBg: RGB = [20, 16, 14]
  private toBg: RGB = [16, 17, 20]
  private fromPacked = 0
  private toPacked = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
    if (!ctx) throw new Error('Canvas 2D is unavailable')
    this.ctx = ctx
  }

  start(opts: BurstOpts) {
    this.cancel()
    const cssW = window.innerWidth
    const cssH = window.innerHeight
    const bw = Math.max(1, Math.round(cssW * SCALE))
    const bh = Math.max(1, Math.round(cssH * SCALE))
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
    this.toBg = opts.destBg ? parseRgb(opts.destBg, [16, 17, 20]) : this.fromBg
    this.fromPacked = packBg(this.fromBg)
    this.toPacked = packBg(this.toBg)

    if (!cached) {
      const source = rasterizeMosaic(opts.sourceRoot, bw, bh, SCALE)
      const cap = cssW < 720 ? CAP_MOBILE : CAP_DESKTOP
      const sampled = sample(source, this.fromBg, cap)
      this.n = sampled.n
      this.ox = sampled.x
      this.oy = sampled.y
      this.sr = sampled.r
      this.sg = sampled.g
      this.sb = sampled.b
    } else {
      this.n = cached.n
      this.ox = cached.x
      this.oy = cached.y
      this.sr = cached.r
      this.sg = cached.g
      this.sb = cached.b
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

    this.onReadyToNav = opts.onReadyToNav
    this.onComplete = opts.onComplete
    this.navSent = false
    this.running = true
    this.startAt = performance.now()
    this.canvas.style.opacity = '1'
    this.canvas.classList.add('pixelBurstOn')
    this.draw(0)
    this.raf = requestAnimationFrame(this.tick)
  }

  cancel() {
    this.running = false
    cancelAnimationFrame(this.raf)
    this.canvas.classList.remove('pixelBurstOn')
    this.canvas.style.opacity = '1'
  }

  private tick = (now: number) => {
    if (!this.running) return
    const t = clamp01((now - this.startAt) / PIXEL_BURST_MS)
    this.draw(t)
    if (t >= 1) {
      /* Hold the last frame. Route work happens now, under a still picture,
         so it can't stutter the shatter. The overlay fades once the page lands. */
      this.running = false
      if (!this.navSent) {
        this.navSent = true
        this.onReadyToNav()
      }
      return
    }
    this.raf = requestAnimationFrame(this.tick)
  }

  private draw(t: number) {
    const img = this.buffer
    const pixels = this.pixels
    if (!img || !pixels) return
    const w = this.bw
    const h = this.bh
    const bgT = easeInOutCubic(t)
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

    const explode = easeOutQuart(t)
    const to = this.toBg

    for (let i = 0; i < this.n; i++) {
      const x = (this.ox[i] + this.vx[i] * explode) | 0
      const y = (this.oy[i] + this.vy[i] * explode) | 0
      if ((x | y) < 0 || x >= w || y >= h) continue
      const r = mix(this.sr[i], to[0], t * 0.45) | 0
      const g = mix(this.sg[i], to[1], t * 0.45) | 0
      const b = mix(this.sb[i], to[2], t * 0.45) | 0
      pixels[y * w + x] = (255 << 24) | (b << 16) | (g << 8) | r
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

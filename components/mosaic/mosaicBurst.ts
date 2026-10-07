/**
 * Shatter the living mosaic into a field of pixels, then let those pixels
 * fall back into the case study. Duration matches the old page-fade (380ms).
 *
 * No React in the loop. The overlay canvas lives on the provider; this file
 * only samples, integrates and draws.
 */

export const PIXEL_BURST_MS = 380

const SCALE = 0.55
const SPLIT = 0.38
const FADE_START = 0.86
const CAP_DESKTOP = 22000
const CAP_MOBILE = 10000
const BG_THRESH = 24

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
  onReadyToNav: () => void
  onComplete: () => void
}

function parseRgb(input: string, fallback: RGB): RGB {
  const m = input.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i)
  if (!m) return fallback
  return [Number(m[1]), Number(m[2]), Number(m[3])]
}

function near(r: number, g: number, b: number, bg: RGB, thresh: number) {
  return Math.abs(r - bg[0]) + Math.abs(g - bg[1]) + Math.abs(b - bg[2]) < thresh
}

function skipBurstNode(el: Element | null) {
  if (!el) return true
  return Boolean(el.id === 'pixel-burst' || el.closest?.('#pixel-burst'))
}

function visible(el: Element) {
  if (skipBurstNode(el)) return false
  const cs = getComputedStyle(el)
  if (cs.display === 'none' || cs.visibility === 'hidden') return false
  if (parseFloat(cs.opacity) === 0) return false
  return true
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  if (h.length === 3) {
    return `rgb(${parseInt(h[0] + h[0], 16)}, ${parseInt(h[1] + h[1], 16)}, ${parseInt(h[2] + h[2], 16)})`
  }
  return `rgb(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)})`
}

function paintText(ctx: CanvasRenderingContext2D, root: HTMLElement, scale: number) {
  const viewH = window.innerHeight
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  let node: Node | null
  let words = 0
  while ((node = walker.nextNode())) {
    if (words > 420) break
    const raw = node.textContent
    if (!raw || !raw.trim()) continue
    const parent = node.parentElement
    if (!parent || !visible(parent)) continue
    const tag = parent.tagName
    if (tag === 'SCRIPT' || tag === 'STYLE') continue
    const cs = getComputedStyle(parent)
    const fontSize = parseFloat(cs.fontSize)
    if (fontSize < 9) continue
    ctx.fillStyle = cs.color
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${Math.max(1, fontSize * scale)}px ${cs.fontFamily}`
    ctx.textBaseline = 'top'
    const re = /\S+/g
    let m: RegExpExecArray | null
    while ((m = re.exec(raw))) {
      if (words > 420) break
      try {
        range.setStart(node, m.index)
        range.setEnd(node, m.index + m[0].length)
      } catch {
        continue
      }
      const r = range.getBoundingClientRect()
      if (r.width < 1 || r.height < 1) continue
      if (r.bottom < 0 || r.top > viewH) continue
      ctx.fillText(m[0], r.left * scale, r.top * scale)
      words++
    }
  }
}

/** Paint whatever is on screen into a small canvas, fonts and images included. */
function rasterize(
  root: HTMLElement,
  w: number,
  h: number,
  scale: number,
  mode: 'source' | 'dest'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) return canvas

  const bg =
    getComputedStyle(root).backgroundColor || getComputedStyle(document.body).backgroundColor
  ctx.fillStyle = bg && bg !== 'rgba(0, 0, 0, 0)' ? bg : '#14100e'
  ctx.fillRect(0, 0, w, h)

  const viewH = window.innerHeight
  const viewW = window.innerWidth

  /* The living mosaic is the canvas. Chrome (index, header) would otherwise
     dominate the particle field as a slab of type. List view has no canvas. */
  if (mode === 'source') {
    const mosaic = root.querySelector('canvas')
    if (mosaic && visible(mosaic)) {
      const r = mosaic.getBoundingClientRect()
      try {
        ctx.drawImage(mosaic, r.left * scale, r.top * scale, r.width * scale, r.height * scale)
      } catch {
        /* detached */
      }
      const images = root.querySelectorAll('img')
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        if (!visible(img) || !img.naturalWidth) continue
        const ir = img.getBoundingClientRect()
        if (ir.width < 80 || ir.height < 80) continue
        if (ir.bottom < 0 || ir.top > viewH) continue
        try {
          ctx.drawImage(img, ir.left * scale, ir.top * scale, ir.width * scale, ir.height * scale)
        } catch {
          /* cross-origin */
        }
      }
      return canvas
    }
  }

  const surfaces = root.querySelectorAll<HTMLElement>('header, nav, section, article, div, main, a, button')
  let painted = 0
  for (let i = 0; i < surfaces.length; i++) {
    if (painted > 90) break
    const el = surfaces[i]
    if (!visible(el)) continue
    const cs = getComputedStyle(el)
    const fill = cs.backgroundColor
    if (!fill || fill === 'transparent' || fill === 'rgba(0, 0, 0, 0)') continue
    const r = el.getBoundingClientRect()
    if (r.width < 4 || r.height < 4) continue
    if (r.bottom < 0 || r.top > viewH || r.right < 0 || r.left > viewW) continue
    if (r.width >= viewW * 0.96 && r.height >= viewH * 0.96) continue
    ctx.fillStyle = fill
    ctx.fillRect(r.left * scale, r.top * scale, r.width * scale, r.height * scale)
    painted++
  }

  const canvases = root.querySelectorAll('canvas')
  for (let i = 0; i < canvases.length; i++) {
    const el = canvases[i]
    if (!visible(el)) continue
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    try {
      ctx.drawImage(el, r.left * scale, r.top * scale, r.width * scale, r.height * scale)
    } catch {
      /* tainted or detached */
    }
  }

  const images = root.querySelectorAll('img')
  for (let i = 0; i < images.length; i++) {
    const img = images[i]
    if (!visible(img)) continue
    if (!img.naturalWidth) continue
    const r = img.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    if (r.bottom < 0 || r.top > viewH) continue
    try {
      ctx.drawImage(img, r.left * scale, r.top * scale, r.width * scale, r.height * scale)
    } catch {
      /* cross-origin */
    }
  }

  paintText(ctx, root, scale)
  return canvas
}

function sample(canvas: HTMLCanvasElement, bg: RGB, cap: number) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const empty = {
    x: new Float32Array(0),
    y: new Float32Array(0),
    r: new Uint8Array(0),
    g: new Uint8Array(0),
    b: new Uint8Array(0),
    n: 0,
  }
  if (!ctx) return empty
  const { width: w, height: h } = canvas
  const data = ctx.getImageData(0, 0, w, h).data
  const xs: number[] = []
  const ys: number[] = []
  const rs: number[] = []
  const gs: number[] = []
  const bs: number[] = []

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      if (data[i + 3] < 18) continue
      if (near(data[i], data[i + 1], data[i + 2], bg, BG_THRESH)) continue
      xs.push(x)
      ys.push(y)
      rs.push(data[i])
      gs.push(data[i + 1])
      bs.push(data[i + 2])
    }
  }

  const total = xs.length
  const n = Math.min(total, cap)
  const x = new Float32Array(n)
  const y = new Float32Array(n)
  const cr = new Uint8Array(n)
  const cg = new Uint8Array(n)
  const cb = new Uint8Array(n)
  const stride = total > n ? total / n : 1
  for (let i = 0; i < n; i++) {
    const src = Math.min(total - 1, (i * stride) | 0)
    x[i] = xs[src]
    y[i] = ys[src]
    cr[i] = rs[src]
    cg[i] = gs[src]
    cb[i] = bs[src]
  }
  return { x, y, r: cr, g: cg, b: cb, n }
}

function copyF32(src: Float32Array, n: number) {
  const next = new Float32Array(n)
  next.set(src)
  return next
}

function copyU8(src: Uint8Array, n: number) {
  const next = new Uint8Array(n)
  next.set(src)
  return next
}

export class PixelBurstController {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private buffer: ImageData | null = null
  private raf = 0
  private startAt = 0
  private running = false
  private onComplete: () => void = () => {}
  private bw = 1
  private bh = 1
  private n = 0
  private ox = new Float32Array(0)
  private oy = new Float32Array(0)
  private vx = new Float32Array(0)
  private vy = new Float32Array(0)
  private sr = new Uint8Array(0)
  private sg = new Uint8Array(0)
  private sb = new Uint8Array(0)
  private tr = new Uint8Array(0)
  private tg = new Uint8Array(0)
  private tb = new Uint8Array(0)
  private fromBg: RGB = [20, 16, 14]
  private toBg: RGB = [16, 17, 20]
  private destReady = false

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d', { alpha: false })
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

    const source = rasterize(opts.sourceRoot, bw, bh, SCALE, 'source')
    this.fromBg = parseRgb(getComputedStyle(opts.sourceRoot).backgroundColor, [20, 16, 14])
    this.toBg = this.fromBg

    const cap = cssW < 720 ? CAP_MOBILE : CAP_DESKTOP
    const sampled = sample(source, this.fromBg, cap)
    this.n = sampled.n
    this.ox = sampled.x
    this.oy = sampled.y
    this.sr = sampled.r
    this.sg = sampled.g
    this.sb = sampled.b
    this.tr = sampled.r.slice()
    this.tg = sampled.g.slice()
    this.tb = sampled.b.slice()
    this.vx = new Float32Array(this.n)
    this.vy = new Float32Array(this.n)
    this.destReady = false

    const originX = opts.origin.x * SCALE
    const originY = opts.origin.y * SCALE
    const accent = opts.accent ? parseRgb(hexToRgb(opts.accent), this.fromBg) : null

    for (let i = 0; i < this.n; i++) {
      const s = Math.random()
      const dx = this.ox[i] - originX
      const dy = this.oy[i] - originY
      const dist = Math.hypot(dx, dy) || 1
      let nx = dx / dist
      let ny = dy / dist
      /* Bias the burst along the sheet's orthogonal lanes. */
      if (Math.abs(nx) > Math.abs(ny)) ny *= 0.28
      else nx *= 0.28
      const throwD = 32 + s * 108 + Math.min(80, dist * 0.14)
      const swirl = (s - 0.5) * 0.7
      const c = Math.cos(swirl)
      const sn = Math.sin(swirl)
      this.vx[i] = (nx * c - ny * sn) * throwD
      this.vy[i] = (nx * sn + ny * c) * throwD
    }

    if (accent && this.n > 0) {
      const extra = Math.min(360, Math.max(90, (this.n * 0.045) | 0))
      this.grow(this.n + extra)
      for (let i = this.n; i < this.n + extra; i++) {
        const s = Math.random()
        const ang = s * Math.PI * 2
        this.ox[i] = originX
        this.oy[i] = originY
        this.vx[i] = Math.cos(ang) * (20 + s * 78)
        this.vy[i] = Math.sin(ang) * (20 + s * 78)
        this.sr[i] = accent[0]
        this.sg[i] = accent[1]
        this.sb[i] = accent[2]
        this.tr[i] = accent[0]
        this.tg[i] = accent[1]
        this.tb[i] = accent[2]
      }
      this.n += extra
    }

    this.onComplete = opts.onComplete
    this.running = true
    this.startAt = performance.now()
    this.canvas.style.opacity = '1'
    this.canvas.classList.add('pixelBurstOn')
    this.draw(0)
    opts.onReadyToNav()
    this.raf = requestAnimationFrame(this.tick)
  }

  setDestination(root: HTMLElement) {
    if (!this.running || this.destReady) return
    const dest = rasterize(root, this.bw, this.bh, SCALE, 'dest')
    this.toBg = parseRgb(
      getComputedStyle(root).backgroundColor || getComputedStyle(document.body).backgroundColor,
      [16, 17, 20]
    )
    const ctx = dest.getContext('2d', { willReadFrequently: true })
    const data = ctx?.getImageData(0, 0, this.bw, this.bh).data
    if (!data) return
    for (let i = 0; i < this.n; i++) {
      const x = Math.max(0, Math.min(this.bw - 1, this.ox[i] | 0))
      const y = Math.max(0, Math.min(this.bh - 1, this.oy[i] | 0))
      const p = (y * this.bw + x) * 4
      this.tr[i] = data[p]
      this.tg[i] = data[p + 1]
      this.tb[i] = data[p + 2]
    }
    this.destReady = true
  }

  cancel() {
    this.running = false
    cancelAnimationFrame(this.raf)
    this.canvas.classList.remove('pixelBurstOn')
    this.canvas.style.opacity = '1'
  }

  private grow(n: number) {
    this.ox = copyF32(this.ox, n)
    this.oy = copyF32(this.oy, n)
    this.vx = copyF32(this.vx, n)
    this.vy = copyF32(this.vy, n)
    this.sr = copyU8(this.sr, n)
    this.sg = copyU8(this.sg, n)
    this.sb = copyU8(this.sb, n)
    this.tr = copyU8(this.tr, n)
    this.tg = copyU8(this.tg, n)
    this.tb = copyU8(this.tb, n)
  }

  private tick = (now: number) => {
    if (!this.running) return
    const t = clamp01((now - this.startAt) / PIXEL_BURST_MS)
    this.draw(t)
    if (t >= 1) {
      this.running = false
      this.canvas.classList.remove('pixelBurstOn')
      this.canvas.style.opacity = '1'
      this.onComplete()
      return
    }
    this.raf = requestAnimationFrame(this.tick)
  }

  private draw(t: number) {
    const img = this.buffer
    if (!img) return
    const data = img.data
    const w = this.bw
    const h = this.bh
    const fade = t < FADE_START ? 1 : 1 - (t - FADE_START) / (1 - FADE_START)
    const bgT = t < SPLIT ? 0 : easeInOutCubic((t - SPLIT) / (1 - SPLIT))
    const br = mix(this.fromBg[0], this.toBg[0], bgT) | 0
    const bg = mix(this.fromBg[1], this.toBg[1], bgT) | 0
    const bb = mix(this.fromBg[2], this.toBg[2], bgT) | 0

    for (let i = 0; i < data.length; i += 4) {
      data[i] = br
      data[i + 1] = bg
      data[i + 2] = bb
      data[i + 3] = 255
    }

    const explode = t < SPLIT ? easeOutQuart(t / SPLIT) : 1
    const reform = t < SPLIT ? 0 : easeInOutCubic((t - SPLIT) / (1 - SPLIT))
    const colorT = t < SPLIT ? 0 : reform

    for (let i = 0; i < this.n; i++) {
      const ex = this.ox[i] + this.vx[i] * explode
      const ey = this.oy[i] + this.vy[i] * explode
      const x = mix(ex, this.ox[i], reform) | 0
      const y = mix(ey, this.oy[i], reform) | 0
      if (x < 0 || y < 0 || x >= w || y >= h) continue
      const r = mix(this.sr[i], this.tr[i], colorT) | 0
      const g = mix(this.sg[i], this.tg[i], colorT) | 0
      const b = mix(this.sb[i], this.tb[i], colorT) | 0
      const p = (y * w + x) * 4
      data[p] = r
      data[p + 1] = g
      data[p + 2] = b
      if (x + 1 < w) {
        data[p + 4] = r
        data[p + 5] = g
        data[p + 6] = b
      }
      if (y + 1 < h) {
        const q = p + w * 4
        data[q] = r
        data[q + 1] = g
        data[q + 2] = b
      }
    }

    this.ctx.putImageData(img, 0, 0)
    this.canvas.style.opacity = String(fade)
  }
}

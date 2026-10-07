import type { MosaicEdge, MosaicNode } from '@/src/data/mosaic'

/**
 * A routing sheet: orthogonal lanes between case studies and the junctions
 * they share, drawn to a 2D canvas. No React in here. MosaicHome owns the UI
 * and talks to this through the public methods and callbacks.
 */

type Kind = 'project' | 'concept' | 'nucleus' | 'ambient'

type SimNode = {
  id: string
  kind: Kind
  label: string
  tag: string
  /** Simulation position and velocity. */
  x: number
  y: number
  vx: number
  vy: number
  /** Where the layout wants this node to rest. */
  ax: number
  ay: number
  /** Ambient cells only: resting spot as a fraction of the viewport. */
  u: number
  v: number
  r: number
  mass: number
  seed: number
  /** Eased lean toward the pointer. */
  lx: number
  ly: number
  /** Eased specular offset, so the chrome catches the pointer. */
  sx: number
  sy: number
  focus: number
  dim: number
  /** Ring bursts, as start times in seconds. */
  pings: number[]
  bloomDelay: number
  neighbors: number[]
  /** Rendered position and opacity, written once per frame. */
  px: number
  py: number
  alpha: number
  labelAlpha: number
  labelHalf: number
  /** Projects only. */
  color: string | null
  /** 0 is the resting terminal, 1 is the full panel. */
  expand: number
}

/** `color` is the brand of the project at either end, so traffic reads by system. */
type Edge = { a: number; b: number; rest: number; bow: number; hl: number; color: string | null }

type Rect = { x: number; y: number; w: number; h: number }

type Pulse = { edge: number; t: number; speed: number; dir: 1 | -1; hot: boolean }

type Ring = { x: number; y: number; start: number; max: number; strength: number }

type Palette = {
  bg: string
  bgDeep: string
  ink: string
  ink2: string
  ink3: string
  accent: string
  gold: string
  crimson: string
}

/** The panel's settled rect. `open` runs 0 to 1 (eased) as the node grows into it. */
export type PanelFrame = Rect & { id: string; open: number }

/** `reach` is how far the node and its label extend sideways from `x`. */
export type ActiveFrame = { x: number; y: number; r: number; reach: number }

export type EngineCallbacks = {
  onActiveChange?: (id: string | null) => void
  /** The project currently growing into a panel, or null. */
  onExpandChange?: (id: string | null) => void
  /** Every frame while any panel is on screen, then once with null. */
  onPanelFrame?: (frame: PanelFrame | null) => void
  onNodeActivate?: (id: string, pointerType: string) => void
  onEmptyActivate?: (pointerType: string) => void
  onActiveFrame?: (frame: ActiveFrame | null) => void
}

export type EngineOptions = {
  nodes: MosaicNode[]
  edges: MosaicEdge[]
  ambient: { desktop: number; mobile: number }
  reducedMotion: boolean
  callbacks: EngineCallbacks
}

/** Must match the panel layout in Mosaic.module.css. */
export const PANEL_W = 372
export const PANEL_H = 408
/** Clear space other nodes keep from an open panel: sides, above (their label hangs below), below. */
const PANEL_CLEAR = { x: 96, top: 78, bottom: 30 }

const COMPACT_MAX = 720
/** Must match the breakpoint where Mosaic.module.css shows the index on the left. */
const INDEX_MIN = 1200
const INDEX_INSET = 240
const STEP = 1 / 60
const INTRO_SECONDS = 1.2
const PING_SECONDS = 1.15
const HEARTBEAT_SECONDS = 7
const SLOW_FRAME_MS = 20
const SLOW_WINDOW_MS = 2000

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const clamp01 = (n: number) => clamp(n, 0, 1)
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOutBack = (t: number) => {
  const c = 1.25
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
}
/** Frame-rate independent approach toward a target. */
const approach = (value: number, target: number, rate: number, dt: number) =>
  value + (target - value) * (1 - Math.exp(-rate * dt))
/** Cheap smooth noise in [-1, 1]: two detuned sines never visibly repeat. */
const wave = (t: number, s: number) =>
  Math.sin(t * 0.31 + s) * 0.6 + Math.sin(t * 0.173 + s * 1.7) * 0.4

function readPalette(el: HTMLElement): Palette {
  const css = getComputedStyle(el)
  const get = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback
  return {
    bg: get('--mz-bg', '#14100e'),
    bgDeep: get('--mz-bg-deep', '#0a0908'),
    ink: get('--mz-ink', '#f7f2e8'),
    ink2: get('--mz-ink-2', '#b9b0a2'),
    ink3: get('--mz-ink-3', '#8a8175'),
    accent: get('--mz-accent', '#d9b34e'),
    gold: get('--mz-gold', '#c9a227'),
    crimson: get('--mz-crimson', '#8b2635'),
  }
}

export class MosaicEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private host: HTMLElement
  private opts: EngineOptions
  private palette: Palette

  private nodes: SimNode[] = []
  private edges: Edge[] = []
  private pulses: Pulse[] = []
  private rings: Ring[] = []
  private byId = new Map<string, number>()
  /** Index of the first ambient cell. Everything before it is labeled. */
  private labeledCount = 0

  private w = 0
  private h = 0
  private dpr = 1
  private cx = 0
  private cy = 0
  private spread = 200
  private compact = false

  private raf = 0
  private running = false
  private paused = false
  private destroyed = false
  private last = 0
  private clock = 0
  private accumulator = 0
  private introStart = 0
  private nextHeartbeat = 3
  private dirty = true

  private pointer = { x: 0, y: 0, inside: false }
  private down: { x: number; y: number; time: number; type: string } | null = null
  private hover: number | null = null
  private pinned: number | null = null
  private external: number | null = null
  private externalRing = false
  private active: number | null = null
  private activeSet = new Set<number>()
  /** The project growing into a panel. Hover and list-hover only; touch uses the sheet. */
  private expanded: number | null = null
  private panelShown = false

  private maxPulses = 16
  private ambientCap = Infinity
  private frameEma = 16
  private slowFor = 0
  private degradeLevel = 0

  private canLetterSpace = false
  private unsubscribers: Array<() => void> = []

  constructor(canvas: HTMLCanvasElement, host: HTMLElement, opts: EngineOptions) {
    this.canvas = canvas
    this.host = host
    this.opts = opts
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) throw new Error('Canvas 2D is unavailable')
    this.ctx = ctx
    this.canLetterSpace = 'letterSpacing' in ctx
    this.palette = readPalette(host)

    this.buildGraph()
    this.resize()
    this.bind()

    /* The simulation starts at rest. The bloom from the centre is a render-time
       interpolation, so the physics never has to untangle a pile of nodes. */
    for (const n of this.nodes) {
      n.x = n.ax
      n.y = n.ay
    }
    this.settle(opts.reducedMotion ? 600 : 240)

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        this.dirty = true
      })
    }
  }

  /* ---------------------------------------------------------------
     Public API
     --------------------------------------------------------------- */

  start() {
    if (this.running || this.destroyed) return
    this.running = true
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  setPaused(paused: boolean) {
    this.paused = paused
    if (paused) this.stop()
    else if (!document.hidden) this.start()
  }

  setPinned(id: string | null) {
    this.pinned = id === null ? null : this.byId.get(id) ?? null
    this.refreshActive()
  }

  /** Highlight from outside the canvas: the DOM list's hover and focus. */
  setExternal(id: string | null, ring = false) {
    this.external = id === null ? null : this.byId.get(id) ?? null
    this.externalRing = ring && this.external !== null
    this.refreshActive()
  }

  /** Ring bursts on the given nodes, e.g. the project nodes after a Back link. */
  pulse(ids: string[], delay = 0) {
    const at = this.clock + delay
    ids.forEach((id, i) => {
      const index = this.byId.get(id)
      if (index === undefined) return
      const n = this.nodes[index]
      n.pings.push(at + i * 0.12, at + i * 0.12 + 0.9)
    })
    this.dirty = true
  }

  destroy() {
    this.destroyed = true
    this.stop()
    this.unsubscribers.forEach((off) => off())
    this.unsubscribers = []
  }

  /* ---------------------------------------------------------------
     Graph construction and layout
     --------------------------------------------------------------- */

  private makeNode(id: string, kind: Kind, label: string, tag: string): SimNode {
    return {
      id,
      kind,
      label,
      tag,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      u: Math.random(),
      v: Math.random(),
      r: 0,
      mass: kind === 'nucleus' ? 4 : kind === 'project' ? 3 : kind === 'concept' ? 1 : 0.5,
      seed: Math.random() * 1000,
      lx: 0,
      ly: 0,
      sx: 0,
      sy: 0,
      focus: 0,
      dim: 0,
      pings: [],
      bloomDelay: 0,
      neighbors: [],
      px: 0,
      py: 0,
      alpha: 1,
      labelAlpha: 1,
      labelHalf: 0,
      color: null,
      expand: 0,
    }
  }

  private buildGraph() {
    const { nodes, edges } = this.opts
    let projectIndex = 0
    let conceptIndex = 0
    for (const item of nodes) {
      const n = this.makeNode(item.id, item.kind, item.label, 'tag' in item ? item.tag : '')
      if (item.kind === 'nucleus') n.bloomDelay = 0
      if (item.kind === 'project') {
        n.bloomDelay = 0.12 + projectIndex++ * 0.07
        n.color = item.color
      }
      if (item.kind === 'concept') n.bloomDelay = 0.42 + conceptIndex++ * 0.05
      this.byId.set(n.id, this.nodes.length)
      this.nodes.push(n)
    }
    this.labeledCount = this.nodes.length

    for (const e of edges) {
      const a = this.byId.get(e.from)
      const b = this.byId.get(e.to)
      if (a === undefined || b === undefined) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[mosaic] Edge ${e.from} → ${e.to} points at an unknown node.`)
        }
        continue
      }
      const color = this.nodes[a].color ?? this.nodes[b].color
      this.edges.push({ a, b, rest: 100, bow: (Math.random() - 0.5) * 0.9, hl: 0, color })
      this.nodes[a].neighbors.push(b)
      this.nodes[b].neighbors.push(a)
    }
  }

  private ambientTarget() {
    const base = this.compact ? this.opts.ambient.mobile : this.opts.ambient.desktop
    return Math.min(base, this.ambientCap)
  }

  private syncAmbient() {
    const want = this.ambientTarget()
    let have = this.nodes.length - this.labeledCount
    while (have < want) {
      const n = this.makeNode(`cell-${have}`, 'ambient', '', '')
      n.r = 0.9 + Math.random() * 1.7
      n.bloomDelay = 0.5 + Math.random() * 0.35
      this.placeAmbient(n)
      n.x = n.ax
      n.y = n.ay
      this.nodes.push(n)
      have++
    }
    if (have > want) this.nodes.length = this.labeledCount + want
  }

  private placeAmbient(n: SimNode) {
    n.ax = 24 + n.u * (this.w - 48)
    n.ay = 24 + n.v * (this.h - 48)
  }

  private layout() {
    const w = this.w
    const h = this.h
    this.compact = w < COMPACT_MAX
    this.syncExpanded()
    const left = w >= INDEX_MIN ? INDEX_INSET : 0
    const top = this.compact ? 168 : 150
    const bottom = this.compact ? 110 : 116
    const availW = w - left
    const availH = Math.max(240, h - top - bottom)
    this.cx = left + availW / 2
    this.cy = top + availH / 2

    const rx = this.compact ? Math.min(availW * 0.29, 150) : Math.min(availW * 0.3, 440)
    const ry = this.compact ? Math.min(availH * 0.38, 240) : Math.min(availH * 0.36, 290)
    this.spread = Math.hypot(rx, ry)

    for (const n of this.nodes) {
      if (n.kind === 'nucleus') n.r = this.compact ? 22 : 30
      if (n.kind === 'project') n.r = this.compact ? 17 : 24
      if (n.kind === 'concept') n.r = this.compact ? 5.5 : 7
    }

    const corners: Array<[number, number]> = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ]
    let p = 0
    for (const n of this.nodes) {
      if (n.kind === 'nucleus') {
        n.ax = this.cx
        n.ay = this.cy
      } else if (n.kind === 'project') {
        const [sx, sy] = corners[p++ % corners.length]
        n.ax = this.cx + sx * rx
        n.ay = this.cy + sy * ry
      }
    }

    /* Concepts start between the things they connect. On wide screens they're
       nudged outward so the middle stays clear for the nucleus; on phones there
       is no room outside the projects, so they tuck inward instead. */
    const concepts = this.nodes.filter((n) => n.kind === 'concept')
    for (const n of concepts) {
      let sx = 0
      let sy = 0
      for (const j of n.neighbors) {
        sx += this.nodes[j].ax
        sy += this.nodes[j].ay
      }
      const k = Math.max(1, n.neighbors.length)
      sx /= k
      sy /= k
      const dx = sx - this.cx
      const dy = sy - this.cy
      const d = Math.hypot(dx, dy) || 1
      const push = this.spread * (this.compact ? -0.14 : 0.12)
      n.ax = sx + (dx / d) * push
      n.ay = sy + (dy / d) * push
    }

    /* Relax concept anchors apart so labels never stack. Pairs that share an
       exact midpoint get split along the perpendicular. */
    const minSep = this.compact ? 104 : 150
    const fixed = this.nodes.filter((n) => n.kind === 'project' || n.kind === 'nucleus')
    for (let iter = 0; iter < 80; iter++) {
      for (let i = 0; i < concepts.length; i++) {
        const a = concepts[i]
        for (let j = i + 1; j < concepts.length; j++) {
          const b = concepts[j]
          const dx = b.ax - a.ax
          const dy = b.ay - a.ay
          let d = Math.hypot(dx, dy)
          let ux = dx / (d || 1)
          let uy = dy / (d || 1)
          if (d < 0.01) {
            const ox = a.ax - this.cx
            const oy = a.ay - this.cy
            const len = Math.hypot(ox, oy) || 1
            ux = -oy / len || 1
            uy = ox / len
            d = 0
          }
          if (d < minSep) {
            const m = ((minSep - d) / 2) * 0.5
            a.ax -= ux * m
            a.ay -= uy * m
            b.ax += ux * m
            b.ay += uy * m
          }
        }
        for (const f of fixed) {
          const dx = a.ax - f.ax
          const dy = a.ay - f.ay
          const d = Math.hypot(dx, dy) || 1
          const sep = minSep * (this.compact ? 1.15 : 0.8)
          if (d < sep) {
            a.ax += (dx / d) * (sep - d) * 0.5
            a.ay += (dy / d) * (sep - d) * 0.5
          }
        }
        const padX = this.compact ? 56 : 90
        a.ax = clamp(a.ax, left + padX, w - padX)
        /* Phones: stay between the two rows of project labels, which span
           nearly the full width. */
        a.ay = this.compact
          ? clamp(a.ay, this.cy - ry + 62, this.cy + ry - 34)
          : clamp(a.ay, this.cy - ry + 78, this.cy + ry - 72)
      }
    }

    /* After the nodes have settled, shift anyone still sitting on the spine.
       Left junctions drop below it, right junctions rise above it. */
    if (!this.compact) {
      for (const a of concepts) {
        if (Math.abs(a.ay - this.cy) < 42) a.ay = this.cy + (a.ax < this.cx ? 48 : -48)
      }
    }

    for (const e of this.edges) {
      const a = this.nodes[e.a]
      const b = this.nodes[e.b]
      e.rest = Math.hypot(a.ax - b.ax, a.ay - b.ay)
    }

    this.syncAmbient()
    for (let i = this.labeledCount; i < this.nodes.length; i++) this.placeAmbient(this.nodes[i])
  }

  private resize = () => {
    const w = Math.max(1, this.host.clientWidth)
    const h = Math.max(1, this.host.clientHeight)
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    this.w = w
    this.h = h
    this.dpr = dpr
    this.canvas.width = Math.round(w * dpr)
    this.canvas.height = Math.round(h * dpr)
    this.canvas.style.width = `${w}px`
    this.canvas.style.height = `${h}px`
    this.layout()
    if (this.opts.reducedMotion) this.settle(300)
    this.dirty = true
    if (!this.running && !this.paused && !this.destroyed) this.render()
  }

  /** Run the simulation without drawing, so a static layout is already at rest. */
  private settle(steps: number) {
    for (let i = 0; i < steps; i++) this.step(STEP, false)
  }

  /* ---------------------------------------------------------------
     Events
     --------------------------------------------------------------- */

  private bind() {
    const on = (target: EventTarget, type: string, fn: EventListener) => {
      target.addEventListener(type, fn)
      this.unsubscribers.push(() => target.removeEventListener(type, fn))
    }

    const ro = new ResizeObserver(() => this.resize())
    ro.observe(this.host)
    this.unsubscribers.push(() => ro.disconnect())

    on(window, 'resize', this.resize as EventListener)

    on(document, 'visibilitychange', () => {
      if (document.hidden) this.stop()
      else if (!this.paused) {
        this.slowFor = 0
        this.start()
      }
    })

    /* The stage may be CSS-scaled (the mobile sheet shrinks it), so map back
       into canvas space rather than trusting raw client offsets. */
    const local = (e: PointerEvent) => {
      const rect = this.canvas.getBoundingClientRect()
      return {
        x: ((e.clientX - rect.left) * this.w) / (rect.width || 1),
        y: ((e.clientY - rect.top) * this.h) / (rect.height || 1),
      }
    }

    on(this.canvas, 'pointermove', ((e: PointerEvent) => {
      const p = local(e)
      this.pointer.x = p.x
      this.pointer.y = p.y
      this.pointer.inside = e.pointerType !== 'touch'
      if (e.pointerType === 'touch') return
      const hit = this.hitTest(p.x, p.y, 0)
      if (hit !== this.hover) {
        this.hover = hit
        this.refreshActive()
      }
      this.canvas.style.cursor = hit === null ? 'default' : 'pointer'
      this.dirty = true
    }) as EventListener)

    on(this.canvas, 'pointerleave', (() => {
      this.pointer.inside = false
      if (this.hover !== null) {
        this.hover = null
        this.refreshActive()
      }
    }) as EventListener)

    on(this.canvas, 'pointerdown', ((e: PointerEvent) => {
      const p = local(e)
      this.down = { x: p.x, y: p.y, time: performance.now(), type: e.pointerType }
    }) as EventListener)

    on(this.canvas, 'pointerup', ((e: PointerEvent) => {
      const start = this.down
      this.down = null
      if (!start) return
      const p = local(e)
      const moved = Math.hypot(p.x - start.x, p.y - start.y)
      if (moved > 12 || performance.now() - start.time > 700) return
      const slop = e.pointerType === 'touch' ? 10 : 0
      const hit = this.hitTest(p.x, p.y, slop)
      if (hit === null) {
        this.ripple(p.x, p.y)
        this.opts.callbacks.onEmptyActivate?.(e.pointerType)
      } else {
        this.opts.callbacks.onNodeActivate?.(this.nodes[hit].id, e.pointerType)
      }
    }) as EventListener)

    on(this.canvas, 'pointercancel', (() => {
      this.down = null
    }) as EventListener)
  }

  private hitTest(x: number, y: number, slop: number): number | null {
    if (this.expanded !== null && this.nodes[this.expanded].expand > 0.2) {
      const r = this.panelBox(this.nodes[this.expanded])
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return this.expanded
    }
    let best: number | null = null
    let bestD = Infinity
    for (let i = 0; i < this.labeledCount; i++) {
      const n = this.nodes[i]
      if (n.labelAlpha < 0.3) continue
      const reach = n.r + (n.kind === 'concept' ? 16 : 12) + slop
      const d = Math.hypot(x - n.px, y - n.py)
      let hit = d <= reach
      if (!hit) {
        const box = this.labelBox(n)
        hit =
          x >= box.x - slop && x <= box.x + box.w + slop && y >= box.y - slop && y <= box.y + box.h + slop
      }
      if (hit && d < bestD) {
        best = i
        bestD = d
      }
    }
    return best
  }

  private labelBox(n: SimNode) {
    const width = n.kind === 'project' ? (this.compact ? 116 : 160) : n.kind === 'nucleus' ? 90 : this.compact ? 100 : 156
    const height = n.kind === 'project' ? 44 : n.kind === 'nucleus' ? 36 : this.compact ? 36 : 22
    return { x: n.px - width / 2, y: n.py + n.r + 6, w: width, h: height }
  }

  /** Where a project's panel settles: centred on its resting spot, kept clear of the header and footer. */
  private panelRect(n: SimNode): Rect {
    const w = PANEL_W
    const h = PANEL_H
    const left = this.w >= INDEX_MIN ? INDEX_INSET + 16 : 16
    return {
      x: clamp(n.ax - w / 2, left, this.w - w - 16),
      y: clamp(n.ay - h / 2, 104, this.h - h - 84),
      w,
      h,
    }
  }

  /** The box actually drawn: the terminal, eased toward its panel. */
  private panelBox(n: SimNode): Rect {
    const from = this.nodeBox(n, 1 + n.focus * 0.06)
    const to = this.panelRect(n)
    const t = easeInOutCubic(n.expand)
    return {
      x: lerp(from.x, to.x, t),
      y: lerp(from.y, to.y, t),
      w: lerp(from.w, to.w, t),
      h: lerp(from.h, to.h, t),
    }
  }

  private syncExpanded() {
    const a = this.active
    const roomy = !this.compact && this.h >= PANEL_H + 190
    const next = a !== null && this.pinned === null && roomy && this.nodes[a].kind === 'project' ? a : null
    if (next === this.expanded) return
    this.expanded = next
    this.opts.callbacks.onExpandChange?.(next === null ? null : this.nodes[next].id)
  }

  private refreshActive() {
    const next = this.pinned ?? this.hover ?? this.external
    this.dirty = true
    if (next === this.active) {
      this.syncExpanded()
      return
    }
    const prev = this.active
    this.active = next
    this.activeSet = new Set<number>()
    if (next !== null) {
      this.activeSet.add(next)
      this.nodes[next].neighbors.forEach((j) => this.activeSet.add(j))
      const n = this.nodes[next]
      /* Hover a junction and every system that uses it answers, nearest first. */
      if (n.kind === 'concept' || n.kind === 'nucleus') {
        n.neighbors.forEach((j) => {
          const m = this.nodes[j]
          const d = Math.hypot(m.x - n.x, m.y - n.y)
          m.pings.push(this.clock + d / 900)
        })
        if (!this.opts.reducedMotion) this.burst(next)
      }
      /* A project sends its own traffic out along every lane it owns. */
      if (n.kind === 'project' && !this.opts.reducedMotion) this.burst(next)
    }
    if (prev !== next) this.opts.callbacks.onActiveChange?.(next === null ? null : this.nodes[next].id)
    this.syncExpanded()
  }

  private burst(from: number) {
    this.edges.forEach((e, i) => {
      if (e.a !== from && e.b !== from) return
      const dir = e.a === from ? 1 : -1
      for (let k = 0; k < 2; k++) {
        this.pulses.push({
          edge: i,
          t: dir === 1 ? -k * 0.18 : 1 + k * 0.18,
          speed: 300 + Math.random() * 90,
          dir,
          hot: true,
        })
      }
    })
  }

  private ripple(x: number, y: number) {
    if (this.opts.reducedMotion) return
    this.rings.push({ x, y, start: this.clock, max: 240, strength: 0.3 })
    for (const n of this.nodes) {
      const dx = n.x - x
      const dy = n.y - y
      const d = Math.hypot(dx, dy) || 1
      if (d > 260) continue
      const f = (1 - d / 260) * (n.kind === 'ambient' ? 380 : 220) / n.mass
      n.vx += (dx / d) * f
      n.vy += (dy / d) * f
    }
  }

  /* ---------------------------------------------------------------
     Simulation
     --------------------------------------------------------------- */

  private step(dt: number, alive: boolean) {
    const t = this.clock
    const nodes = this.nodes
    const drift = alive && !this.opts.reducedMotion
    const count = nodes.length

    const fx = new Float32Array(count)
    const fy = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const n = nodes[i]
      let tx = n.ax
      let ty = n.ay
      let k = 0
      if (n.kind === 'nucleus') {
        k = 9
        if (drift) {
          tx += wave(t, n.seed) * 1.5
          ty += wave(t, n.seed + 3) * 1.5
        }
      } else if (n.kind === 'project') {
        k = 6
        if (drift) {
          tx += wave(t, n.seed) * 2.5
          ty += wave(t, n.seed + 5) * 2.5
        }
      } else if (n.kind === 'concept') {
        k = 4.5
        if (drift) {
          tx += wave(t * 1.3, n.seed) * 2
          ty += wave(t * 1.3, n.seed + 2) * 2
        }
      } else {
        k = 0.35
        if (drift) {
          tx += wave(t * 0.4, n.seed) * 70
          ty += wave(t * 0.4, n.seed + 9) * 70
          fx[i] += wave(t * 1.7, n.seed + 4) * 14
          fy[i] += wave(t * 1.7, n.seed + 7) * 14
        }
      }
      fx[i] += (tx - n.x) * k
      fy[i] += (ty - n.y) * k
      /* Gentle centering keeps a hard ripple from flinging anything away. */
      fx[i] += (this.cx - n.x) * 0.04
      fy[i] += (this.cy - n.y) * 0.04
    }

    for (const e of this.edges) {
      const a = nodes[e.a]
      const b = nodes[e.b]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const d = Math.hypot(dx, dy) || 1
      const f = (d - e.rest) * 1.6
      const ux = dx / d
      const uy = dy / d
      fx[e.a] += (ux * f) / a.mass
      fy[e.a] += (uy * f) / a.mass
      fx[e.b] -= (ux * f) / b.mass
      fy[e.b] -= (uy * f) / b.mass
    }

    const labeled = this.labeledCount
    const repelR = this.compact ? 80 : 130
    for (let i = 0; i < count; i++) {
      const a = nodes[i]
      for (let j = i + 1; j < count; j++) {
        if (i >= labeled && j >= labeled) continue
        const b = nodes[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d2 = dx * dx + dy * dy
        const ambientPair = j >= labeled
        const R = ambientPair ? b.r + a.r + 34 : repelR
        if (d2 > R * R || d2 < 0.0001) continue
        const d = Math.sqrt(d2)
        const s = 1 - d / R
        const f = (ambientPair ? 900 : 420) * s * s
        const ux = dx / d
        const uy = dy / d
        if (!ambientPair) {
          fx[i] -= (ux * f) / a.mass
          fy[i] -= (uy * f) / a.mass
        }
        fx[j] += (ux * f) / b.mass
        fy[j] += (uy * f) / b.mass
      }
    }

    /* An open panel claims its footprint. Anything inside the clear zone is
       shoved out the nearest side, so lanes reroute around it. */
    for (let p = 0; p < labeled; p++) {
      const owner = nodes[p]
      if (owner.kind !== 'project' || owner.expand < 0.01) continue
      const box = this.panelBox(owner)
      const left = box.x - PANEL_CLEAR.x
      const right = box.x + box.w + PANEL_CLEAR.x
      const top = box.y - PANEL_CLEAR.top
      const bottom = box.y + box.h + PANEL_CLEAR.bottom
      const strength = 70 * easeInOutCubic(owner.expand)
      for (let i = 0; i < labeled; i++) {
        if (i === p) continue
        const n = nodes[i]
        if (n.x <= left || n.x >= right || n.y <= top || n.y >= bottom) continue
        const exits: Array<[number, number, number]> = [
          [n.x - left, -1, 0],
          [right - n.x, 1, 0],
          [n.y - top, 0, -1],
          [bottom - n.y, 0, 1],
        ]
        exits.sort((u, v) => u[0] - v[0])
        const [depth, ux, uy] = exits[0]
        fx[i] += (ux * depth * strength) / n.mass
        fy[i] += (uy * depth * strength) / n.mass
      }
    }

    const damping = Math.exp(-3.2 * dt)
    for (let i = 0; i < count; i++) {
      const n = nodes[i]
      n.vx = (n.vx + fx[i] * dt) * damping
      n.vy = (n.vy + fy[i] * dt) * damping
      const speed = Math.hypot(n.vx, n.vy)
      if (speed > 900) {
        n.vx *= 900 / speed
        n.vy *= 900 / speed
      }
      n.x += n.vx * dt
      n.y += n.vy * dt
    }
  }

  private update(dt: number) {
    const reduced = this.opts.reducedMotion
    const t = this.clock
    const intro = reduced ? Infinity : t - this.introStart
    const p = this.pointer
    const leanR = this.compact ? 0 : 220
    let changed = false

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i]
      /* A few pixels of lean, so a route notices the pointer without leaving its lane. */
      let tlx = 0
      let tly = 0
      if (p.inside && !reduced && leanR > 0 && n.kind !== 'ambient' && n.expand < 0.01) {
        const dx = p.x - n.x
        const dy = p.y - n.y
        const d = Math.hypot(dx, dy)
        if (d < leanR && d > 0.001) {
          const s = 1 - d / leanR
          const amt = s * s * (3 - 2 * s)
          const max = 2.5
          tlx = (dx / d) * max * amt
          tly = (dy / d) * max * amt
        }
      }
      n.lx = approach(n.lx, tlx, 5, dt)
      n.ly = approach(n.ly, tly, 5, dt)

      const inSet = this.activeSet.has(i)
      const focusTarget = this.active !== null && inSet ? 1 : 0
      const dimTarget = this.active !== null && !inSet ? 1 : 0
      const nf = approach(n.focus, focusTarget, 9, dt)
      const nd = approach(n.dim, dimTarget, 7, dt)
      if (Math.abs(nf - n.focus) > 0.0005 || Math.abs(nd - n.dim) > 0.0005) changed = true
      n.focus = nf
      n.dim = nd

      if (n.kind === 'project') {
        const target = this.expanded === i ? 1 : 0
        const ne = reduced ? target : approach(n.expand, target, target ? 7 : 10, dt)
        const settled = Math.abs(ne - target) < 0.002 ? target : ne
        if (settled !== n.expand) changed = true
        n.expand = settled
      }

      let bloom = 1
      let fade = 1
      if (intro < INTRO_SECONDS + 1.2) {
        const local = clamp01((intro - n.bloomDelay) / INTRO_SECONDS)
        bloom = easeOutBack(local)
        fade = clamp01(local * 1.8)
        n.labelAlpha = clamp01((local - 0.45) / 0.4)
        changed = true
      } else {
        n.labelAlpha = 1
      }

      n.px = this.cx + (n.x + n.lx - this.cx) * bloom
      n.py = this.cy + (n.y + n.ly - this.cy) * bloom
      n.alpha = fade * (1 - 0.75 * n.dim)

      if (n.pings.length) {
        n.pings = n.pings.filter((start) => t - start < PING_SECONDS)
        changed = true
      }
    }

    for (const e of this.edges) {
      const target = this.active !== null && (e.a === this.active || e.b === this.active) ? 1 : 0
      const next = approach(e.hl, target, 8, dt)
      if (Math.abs(next - e.hl) > 0.0005) changed = true
      e.hl = next
    }

    if (!reduced) {
      this.updatePulses(dt)
      if (t >= this.nextHeartbeat && intro > INTRO_SECONDS + 0.6) {
        this.heartbeat()
        this.nextHeartbeat = t + HEARTBEAT_SECONDS + Math.random() * 2
      }
      this.rings = this.rings.filter((r) => t - r.start < 1.6)
    }

    return changed
  }

  private heartbeat() {
    const index = this.byId.get('nucleus')
    if (index === undefined) return
    this.edges.forEach((e, i) => {
      if (e.a !== index && e.b !== index) return
      if (this.pulses.length >= this.maxPulses + 8) return
      this.pulses.push({ edge: i, t: e.a === index ? 0 : 1, speed: 260, dir: e.a === index ? 1 : -1, hot: false })
    })
  }

  private updatePulses(dt: number) {
    const edges = this.edges
    if (!edges.length) return
    const hotEdges: number[] = []
    edges.forEach((e, i) => {
      if (e.hl > 0.5) hotEdges.push(i)
    })

    if (hotEdges.length && this.pulses.length < this.maxPulses && Math.random() < dt * 3) {
      const edge = hotEdges[Math.floor(Math.random() * hotEdges.length)]
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1
      this.pulses.push({ edge, t: dir === 1 ? 0 : 1, speed: 70 + Math.random() * 40, dir, hot: true })
    }

    const next: Pulse[] = []
    for (const pulse of this.pulses) {
      const e = edges[pulse.edge]
      const pts = this.routeOf(e)
      let len = 0
      for (let i = 0; i < pts.length - 2; i += 2) {
        len += Math.hypot(pts[i + 2] - pts[i], pts[i + 3] - pts[i + 1])
      }
      len = Math.max(40, len)
      const boost = pulse.hot ? 1 : 1 + e.hl * 2.2
      pulse.t += ((pulse.speed * boost) / len) * dt * pulse.dir
      if (pulse.dir === 1 ? pulse.t <= 1 : pulse.t >= 0) next.push(pulse)
    }
    this.pulses = next
  }

  private degrade() {
    if (this.degradeLevel >= 2) return
    this.degradeLevel++
    const current = this.nodes.length - this.labeledCount
    this.ambientCap = Math.max(6, Math.floor(current * 0.5))
    this.maxPulses = Math.max(4, Math.floor(this.maxPulses * 0.5))
    this.syncAmbient()
    if (this.pulses.length > this.maxPulses) this.pulses.length = this.maxPulses
  }

  private tick = (now: number) => {
    if (!this.running) return
    const frameMs = Math.min(250, now - this.last)
    this.last = now
    const dt = Math.min(frameMs, 64) / 1000

    /* Sustained slow frames: thin the crowd. Ignore the intro and the first
       frame after a tab comes back, which are always long. */
    this.frameEma = this.frameEma * 0.9 + frameMs * 0.1
    if (this.clock - this.introStart > INTRO_SECONDS + 1.5 && this.frameEma > SLOW_FRAME_MS) {
      this.slowFor += frameMs
      if (this.slowFor > SLOW_WINDOW_MS) {
        this.degrade()
        this.slowFor = 0
      }
    } else {
      this.slowFor = 0
    }

    this.clock += dt
    if (!this.opts.reducedMotion) {
      this.accumulator += dt
      let guard = 0
      while (this.accumulator >= STEP && guard++ < 4) {
        this.step(STEP, true)
        this.accumulator -= STEP
      }
      if (guard >= 4) this.accumulator = 0
    }

    const changed = this.update(dt)
    if (!this.opts.reducedMotion || changed || this.dirty) {
      this.render()
      this.dirty = false
    }

    this.raf = requestAnimationFrame(this.tick)
  }

  /* ---------------------------------------------------------------
     Drawing
     --------------------------------------------------------------- */

  /** One right-angle turn, the way a lane or a trace changes direction. */
  private routeOf(e: Edge): number[] {
    const a = this.nodes[e.a]
    const b = this.nodes[e.b]
    const dx = b.px - a.px
    const dy = b.py - a.py
    const pts =
      Math.abs(dx) >= Math.abs(dy)
        ? [a.px, a.py, b.px, a.py, b.px, b.py]
        : [a.px, a.py, a.px, b.py, b.px, b.py]
    this.trimEnd(pts, 0, this.clearance(a))
    this.trimEnd(pts, pts.length - 2, this.clearance(b))
    return pts
  }

  private trimEnd(pts: number[], index: number, dist: number) {
    const inward = index === 0 ? 2 : -2
    const x0 = pts[index]
    const y0 = pts[index + 1]
    const x1 = pts[index + inward]
    const y1 = pts[index + inward + 1]
    const len = Math.hypot(x1 - x0, y1 - y0) || 1
    const d = Math.min(dist, len * 0.42)
    pts[index] = x0 + ((x1 - x0) / len) * d
    pts[index + 1] = y0 + ((y1 - y0) / len) * d
  }

  private pointOnRoute(pts: number[], t: number) {
    const segs: Array<[number, number, number, number, number]> = []
    let total = 0
    for (let i = 0; i < pts.length - 2; i += 2) {
      const len = Math.hypot(pts[i + 2] - pts[i], pts[i + 3] - pts[i + 1])
      segs.push([pts[i], pts[i + 1], pts[i + 2], pts[i + 3], len])
      total += len
    }
    let dist = clamp01(t) * total
    for (let s = 0; s < segs.length; s++) {
      const [x0, y0, x1, y1, len] = segs[s]
      if (dist <= len || s === segs.length - 1) {
        const u = len === 0 ? 0 : Math.min(1, dist / len)
        return { x: x0 + (x1 - x0) * u, y: y0 + (y1 - y0) * u, ang: Math.atan2(y1 - y0, x1 - x0) }
      }
      dist -= len
    }
    return { x: pts[0] ?? 0, y: pts[1] ?? 0, ang: 0 }
  }

  private nodeBox(n: SimNode, scale: number) {
    const r = n.r * scale
    if (n.kind === 'project') {
      const side = r * 1.05
      const w = side * 2
      const h = side * 1.28
      return { x: n.px - w / 2, y: n.py - h / 2, w, h }
    }
    if (n.kind === 'nucleus') {
      const side = r * 1.45
      return { x: n.px - side / 2, y: n.py - side / 2, w: side, h: side }
    }
    const side = Math.max(12, r * 2.05)
    return { x: n.px - side / 2, y: n.py - side / 2, w: side, h: side }
  }

  private clearance(n: SimNode) {
    const box = this.nodeBox(n, 1)
    return Math.max(box.w, box.h) / 2 + 5
  }

  private roundRect(x: number, y: number, w: number, h: number, rad: number) {
    const ctx = this.ctx
    const r = Math.min(rad, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }

  /** Crop-mark brackets, the way a title block or a selected module is marked. */
  private cornerMarks(x: number, y: number, half: number, arm: number) {
    const ctx = this.ctx
    ctx.beginPath()
    const signs: Array<[number, number]> = [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]
    for (const [sx, sy] of signs) {
      const cx = x + sx * half
      const cy = y + sy * half
      ctx.moveTo(cx - sx * arm, cy)
      ctx.lineTo(cx, cy)
      ctx.lineTo(cx, cy - sy * arm)
    }
    ctx.stroke()
  }

  private render() {
    const ctx = this.ctx
    const { w, h } = this
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
    ctx.setLineDash([])

    this.drawField(w, h)
    this.drawEdges()
    this.drawPulses()
    this.drawRings()
    this.drawNodes()
    this.drawLabels()
    this.drawPanels()

    const activeNode = this.active === null ? null : this.nodes[this.active]
    this.opts.callbacks.onActiveFrame?.(
      activeNode
        ? {
            x: activeNode.px,
            y: activeNode.py,
            r: activeNode.r,
            reach: Math.max(activeNode.r * 1.45, activeNode.labelHalf),
          }
        : null
    )
  }

  /** Drafting grid and crop marks. The sheet the routes are drawn on. */
  private drawField(w: number, h: number) {
    const ctx = this.ctx
    ctx.fillStyle = this.palette.bg
    ctx.fillRect(0, 0, w, h)

    const step = this.compact ? 28 : 40
    ctx.beginPath()
    ctx.strokeStyle = this.palette.ink
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.05
    for (let x = step; x < w; x += step) {
      ctx.moveTo(x + 0.5, 0)
      ctx.lineTo(x + 0.5, h)
    }
    for (let y = step; y < h; y += step) {
      ctx.moveTo(0, y + 0.5)
      ctx.lineTo(w, y + 0.5)
    }
    ctx.stroke()

    const inset = this.compact ? 12 : 16
    const arm = 9
    const marks: Array<[number, number, number, number]> = [
      [inset, inset, 1, 1],
      [w - inset, inset, -1, 1],
      [inset, h - inset, 1, -1],
      [w - inset, h - inset, -1, -1],
    ]
    ctx.beginPath()
    ctx.globalAlpha = 0.28
    for (const [x, y, sx, sy] of marks) {
      ctx.moveTo(x, y + sy * arm)
      ctx.lineTo(x, y)
      ctx.lineTo(x + sx * arm, y)
    }
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  private strokeRoute(pts: number[]) {
    const ctx = this.ctx
    ctx.beginPath()
    ctx.moveTo(pts[0], pts[1])
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1])
  }

  private drawEdges() {
    const ctx = this.ctx
    const pal = this.palette
    ctx.lineJoin = 'miter'
    ctx.lineCap = 'butt'
    for (const e of this.edges) {
      const a = this.nodes[e.a]
      const b = this.nodes[e.b]
      const trunk = a.kind === 'nucleus' || b.kind === 'nucleus'
      const base = Math.min(a.alpha, b.alpha)
      const pts = this.routeOf(e)
      this.strokeRoute(pts)
      ctx.setLineDash(trunk || e.hl > 0.7 ? [] : [2.5, 4])
      ctx.strokeStyle = pal.ink
      ctx.lineWidth = 1
      ctx.globalAlpha = base * (trunk ? 0.38 : 0.28)
      ctx.stroke()
      if (e.hl > 0.02) {
        ctx.setLineDash([])
        ctx.strokeStyle = e.color ?? pal.accent
        ctx.lineWidth = 1.35
        ctx.globalAlpha = e.hl * 0.95
        ctx.stroke()
      }
    }
    ctx.setLineDash([])
    ctx.globalAlpha = 1
  }

  private drawPulses() {
    const ctx = this.ctx
    const pal = this.palette
    for (const pulse of this.pulses) {
      if (pulse.t < 0 || pulse.t > 1) continue
      const e = this.edges[pulse.edge]
      const a = this.nodes[e.a]
      const b = this.nodes[e.b]
      const hot = pulse.hot || e.hl > 0.5
      const { x, y, ang } = this.pointOnRoute(this.routeOf(e), pulse.t)
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(ang)
      const base = Math.min(a.alpha, b.alpha) * (hot ? 1 : 0.6)
      ctx.fillStyle = e.color ?? pal.accent
      /* A short wake behind the packet shows which way the load is moving. */
      ctx.globalAlpha = base * 0.28
      ctx.fillRect(pulse.dir === 1 ? -22 : 6, -0.75, 16, 1.5)
      ctx.globalAlpha = base
      ctx.fillRect(-6, -1.5, 12, 3)
      ctx.restore()
    }
    ctx.globalAlpha = 1
  }

  private drawRings() {
    const ctx = this.ctx
    ctx.strokeStyle = this.palette.ink
    ctx.lineWidth = 1
    for (const ring of this.rings) {
      const p = clamp01((this.clock - ring.start) / 1.6)
      ctx.globalAlpha = ring.strength * (1 - p) * (1 - p)
      this.cornerMarks(ring.x, ring.y, ring.max * easeOutQuart(p), 11)
    }
    ctx.globalAlpha = 1
  }

  private drawNodes() {
    const ctx = this.ctx
    const pal = this.palette
    const t = this.clock
    const reduced = this.opts.reducedMotion

    for (let i = 0; i < this.labeledCount; i++) {
      const n = this.nodes[i]
      if (n.alpha <= 0.01) continue
      const scale = 1 + n.focus * 0.06
      const box = this.nodeBox(n, scale)
      const hot = n.focus > 0.35
      const tint = n.color ?? pal.accent

      /* An expanding terminal is drawn by drawPanels, above everything else. */
      if (n.expand > 0.001) continue

      ctx.globalAlpha = n.alpha
      ctx.fillStyle = n.kind === 'nucleus' ? pal.bgDeep : pal.bg
      ctx.strokeStyle = hot ? tint : n.kind === 'concept' ? pal.ink2 : pal.ink
      ctx.lineWidth = hot ? 1.6 : 1
      this.roundRect(box.x, box.y, box.w, box.h, n.kind === 'concept' ? 1 : 2.5)
      ctx.fill()
      ctx.stroke()

      if (n.kind === 'nucleus') {
        const inset = 4
        this.roundRect(box.x + inset, box.y + inset, box.w - inset * 2, box.h - inset * 2, 1.5)
        ctx.stroke()
      } else if (n.kind === 'project') {
        ctx.fillStyle = tint
        ctx.globalAlpha = n.alpha * (hot ? 1 : 0.8)
        ctx.fillRect(n.px - 2, n.py - 2, 4, 4)
      } else {
        ctx.strokeStyle = hot ? pal.accent : pal.ink2
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(n.px - 3.5, n.py)
        ctx.lineTo(n.px + 3.5, n.py)
        ctx.moveTo(n.px, n.py - 3.5)
        ctx.lineTo(n.px, n.py + 3.5)
        ctx.stroke()
      }

      for (const start of n.pings) {
        const p = (t - start) / PING_SECONDS
        if (p < 0 || p > 1) continue
        const grow = reduced ? 8 : 3 + easeOutQuart(p) * 18
        ctx.strokeStyle = tint
        ctx.lineWidth = 1.15
        ctx.globalAlpha = (1 - p) * 0.75
        this.cornerMarks(n.px, n.py, Math.max(box.w, box.h) / 2 + grow, 7)
      }

      if (this.externalRing && this.external === i) {
        ctx.save()
        ctx.strokeStyle = tint
        ctx.lineWidth = 1.2
        ctx.globalAlpha = 1
        ctx.setLineDash([3, 4])
        ctx.lineDashOffset = reduced ? 0 : -t * 10
        ctx.strokeRect(box.x - 6, box.y - 6, box.w + 12, box.h + 12)
        ctx.restore()
      }
    }
    ctx.setLineDash([])
    ctx.globalAlpha = 1
  }

  /** Terminals growing into panels. The DOM fills in the content once the frame has room. */
  private drawPanels() {
    const ctx = this.ctx
    const pal = this.palette
    let lead: SimNode | null = null
    for (let i = 0; i < this.labeledCount; i++) {
      const n = this.nodes[i]
      if (n.kind !== 'project' || n.expand <= 0.001) continue
      if (!lead || n.expand > lead.expand) lead = n
      const color = n.color ?? pal.accent
      const { x, y, w, h } = this.panelBox(n)
      const open = easeInOutCubic(n.expand)

      ctx.globalAlpha = n.alpha
      ctx.fillStyle = pal.bg
      ctx.strokeStyle = color
      ctx.lineWidth = 1.4
      this.roundRect(x, y, w, h, lerp(2.5, 3, open))
      ctx.fill()
      ctx.stroke()

      /* The terminal's centre square slides to become the panel's port. */
      ctx.fillStyle = color
      const px = lerp(n.px, x + 20, open)
      const py = lerp(n.py, y + 28, open)
      ctx.fillRect(px - 2, py - 2, 4, 4)

      const arm = lerp(4, 12, open)
      const gap = lerp(3, 7, open)
      ctx.beginPath()
      const corners: Array<[number, number, number, number]> = [
        [x - gap, y - gap, 1, 1],
        [x + w + gap, y - gap, -1, 1],
        [x - gap, y + h + gap, 1, -1],
        [x + w + gap, y + h + gap, -1, -1],
      ]
      for (const [cx, cy, sx, sy] of corners) {
        ctx.moveTo(cx, cy + sy * arm)
        ctx.lineTo(cx, cy)
        ctx.lineTo(cx + sx * arm, cy)
      }
      ctx.lineWidth = 1
      ctx.globalAlpha = n.alpha * open * 0.8
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    if (lead) {
      this.panelShown = true
      this.opts.callbacks.onPanelFrame?.({ id: lead.id, open: easeInOutCubic(lead.expand), ...this.panelRect(lead) })
    } else if (this.panelShown) {
      this.panelShown = false
      this.opts.callbacks.onPanelFrame?.(null)
    }
  }

  private setFont(size: number, weight: number, tracking = 0) {
    const ctx = this.ctx
    ctx.font = `${weight} ${size}px Satoshi, -apple-system, BlinkMacSystemFont, sans-serif`
    if (this.canLetterSpace) {
      ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${tracking}px`
    }
  }

  /** Draws centred text with a background-coloured halo, kept on screen. Returns half its width. */
  private haloText(text: string, at: number, y: number, color: string) {
    const ctx = this.ctx
    const half = ctx.measureText(text).width / 2
    const x = clamp(at, half + 10, this.w - half - 10)
    ctx.strokeStyle = this.palette.bg
    ctx.lineWidth = 6
    ctx.lineJoin = 'round'
    ctx.strokeText(text, x, y)
    ctx.fillStyle = color
    ctx.fillText(text, x, y)
    return half
  }

  private wrap(text: string, maxWidth: number): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let line = ''
    for (const word of words) {
      const next = line ? `${line} ${word}` : word
      if (line && this.ctx.measureText(next).width > maxWidth) {
        lines.push(line)
        line = word
      } else {
        line = next
      }
    }
    if (line) lines.push(line)
    return lines
  }

  private drawLabels() {
    const ctx = this.ctx
    const pal = this.palette
    const compact = this.compact
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'

    for (let i = 0; i < this.labeledCount; i++) {
      const n = this.nodes[i]
      const a = n.labelAlpha * (1 - 0.75 * n.dim) * clamp01(1 - n.expand * 4)
      if (a <= 0.01) continue
      ctx.globalAlpha = a
      const scale = 1 + n.focus * 0.06
      const box = this.nodeBox(n, scale)
      const top = box.y + box.h

      let half = 0
      if (n.kind === 'project') {
        this.setFont(compact ? 15 : 18, 500, -0.2)
        half = this.haloText(n.label, n.px, top + (compact ? 21 : 26), pal.ink)
        this.setFont(compact ? 9.5 : 10.5, 500, compact ? 1.2 : 1.6)
        half = Math.max(
          half,
          this.haloText(n.tag.toUpperCase(), n.px, top + (compact ? 36 : 44), n.color ?? pal.accent)
        )
      } else if (n.kind === 'nucleus') {
        this.setFont(compact ? 13 : 14, 500, 0.2)
        half = this.haloText(n.label, n.px, top + (compact ? 19 : 22), pal.ink)
        this.setFont(9.5, 500, 1.6)
        this.haloText('ABOUT', n.px, top + (compact ? 32 : 36), pal.accent)
      } else {
        this.setFont(compact ? 11 : 12.5, 500, 0.2)
        const color = n.focus > 0.5 ? pal.ink : pal.ink2
        const lines = compact ? this.wrap(n.label, 84) : [n.label]
        lines.forEach((line, k) => {
          half = Math.max(half, this.haloText(line, n.px, top + (compact ? 15 : 18) + k * 13, color))
        })
      }
      n.labelHalf = half
    }
    ctx.globalAlpha = 1
    this.setFont(12, 400, 0)
  }
}

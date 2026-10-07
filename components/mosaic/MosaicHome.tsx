'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import GlitchOverlay from '@/components/GlitchOverlay'
import { usePixelBurst } from './PixelBurst'
import { warmBurst, warmDest } from './mosaicBurst'
import { EMAIL, GITHUB, LINKEDIN, RESUME_URL } from '@/lib/profile'
import {
  AMBIENT,
  CONCEPTS,
  EDGES,
  MOSAIC_COPY,
  MOSAIC_NODES,
  PROJECTS,
  type MosaicNode,
  type ProjectNode,
} from '@/src/data/mosaic'
import { MosaicEngine, type ActiveFrame, type PanelFrame } from './engine'
import AboutPanel, { AboutBody } from './AboutPanel'
import ProjectPanel from './ProjectPanel'
import styles from './Mosaic.module.css'

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
const HINT_DELAY_MS = 3200
const PRIME_MS = 2400
/** Project cards stay compact. Junction notes grow toward a ~62-character measure. */
const CARD_PROJECT_W = 300
const CARD_NOTE_MIN = 360
const CARD_NOTE_MAX = 528

function cardWidthFor(kind: MosaicNode['kind'], text: string) {
  if (kind !== 'concept') return CARD_PROJECT_W
  const t = Math.min(1, Math.max(0, (text.length - 140) / 280))
  return Math.round(CARD_NOTE_MIN + (CARD_NOTE_MAX - CARD_NOTE_MIN) * t)
}

const NODE_BY_ID = new Map(MOSAIC_NODES.map((n) => [n.id, n]))

function projectsFor(id: string): ProjectNode[] {
  const found: ProjectNode[] = []
  for (const e of EDGES) {
    const other = e.from === id ? e.to : e.to === id ? e.from : null
    const node = other ? NODE_BY_ID.get(other) : undefined
    if (node?.kind === 'project') found.push(node)
  }
  return found
}

function joinNames(names: string[]) {
  if (names.length < 2) return names.join('')
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

type Copy = { eyebrow: string; title: string; line: string; href?: string }

function copyFor(node: MosaicNode): Copy {
  if (node.kind === 'project') {
    return { eyebrow: node.tag, title: node.label, line: node.line, href: node.href }
  }
  if (node.kind === 'nucleus') {
    return { eyebrow: node.tag, title: MOSAIC_COPY.name, line: node.line }
  }
  const names = projectsFor(node.id).map((p) => p.label)
  return {
    eyebrow: names.length ? joinNames(names) : 'Junction',
    title: node.label,
    line: node.line ?? `Shows up in ${joinNames(names)}.`,
  }
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function MosaicHome() {
  const router = useRouter()
  const { play } = usePixelBurst()
  const rootRef = useRef<HTMLDivElement>(null)
  const lastPointer = useRef({ x: 0, y: 0 })
  const stageRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<MosaicEngine | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const cardSize = useRef({ w: 0, h: 0 })
  const copyTimer = useRef<ReturnType<typeof setTimeout>>()
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>()
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const panelLead = useRef<string | null>(null)
  const scrollToAbout = useRef(false)

  const [activeId, setActiveId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [primed, setPrimed] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [cardId, setCardId] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [sheetId, setSheetId] = useState<string | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [listView, setListView] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [hint, setHint] = useState<'hidden' | 'shown' | 'done'>('hidden')

  /** Holds the canvas highlight on whatever the touch sheet is showing. */
  const select = useCallback((id: string | null) => {
    engineRef.current?.setHeld(id)
  }, [])

  const navigate = useCallback(
    (href: string, origin?: { x: number; y: number }) => {
      router.prefetch(href)
      if (prefersReducedMotion()) {
        setLeaving(true)
        clearTimeout(leaveTimer.current)
        leaveTimer.current = setTimeout(() => router.push(href), 0)
        return
      }
      const root = rootRef.current
      if (!root) {
        router.push(href)
        return
      }
      engineRef.current?.stop()
      const project = PROJECTS.find((p) => p.href === href)
      const cover = project?.cover ?? project?.frames[0]?.src
      play({
        href,
        sourceRoot: root,
        origin: origin ?? lastPointer.current,
        accent: project?.color,
        dest: project && cover
          ? {
              href,
              label: project.label,
              tag: project.tag,
              surface: project.surface,
              cover,
            }
          : undefined,
      })
    },
    [play, router]
  )

  const openAbout = useCallback(() => {
    if (listView) {
      document.getElementById('list-about')?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      })
      return
    }
    setSheetId(null)
    setAboutOpen(true)
  }, [listView])
  const closeAbout = useCallback(() => setAboutOpen(false), [])

  /* The engine is created once; it calls back through this ref so it always
     sees the latest state without being rebuilt. */
  const handlers = useRef({
    onNodeActivate: (_id: string, _type: string) => {},
    onEmptyActivate: (_type: string) => {},
  })
  handlers.current = {
    onNodeActivate: (id, type) => {
      const node = NODE_BY_ID.get(id)
      if (!node) return
      setHint('done')
      if (node.kind === 'nucleus') {
        select(null)
        openAbout()
        return
      }
      if (type === 'touch') {
        if (sheetId === id && node.kind === 'project') {
          navigate(node.href)
          return
        }
        setSheetId(id)
        select(id)
        return
      }
      if (node.kind === 'project') navigate(node.href)
    },
    onEmptyActivate: () => {
      setSheetId(null)
      select(null)
    },
  }

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const canvas = document.createElement('canvas')
    canvas.className = styles.canvas
    canvas.setAttribute('aria-hidden', 'true')
    stage.appendChild(canvas)

    const reduced = prefersReducedMotion()
    setReduced(reduced)
    let engine: MosaicEngine
    try {
      engine = new MosaicEngine(canvas, stage, {
        nodes: MOSAIC_NODES,
        edges: EDGES,
        ambient: AMBIENT,
        reducedMotion: reduced,
        callbacks: {
          onActiveChange: (id) => {
            setActiveId(id)
            if (id) setCardId(id)
          },
          onNodeActivate: (id, type) => handlers.current.onNodeActivate(id, type),
          onEmptyActivate: (type) => handlers.current.onEmptyActivate(type),
          onActiveFrame: (frame) => placeCard(cardRef.current, cardSize.current, frame),
          onExpandChange: (id) => {
            setExpandedId(id)
            if (id) setPrimed(true)
          },
          onPanelFrame: (frame) => placePanel(panelRefs.current, panelLead, frame),
          onDragChange: (id) => {
            setDragging(id !== null)
            if (id) setHint('done')
          },
        },
      })
    } catch {
      if (canvas.parentNode === stage) stage.removeChild(canvas)
      setListView(true)
      return
    }
    engineRef.current = engine
    engine.start()

    /* Case studies and /art link back with ?section=work. Answer it by
       pinging the four projects once the bloom has landed. */
    const params = new URLSearchParams(window.location.search)
    const section = params.get('section') ?? window.location.hash.replace('#', '')
    if (section === 'work') engine.pulse(PROJECTS.map((p) => p.id), reduced ? 0.1 : 1.5)
    if (section === 'about') {
      const mobile = window.matchMedia('(max-width: 720px), (hover: none)').matches
      if (mobile) {
        scrollToAbout.current = true
        setListView(true)
      } else {
        setAboutOpen(true)
      }
    }
    if (params.has('section') || window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }

    const hintTimer = setTimeout(() => setHint((h) => (h === 'hidden' ? 'shown' : h)), HINT_DELAY_MS)
    const primeTimer = setTimeout(() => setPrimed(true), PRIME_MS)
    /* Download case-study payloads and bake mosaic + dest first-folds before
       anyone clicks, so production doesn't pay for sampling during the burst. */
    PROJECTS.forEach((p) => router.prefetch(p.href))
    const warm = () => {
      if (!stage.isConnected) return
      warmBurst(stage.parentElement ?? stage)
      for (const p of PROJECTS) {
        const cover = p.cover ?? p.frames[0]?.src
        if (!cover) continue
        void warmDest({
          href: p.href,
          label: p.label,
          tag: p.tag,
          surface: p.surface,
          cover,
        })
      }
    }
    const warmTimer = window.setTimeout(warm, 900)
    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(warm, 240)
    }
    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(hintTimer)
      clearTimeout(primeTimer)
      clearTimeout(warmTimer)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      engine.destroy()
      /* Only detach if we still own it. During Strict Mode remounts / HMR, React
         may already have cleared the stage; calling remove() then can throw. */
      if (canvas.parentNode === stage) stage.removeChild(canvas)
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(hover: none)')
    const sync = () => setIsTouch(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      lastPointer.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('pointerdown', onPointer)
    return () => window.removeEventListener('pointerdown', onPointer)
  }, [])

  /* Phones and narrow viewports open in list — the mosaic needs room to breathe. */
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 720px), (hover: none)')
    if (mobile.matches) setListView(true)
  }, [])

  useEffect(() => {
    if (!listView || !scrollToAbout.current) return
    scrollToAbout.current = false
    const id = window.setTimeout(() => {
      document.getElementById('list-about')?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      })
    }, 80)
    return () => clearTimeout(id)
  }, [listView])

  useEffect(() => {
    engineRef.current?.setPaused(listView)
    if (listView) {
      setSheetId(null)
      setAboutOpen(false)
      select(null)
    }
  }, [listView, select])

  useEffect(() => {
    /* Coming back through the bfcache would otherwise show the fade veil. */
    const onShow = () => setLeaving(false)
    window.addEventListener('pageshow', onShow)
    return () => {
      window.removeEventListener('pageshow', onShow)
      clearTimeout(leaveTimer.current)
      clearTimeout(copyTimer.current)
    }
  }, [])

  useEffect(() => {
    if (aboutOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setSheetId(null)
      select(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [aboutOpen, select])

  useEffect(() => {
    if (activeId && hint === 'shown') {
      const t = setTimeout(() => setHint('done'), 1200)
      return () => clearTimeout(t)
    }
  }, [activeId, hint])

  const cardNode = cardId ? NODE_BY_ID.get(cardId) : undefined
  const card = cardNode ? copyFor(cardNode) : null
  const cardWidth = card && cardNode ? cardWidthFor(cardNode.kind, card.line) : CARD_PROJECT_W

  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    cardSize.current = { w: el.offsetWidth, h: el.offsetHeight }
  }, [cardId, cardWidth, card?.line])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  const onProjectLink = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return
    }
    e.preventDefault()
    navigate(href, { x: e.clientX, y: e.clientY })
  }

  const onLeaf = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (prefersReducedMotion()) return
    e.preventDefault()
    setGlitching(true)
  }

  const external = (id: string | null, ring = false) => engineRef.current?.setExternal(id, ring)

  const cardExpanded = cardNode?.kind === 'project' && expandedId === cardNode.id
  const cardVisible =
    Boolean(activeId) && !isTouch && !listView && !aboutOpen && !cardExpanded && !dragging
  const cardUses = cardNode?.kind === 'concept' ? projectsFor(cardNode.id).map((p) => p.label) : []
  const sheetNode = sheetId ? NODE_BY_ID.get(sheetId) : undefined
  const sheet = sheetNode ? copyFor(sheetNode) : null
  const sheetProjects = sheetNode?.kind === 'concept' ? projectsFor(sheetNode.id) : []
  const sheetOpen = Boolean(sheet && isTouch && !listView)

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${listView ? styles.isList : ''} ${
        sheetOpen ? styles.sheetOpen : ''
      }`}
    >
      <div ref={stageRef} className={styles.stage} />
      <div className={styles.vignette} aria-hidden />
      <div className={styles.grain} aria-hidden />

      <header className={styles.header}>
        <div className={styles.brand}>
          <p className={styles.name}>{MOSAIC_COPY.name}</p>
          <p className={styles.role}>{MOSAIC_COPY.role}</p>
        </div>
        <div className={styles.controls}>
          <button type="button" className={styles.chip} onClick={openAbout}>
            About
          </button>
          <button
            type="button"
            className={`${styles.chip} ${listView ? styles.chipOn : ''}`}
            aria-pressed={listView}
            onClick={() => setListView((v) => !v)}
          >
            <span className={styles.chipGlyph} aria-hidden>
              {listView ? '◇' : '☰'}
            </span>
            {listView ? 'Mosaic view' : 'List view'}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.headline}>{MOSAIC_COPY.headline}</h1>

        <div className={styles.directory}>
          <nav className={styles.index} aria-label="Case studies">
            <p className={styles.indexLabel}>Selected work</p>
            <ol className={styles.indexList}>
              {PROJECTS.map((project, i) => (
                <li key={project.id}>
                  <Link
                    href={project.href}
                    className={`${styles.indexItem} ${
                      activeId === project.id ? styles.indexItemOn : ''
                    }`}
                    onClick={(e) => onProjectLink(e, project.href)}
                    onMouseEnter={() => external(project.id)}
                    onMouseLeave={() => external(null)}
                    onFocus={() => external(project.id, true)}
                    onBlur={() => external(null)}
                  >
                    <span className={styles.numeral} aria-hidden>
                      {NUMERALS[i] ?? i + 1}
                    </span>
                    <span className={styles.indexLogo} aria-hidden>
                      <Image src={project.logo} alt="" width={40} height={40} />
                    </span>
                    <span className={styles.indexText}>
                      <span className={styles.indexName}>{project.label}</span>
                      <span className={styles.indexTag}>{project.tag}</span>
                      <span className={styles.indexDates}>{project.dates}</span>
                      <span className={styles.indexLine}>{project.line}</span>
                    </span>
                    <span className={styles.indexArrow} aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <section className={styles.concepts} aria-labelledby="through-lines">
            <h2 id="through-lines" className={styles.indexLabel}>
              Junctions
            </h2>
            <ul className={styles.conceptList}>
              {CONCEPTS.map((concept) => {
                const names = projectsFor(concept.id).map((p) => p.label)
                return (
                  <li key={concept.id}>
                    <button
                      type="button"
                      className={styles.conceptItem}
                      onFocus={() => external(concept.id, true)}
                      onBlur={() => external(null)}
                    >
                      <span className={styles.conceptName}>{concept.label}</span>
                      {concept.line && <span className={styles.conceptLine}>{concept.line}</span>}
                      <span className={styles.conceptUses}>{names.join(' · ')}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          {listView && (
            <section
              id="list-about"
              className={styles.listAbout}
              aria-labelledby="list-about-title"
            >
              <AboutBody titleId="list-about-title" />
            </section>
          )}
        </div>
      </main>

      {!isTouch && (
        <div className={styles.panels} aria-hidden>
          {PROJECTS.map((project) => (
            <ProjectPanel
              key={project.id}
              ref={(el) => {
                panelRefs.current[project.id] = el
              }}
              project={project}
              on={expandedId === project.id && !listView && !aboutOpen}
              primed={primed}
              reducedMotion={reduced}
            />
          ))}
        </div>
      )}

      {card && (
        <div
          ref={cardRef}
          className={`${styles.card} ${cardNode?.kind === 'concept' ? styles.cardNote : ''} ${
            cardVisible ? styles.cardOn : ''
          }`}
          style={{ width: cardWidth }}
          aria-hidden
        >
          <div key={cardId} className={styles.cardBody}>
            <p className={styles.cardEyebrow}>{card.eyebrow}</p>
            <p className={styles.cardTitle}>{card.title}</p>
            <p className={styles.cardLine}>{card.line}</p>
            {cardNode?.kind === 'concept' ? (
              <div className={styles.cardFoot}>
                <span className={styles.cardUses}>{cardUses.join(' · ')}</span>
                <span className={styles.cardDrag}>
                  <DragGlyph />
                  Drag to move
                </span>
              </div>
            ) : (
              <p className={styles.cardHint}>
                {cardNode?.kind === 'project' ? 'Open case study →' : 'Click to read more'}
              </p>
            )}
          </div>
        </div>
      )}

      {sheetOpen && sheet && sheetNode && (
        <div
          key={sheetNode.id}
          className={styles.sheet}
          role="dialog"
          aria-modal="false"
          aria-labelledby="sheet-title"
        >
          <button
            type="button"
            className={styles.sheetClose}
            onClick={() => {
              setSheetId(null)
              select(null)
            }}
          >
            <span aria-hidden>×</span>
            <span className={styles.srOnly}>Close</span>
          </button>
          <p className={styles.cardEyebrow}>{sheet.eyebrow}</p>
          <p id="sheet-title" className={styles.sheetTitle}>
            {sheet.title}
          </p>
          <p className={styles.sheetLine}>{sheet.line}</p>
          {sheet.href && (
            <button type="button" className={styles.primary} onClick={() => navigate(sheet.href!)}>
              Open case study <span aria-hidden>→</span>
            </button>
          )}
          {sheetProjects.length > 0 && (
            <ul className={styles.sheetLinks}>
              {sheetProjects.map((p) => (
                <li key={p.id}>
                  <button type="button" className={styles.sheetLink} onClick={() => navigate(p.href)}>
                    <span>{p.label}</span>
                    <span className={styles.sheetLinkTag}>{p.tag}</span>
                    <span aria-hidden>→</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p
        className={`${styles.hint} ${hint === 'shown' && !listView ? styles.hintOn : ''}`}
        aria-hidden
      >
        {isTouch
          ? 'Tap a junction to read it. Drag to rearrange.'
          : 'Hover a junction to read it. Drag to rearrange.'}
      </p>

      <footer className={styles.bar}>
        <Link href="/art" className={styles.leaf} onClick={onLeaf} aria-label="A leaf. Follow it.">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fall-leaf.svg" alt="" draggable={false} />
        </Link>
        <div className={styles.links}>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
            Résumé
          </a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className={styles.link}>
            LinkedIn
          </a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className={styles.link}>
            GitHub
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className={`${styles.email} ${copied ? styles.emailCopied : ''}`}
            aria-label={copied ? 'Email address copied' : `Copy email address ${EMAIL}`}
          >
            <span className={styles.emailFull}>{copied ? 'Copied' : EMAIL}</span>
            <span className={styles.emailShort}>{copied ? 'Copied' : 'Email'}</span>
            <span className={styles.emailHint} aria-hidden>
              {copied ? '✓' : 'Copy'}
            </span>
          </button>
          <span className={styles.srOnly} role="status" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
        </div>
      </footer>

      {aboutOpen && <AboutPanel onClose={closeAbout} />}

      <div className={`${styles.veil} ${leaving ? styles.veilOn : ''}`} aria-hidden />
      {glitching && <GlitchOverlay />}
    </div>
  )
}

function DragGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M6 1v10M1 6h10M6 1 4.5 2.5M6 1l1.5 1.5M6 11l-1.5-1.5M6 11l1.5-1.5M1 6l1.5-1.5M1 6l1.5 1.5M11 6 9.5 4.5M11 6 9.5 7.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function placeCard(
  card: HTMLDivElement | null,
  size: { w: number; h: number },
  frame: ActiveFrame | null
) {
  if (!card || !frame) return
  const vw = window.innerWidth
  const vh = window.innerHeight
  const w = card.offsetWidth || size.w
  const h = card.offsetHeight || size.h
  const gap = frame.reach + 18
  /* Wide notes prefer the open side of the sheet so they don't sit on a case study. */
  const preferLeft = frame.x > vw * 0.52
  let x = preferLeft ? frame.x - gap - w : frame.x + gap
  if (x + w > vw - 20) x = frame.x - gap - w
  if (x < 16) x = frame.x + gap
  x = Math.max(16, Math.min(x, vw - w - 16))
  const y = Math.min(Math.max(84, frame.y - h / 2), vh - h - 96)
  card.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`
}

/** Content appears only in the last stretch of the grow, once the frame around it has room. */
function placePanel(
  panels: Record<string, HTMLDivElement | null>,
  lead: { current: string | null },
  frame: PanelFrame | null
) {
  const nextId = frame?.id ?? null
  if (lead.current && lead.current !== nextId) {
    const prev = panels[lead.current]
    if (prev) prev.style.opacity = '0'
  }
  lead.current = nextId
  if (!frame) return
  const el = panels[frame.id]
  if (!el) return
  const reveal = Math.min(1, Math.max(0, (frame.open - 0.72) / 0.28))
  const lift = (1 - reveal) * 6
  el.style.transform = `translate3d(${Math.round(frame.x)}px, ${Math.round(frame.y + lift)}px, 0)`
  el.style.opacity = reveal.toFixed(3)
}

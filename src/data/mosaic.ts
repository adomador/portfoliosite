/**
 * Everything the living mosaic says lives here. Edit this file, not the
 * animation code in components/mosaic.
 *
 * Every edge must point at an `id` that exists below. Unknown ids are skipped.
 */

import { HEADLINE, NAME, ROLE } from '@/lib/profile'

export type ProjectFrame = { src: string; caption: string }

export type ProjectNode = {
  id: string
  kind: 'project'
  label: string
  /** Role on the engagement. Shown under the name in Selected work and on the sheet. */
  tag: string
  /** Tenure, shown under the role in Selected work. */
  dates: string
  /** One-line result, shown in the hover card and the list view. */
  line: string
  href: string
  logo: string
  /** Brand color: the node's traffic, highlights and expanded panel all use it. */
  color: string
  /** Case-study page background. */
  surface: string
  /** Screens the expanded node cycles through on hover. Three reads best. */
  frames: ProjectFrame[]
}

export type ConceptNode = {
  id: string
  kind: 'concept'
  label: string
  /** Shown in the hover card, which widens to fit longer copy. */
  line?: string
}

export type NucleusNode = {
  id: string
  kind: 'nucleus'
  label: string
  tag: string
  line: string
}

export type MosaicNode = ProjectNode | ConceptNode | NucleusNode

export type MosaicEdge = { from: string; to: string }

export const MOSAIC_COPY = {
  name: NAME,
  role: ROLE,
  headline: HEADLINE,
} as const

/**
 * Projects sit in the four corners. Junctions are placed between the
 * projects they connect, so shared logic reads as a route, not a slogan.
 */
export const PROJECTS: ProjectNode[] = [
  {
    id: 'fleetworthy',
    kind: 'project',
    label: 'Fleetworthy',
    tag: 'Senior Product Designer',
    dates: '2025 – Present',
    line: '700+ qualified upsell leads. Vehicle connection is at 40%.',
    href: '/work/fleetworthy',
    logo: '/work/FW.svg',
    color: '#ef444a',
    surface: '#101114',
    frames: [
      {
        src: '/work/fleetworthy/account-switchers.png',
        caption: 'Account hierarchy, three levels',
      },
    ],
  },
  {
    id: 'triumph',
    kind: 'project',
    label: 'Triumph Financial',
    tag: 'Product Designer',
    dates: '2022 – 2025',
    line: 'Cut chat handle time from 8:52 to 4:32.',
    href: '/work/triumph',
    logo: '/work/TriumphFAV2.svg',
    color: '#1fa8c9',
    surface: '#101114',
    frames: [
      { src: '/work/triumph/hero-global-search.png', caption: 'Invoice, payor and factoring on one screen' },
      { src: '/work/triumph/experience-map.png', caption: 'Every profile switch behind one payment question' },
      { src: '/work/triumph/search-results.png', caption: 'One lookup, no impersonating the customer' },
    ],
  },
  {
    id: 'diezl',
    kind: 'project',
    label: 'Diezl',
    tag: 'Founder',
    dates: '2025 – Present',
    line: 'Shipped alone. 406 installs, 901 loads evaluated.',
    href: '/work/diezl',
    logo: '/work/Diezl.svg',
    color: '#f06b06',
    surface: '#101114',
    frames: [
      { src: '/work/diezl-voice-input.png', caption: 'Paste the load message or say it out loud' },
      { src: '/work/diezl-profit-margin.png', caption: 'Profit first, then where the truck ends up' },
      { src: '/work/diezl-cost-breakdown.png', caption: 'Show me the math: fuel, weight, terrain' },
    ],
  },
  {
    id: 'trochi',
    kind: 'project',
    label: 'Trochi',
    tag: 'Freelance Product Designer',
    dates: '2025 – Present',
    line: 'An MVP concept that became the pitch to prospective cooperative members.',
    href: '/work/trochi',
    logo: '/work/Trochi.svg',
    color: '#5abf91',
    surface: '#16181d',
    frames: [
      { src: '/work/Trochi.png', caption: 'A lane rate with its confidence beside it' },
      { src: '/work/trochi/screen-1.svg', caption: 'The day opens on a market briefing' },
      { src: '/work/trochi/screen-2.svg', caption: 'Search as the filter. Find lanes by intent' },
    ],
  },
]

export const CONCEPTS: ConceptNode[] = [
  {
    id: 'systems-thinking',
    kind: 'concept',
    label: 'Systems thinking',
    line: 'In freight, almost nothing happens in isolation. An expired registration, a weigh station pull-in and a toll bill can all trace back to the same truck. So before I design a screen, I map how the pieces connect and find what everything hangs off of. At Fleetworthy, that was the vehicle. Unifying four products around it meant one record, one set of permissions, and one place to see what needed attention, while each product kept its own backend.',
  },
  {
    id: 'initiative',
    kind: 'concept',
    label: 'Initiative & ownership',
    line: 'I like early, ambiguous problems where nobody has told me what to build yet. I use the latest tools to get from idea to working code fast, and I know when to move fast and when to slow down. I solo-built an entire native mobile application, Diezl, that currently helps over 400 owner operators make better decisions.',
  },
  {
    id: 'love-the-problem',
    kind: 'concept',
    label: 'Love the Problem',
    line: "Solutions, no matter how elegant, fall flat when they solve the wrong problem. That's why I dive into understanding how people actually work before deciding what to build. At Triumph, six 90-minute sessions shadowing support agents showed they were jumping between customer profiles just to find basic information. We built one search that pulled it all together, and chat handle time dropped 49%.",
  },
  {
    id: 'details',
    kind: 'concept',
    label: 'Sweating the details',
    line: 'I care a lot about craft, especially in enterprise tools where people stare at dense data all day. A screen can be beautiful and but difficult to read, and getting that balance right is most of the work. In Trochi, every surface leads with a plain-language takeaway and the number a broker actually needs, the rate, is always the biggest thing on the screen.',
  },
]

export const NUCLEUS: NucleusNode = {
  id: 'nucleus',
  kind: 'nucleus',
  label: 'Alfredo',
  tag: ROLE,
  line: 'Open to read more about me.',
}

export const EDGES: MosaicEdge[] = [
  { from: 'systems-thinking', to: 'fleetworthy' },

  { from: 'initiative', to: 'fleetworthy' },
  { from: 'initiative', to: 'diezl' },
  { from: 'initiative', to: 'trochi' },

  { from: 'love-the-problem', to: 'fleetworthy' },
  { from: 'love-the-problem', to: 'triumph' },
  { from: 'love-the-problem', to: 'diezl' },

  { from: 'details', to: 'triumph' },
  { from: 'details', to: 'fleetworthy' },
  { from: 'details', to: 'diezl' },
  { from: 'details', to: 'trochi' },

  { from: 'nucleus', to: 'triumph' },
  { from: 'nucleus', to: 'trochi' },
  { from: 'nucleus', to: 'diezl' },
  { from: 'nucleus', to: 'fleetworthy' },
]

/** Spare pads on the sheet. Kept at zero so the field stays a diagram, not a starfield. */
export const AMBIENT = {
  desktop: 0,
  mobile: 0,
} as const

export const MOSAIC_NODES: MosaicNode[] = [NUCLEUS, ...PROJECTS, ...CONCEPTS]

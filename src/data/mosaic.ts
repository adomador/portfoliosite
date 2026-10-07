/**
 * Everything the living mosaic says lives here. Edit this file, not the
 * animation code in components/mosaic.
 *
 * Every edge must point at an `id` that exists below. Unknown ids are skipped.
 */

import { HEADLINE, NAME } from '@/lib/profile'

export type ProjectNode = {
  id: string
  kind: 'project'
  label: string
  tag: string
  /** One-line result, shown in the hover card and the list view. */
  line: string
  href: string
  logo: string
}

export type ConceptNode = {
  id: string
  kind: 'concept'
  label: string
  /** Optional. When unset, the card lists the projects this concept connects to. */
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
  role: 'Product Designer & Builder',
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
    tag: 'Research & product design',
    line: '700+ sales-qualified upsell leads from one connected view.',
    href: '/work/fleetworthy',
    logo: '/work/FW.svg',
  },
  {
    id: 'triumph',
    kind: 'project',
    label: 'Triumph',
    tag: 'Research & design',
    line: 'Cut chat handle time from 8:52 to 4:32.',
    href: '/work/triumph',
    logo: '/work/TriumphFAV2.svg',
  },
  {
    id: 'diezl',
    kind: 'project',
    label: 'Diezl',
    tag: 'Solo design & build',
    line: 'Shipped alone. 406 installs, 901 loads evaluated.',
    href: '/work/diezl',
    logo: '/work/Diezl.svg',
  },
  {
    id: 'trochi',
    kind: 'project',
    label: 'Trochi',
    tag: '0 to 1 product design',
    line: 'An MVP concept that became the pitch to prospective cooperative members.',
    href: '/work/trochi',
    logo: '/work/Trochi.svg',
  },
]

export const CONCEPTS: ConceptNode[] = [
  {
    id: 'shared-key',
    kind: 'concept',
    label: 'Shared key',
    line: 'Triumph pulls the invoice, the payor, and factoring from one lookup. Fleetworthy hangs tolls, bypass, safety, and compliance off one vehicle.',
  },
  {
    id: 'the-lane',
    kind: 'concept',
    label: 'The lane',
    line: 'Diezl prices the whole move, including where the truck ends. Trochi searches by lane and shows how solid the rate is.',
  },
  {
    id: 'threshold',
    kind: 'concept',
    label: 'Set a threshold',
    line: 'Fleetworthy only promotes an insight when fleet share or dollars per truck cross a line. Diezl leads with profit and keeps the breakdown one tap away.',
  },
  {
    id: 'show-inputs',
    kind: 'concept',
    label: 'Show the inputs',
    line: 'Fleetworthy puts cause, cost, and the action on the same row. Diezl opens the cost math. Trochi will not show a rate without a confidence.',
  },
  {
    id: 'person-closes',
    kind: 'concept',
    label: 'A person closes',
    line: 'Fleetworthy suggests and waits. Diezl returns take or pass; the driver still decides. Triumph assembles the record; the agent still answers.',
  },
]

export const NUCLEUS: NucleusNode = {
  id: 'nucleus',
  kind: 'nucleus',
  label: 'Alfredo',
  tag: 'Product Designer & Builder',
  line: 'The same moves show up in every system here. Open to read more about me.',
}

export const EDGES: MosaicEdge[] = [
  { from: 'shared-key', to: 'triumph' },
  { from: 'shared-key', to: 'fleetworthy' },

  { from: 'the-lane', to: 'trochi' },
  { from: 'the-lane', to: 'diezl' },

  { from: 'threshold', to: 'fleetworthy' },
  { from: 'threshold', to: 'diezl' },

  { from: 'show-inputs', to: 'fleetworthy' },
  { from: 'show-inputs', to: 'diezl' },
  { from: 'show-inputs', to: 'trochi' },

  { from: 'person-closes', to: 'fleetworthy' },
  { from: 'person-closes', to: 'diezl' },
  { from: 'person-closes', to: 'triumph' },

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

/**
 * Everything the homepage says about you lives here.
 * Edit this file, not the section components.
 */

export const NAME = 'Alfredo Domador'
export const ROLE = 'Product Designer & Builder'
export const LOCATION = 'Pennsylvania'
export const EMAIL = 'alfredo.domador13@gmail.com'
export const LINKEDIN = 'https://www.linkedin.com/in/adomador13/'
export const GITHUB = 'https://github.com/adomador'
export const RESUME_URL =
  'https://www.dropbox.com/scl/fi/yonshebxqboon6p12u4ik/Domador_Alfredo_Resume_2026.pdf?rlkey=6mvifz3mmb4ornjde3stjkfsv&st=g1c0hajh&dl=0'

/** The hero line. `emphasis` renders in italic serif and picks up the gold accent. */
export const HEADLINE = {
  before: 'I design and build software for the industries the rest of tech ',
  emphasis: 'overlooks',
  after: '.',
}

export const INTRO =
  "Designer and builder with 5+ years of experience. I'm drawn to ambiguous problems and the challenge of creating something from nothing. For the last three years I've been working in freight tech, building for one of the most complex and underserved industries in the world."

export const APPROACH_LEAD =
  'Three things I keep coming back to, whatever the problem turns out to be.'

export const PRINCIPLES = [
  {
    n: '01',
    title: 'Start inside the ambiguity',
    body: "The good problems never arrive well-defined. I go find the shape of one before anybody opens a design file — because the framing decides the outcome far more than the pixels do.",
  },
  {
    n: '02',
    title: 'Design by building',
    body: 'A rough thing running in a browser tells you more in an afternoon than a perfect mockup tells you in a week. I prototype in code, put it in front of people, and let the work argue for itself.',
  },
  {
    n: '03',
    title: 'Go where the leverage is',
    body: 'Complex, unglamorous, underserved industries are where design still moves the needle the most. Freight taught me that, and I keep looking for the next place it is true.',
  },
]

export type Project = {
  id: string
  company: string
  logo: string
  /** Right-aligned monospace meta — the scope of the engagement. */
  scope: string
  /** One or two sentences. Keep it concrete. */
  summary: string
  href?: string
  /** Shown instead of a link when there's nothing to open yet. */
  status?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'diezl',
    company: 'Diezl',
    logo: '/work/Diezl.svg',
    scope: 'Solo project · Design & Build',
    summary:
      'Designed, built and shipped end to end, on my own. Research through interface through production code.',
    href: 'https://www.diezlapp.com',
  },
  {
    id: 'triumph',
    company: 'Triumph',
    logo: '/work/TriumphFAV2.svg',
    scope: 'End-to-end design & research',
    summary:
      'Owned the full arc of the work: discovery and research, interaction design, and the details that survive contact with real users.',
    href: '/work/triumph',
  },
  {
    id: 'trochi',
    company: 'Trochi',
    logo: '/work/Trochi.svg',
    scope: '0 → 1 MVP',
    summary:
      'Took a product from an idea to a shipped MVP — defining the scope, the shape and the first version worth putting in front of customers.',
    href: '/work/trochi',
  },
  {
    id: 'fleetworthy',
    company: 'Fleetworthy',
    logo: '/work/FW.svg',
    scope: 'Product design',
    summary: 'Compliance and safety tooling for fleets.',
    status: 'Case study in progress',
  },
]

export const TOOLS: Array<{ name: string; icon: string; invertOnDark?: boolean }> = [
  { name: 'Figma', icon: '/Figma-logo.svg' },
  { name: 'Cursor', icon: '/cursor-icon.svg' },
  { name: 'Claude', icon: '/anthropic-1.svg' },
  { name: 'GitHub', icon: '/Octicons-mark-github.svg', invertOnDark: true },
  { name: 'Notion', icon: '/notion-logo.svg' },
  { name: 'Miro', icon: '/miro-logo.svg' },
]

export const CHESS_LINKS = [
  {
    label: 'Chess.com',
    href: 'https://www.chess.com/member/williammontagueiv',
    icon: '/chesscom.svg',
  },
  { label: 'Lichess', href: 'https://lichess.org/@/WilliamHarvey', icon: '/lichess.svg' },
]

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

export const HEADLINE =
  'I design and build software for messy, underserved industries.'

export const INTRO =
  "Designer & builder based in Pennsylvania with 5+ years of experience. I'm drawn to ambiguous problems and the challenge of creating something from nothing. For the last three years I've been working in freight tech, building for one of the most complex industries in the world."

export const ENDORSEMENTS = [
  {
    quote:
      'I managed Alfredo at TriumphPay and highly recommend him as a UX designer or researcher. His design craft and diligence in learning new skills are top notch.',
    author: 'Rob Daffin',
    role: 'UX Manager - Triumph Financial',
  },
  {
    quote:
      'Alfredo consistently impresses with his ability to lead in end-to-end research and design efforts. That combined skillset of user research and design thinking has been invaluable, allowing us to translate user needs seamlessly into experiences that achieve business goals and deliver delightful user experiences. Working with him has been a pleasure, and I wholeheartedly recommend him for any design leadership role.',
    author: 'Kyle LeGrand',
    role: 'Group Product Manager - Triumph Financial',
  },
  {
    quote:
      'Alfredo has overachieved in all aspects in from ideation to production throughout product life cycles within the business vertical he supports including the support of research.',
    author: 'John Szrejter',
    role: 'Lead UX Researcher - Ex Google, Meta, JP Morgan, Triumph',
  },
] as const

/** Hero outcome metrics — keep labels short; the number does the talking. */
export const METRICS = [
  { value: '127%', label: 'Conversion lift' },
  { value: '$530K', label: 'ARR retained' },
  { value: '5–7%', label: 'Cost reduction' },
] as const

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
      'Solo designed, built and shipped end to end. Research through interface through production code with actual paying customers.',
    href: 'https://www.diezlapp.com',
  },
  {
    id: 'triumph',
    company: 'Triumph',
    logo: '/work/TriumphFAV2.svg',
    scope: 'End-to-end design & research',
    summary:
      'Owned the full product & dev lifecycle: discovery and research, interaction design, and the details that survive contact with real users.',
    href: '/work/triumph',
  },
  {
    id: 'trochi',
    company: 'Trochi',
    logo: '/work/Trochi.svg',
    scope: '0 → 1 MVP',
    summary:
      'Transformed an idea into a shipped MVP by defining the scope, the shape and the first version worth putting in front of customers.',
    href: '/work/trochi',
  },
  {
    id: 'fleetworthy',
    company: 'Fleetworthy',
    logo: '/work/FW.svg',
    scope: 'Product design',
    summary: 'Unifying a suite of powerful, but siloed, software products for fleets that want to win more business.',
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

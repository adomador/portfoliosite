'use client'

import styles from './VertigoSpiral.module.css'

/**
 * Generates an Archimedean spiral path (r = a + b*θ) for SVG.
 * Slightly irregular spacing for a hand-drawn, poster-like feel.
 */
function buildSpiralPath(
  cx: number,
  cy: number,
  turns: number,
  innerRadius: number,
  outerRadius: number,
  stepsPerTurn: number = 24
): string {
  const points: string[] = []
  const totalSteps = Math.floor(turns * stepsPerTurn)
  const angleStep = (2 * Math.PI * turns) / totalSteps

  for (let i = 0; i <= totalSteps; i++) {
    const t = i / totalSteps
    // Slight irregularity: vary radius with a small sine so lines aren't perfectly uniform
    const irregular = 1 + 0.03 * Math.sin(i * 0.7)
    const r = (innerRadius + (outerRadius - innerRadius) * t) * irregular
    const angle = angleStep * i
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }

  return points.length > 0 ? `M ${points[0]} L ${points.slice(1).join(' L ')}` : ''
}

const VIEWBOX = { w: 100, h: 100 }
const CX = VIEWBOX.w / 2
const CY = VIEWBOX.h / 2
const INNER = 4
const OUTER = 46
const TURNS = 5

export default function VertigoSpiral() {
  const spiralPath = buildSpiralPath(CX, CY, TURNS, INNER, OUTER)

  return (
    <div className={styles.wrapper} data-vertigo-spiral aria-hidden>
      <div className={styles.glow} data-vertigo-glow aria-hidden />
      <svg
        className={styles.spiral}
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="spiral-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Reddish-orange circle (poster background) */}
        <circle
          cx={CX}
          cy={CY}
          r={OUTER + 2}
          fill="var(--vertigo-bg)"
          className={styles.bg}
        />
        {/* Central ellipse (poster center) */}
        <ellipse
          cx={CX}
          cy={CY}
          rx={INNER + 2}
          ry={INNER + 4}
          fill="var(--vertigo-bg)"
          className={styles.center}
        />
        {/* White spiral line */}
        <path
          d={spiralPath}
          className={styles.path}
          stroke="var(--vertigo-stroke)"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#spiral-glow)"
        />
      </svg>
    </div>
  )
}

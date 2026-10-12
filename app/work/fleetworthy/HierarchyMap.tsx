import styles from './HierarchyMap.module.css'

const LEVELS = [
  {
    title: 'Global Account Switcher',
    detail: 'Select a mapped set (root accounts across products)',
    where: 'Shell header · all Command Center screens',
  },
  {
    title: 'Account Filter',
    detail: 'Pick root account(s) within the mapped set',
    where: 'Per screen · multi-select (Dashboard), single (MFE)',
  },
  {
    title: 'Sub-Filters',
    detail: 'Filter within one root account (not account selectors)',
  },
] as const

const BRANCHES = [
  { title: 'Toll', lines: ['Cost center', 'Groups vehicles & reporting'] },
  { title: 'Compliance', lines: ['Entity / Location', 'Infinite nested tree'] },
  { title: 'Bypass / Safety', lines: ['Groups', 'Vehicles, drivers, reporting'] },
] as const

function Stem() {
  return (
    <svg className={styles.stem} viewBox="0 0 16 28" fill="none" aria-hidden="true">
      <path d="M8 0v18" />
      <path d="M3.5 15.5 8 21l4.5-5.5" />
    </svg>
  )
}

export default function HierarchyMap() {
  return (
    <div className={styles.map}>
      <div className={styles.spine}>
        {LEVELS.map((level, index) => (
          <div className={styles.step} key={level.title}>
            <article className={styles.card} tabIndex={0}>
              <span className={styles.rail} aria-hidden="true" />
              <p className={styles.level}>Level {index + 1}</p>
              <h4 className={styles.title}>{level.title}</h4>
              <p className={styles.detail}>{level.detail}</p>
              {'where' in level && <p className={styles.where}>{level.where}</p>}
            </article>
            {index < LEVELS.length - 1 && <Stem />}
          </div>
        ))}
      </div>

      <Stem />

      <div className={styles.fork}>
        {BRANCHES.map((branch) => (
          <div className={styles.branch} key={branch.title}>
            <article className={`${styles.card} ${styles.leaf}`} tabIndex={0}>
              <span className={styles.rail} aria-hidden="true" />
              <h4 className={styles.title}>{branch.title}</h4>
              <ul className={styles.lines}>
                {branch.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          </div>
        ))}
      </div>

      <p className={styles.note}>
        Scope narrows top → bottom. Switcher shows root-level accounts only — never child
        entities, locations, cost centers, or groups. Restricted accounts appear (greyed) at Level
        1 only.
      </p>
    </div>
  )
}

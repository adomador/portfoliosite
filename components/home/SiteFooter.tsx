import { NAME } from '@/lib/profile'
import styles from './SiteFooter.module.css'

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.ground} aria-hidden />
      <div className={`u-shell ${styles.inner}`}>
        <hr className="u-horizon" />
        <div className={styles.row}>
          <span className={styles.name}>{NAME}</span>
          <span className={styles.note}>
            Designed &amp; built by me — the leaf falls all the way down.
          </span>
          <span className={styles.year}>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}

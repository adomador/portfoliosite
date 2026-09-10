import styles from './Atmosphere.module.css'

/**
 * Everything behind the content: the interpolated surface colour, a sun that
 * sinks and reddens as you scroll, drifting haze, film grain and a vignette
 * that closes in as night falls. All of it is driven by the `--p` scroll
 * variable set in NightfallContext, so there is no JS in here at all.
 */
export default function Atmosphere() {
  return (
    <div className={styles.atmosphere} aria-hidden>
      <div className={styles.surface} />
      <div className={styles.sun}>
        <div className={styles.sunCore} />
      </div>
      <div className={styles.haze} />
      <div className={styles.depth} />
      <div className={styles.vignette} />
      <div className={styles.grain} />
    </div>
  )
}

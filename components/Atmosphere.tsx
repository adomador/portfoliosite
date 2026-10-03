import styles from './Atmosphere.module.css'

/**
 * Everything behind the content: a day sky that ripens toward golden hour, a
 * night sky that slams over it when the sun drops at the Work section, stars,
 * a horizon flare on impact, film grain and a vignette. All of it is driven by
 * CSS variables set in NightfallContext, so there is no JS in here at all.
 */
export default function Atmosphere() {
  return (
    <div className={styles.atmosphere} aria-hidden>
      <div className={styles.surface} />
      <div className={styles.haze} />
      <div className={styles.nightSky}>
        <div className={styles.stars} />
      </div>
      <div className={styles.sun}>
        <div className={styles.sunBody}>
          <div className={styles.sunCore} />
        </div>
      </div>
      <div className={styles.flare} />
      <div className={styles.depth} />
      <div className={styles.vignette} />
      <div className={styles.grain} />
    </div>
  )
}

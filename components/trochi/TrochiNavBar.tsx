'use client'

import Image from 'next/image'
import styles from './TrochiNavBar.module.css'

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '/work/trochi/home.svg', iconActive: '/work/trochi/home-active.svg', hotkeys: ['G', 'then', 'H'] },
  { id: 'lanes', label: 'Lanes', icon: '/work/trochi/lanes.svg', iconActive: '/work/trochi/lanes-active.svg', hotkeys: ['G', 'then', 'L'] },
  { id: 'benchmarks', label: 'Benchmarks', icon: '/work/trochi/benchmarks.svg', iconActive: '/work/trochi/benchmarks-active.svg', hotkeys: ['G', 'then', 'B'] },
  { id: 'coverage', label: 'Coverage', icon: '/work/trochi/coverage.svg', iconActive: '/work/trochi/coverage-active.svg', hotkeys: ['G', 'then', 'C'] },
  { id: 'settings', label: 'Settings', icon: '/work/trochi/settings.svg', iconActive: '/work/trochi/settings-active.svg', hotkeys: ['G', 'then', 'S'] },
] as const

export default function TrochiNavBar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.primaryBar}>
        <div className={styles.navIcons}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.navButton}
              aria-label={item.label}
            >
              <span className={styles.tooltip}>
                <span className={styles.tooltipLabel}>{item.label}</span>
                <span className={styles.hotkeys}>
                  {item.hotkeys.map((key, i) =>
                    key === 'then' ? (
                      <span key={i} className={styles.hotkeyThen}>
                        {key}
                      </span>
                    ) : (
                      <span key={i} className={styles.hotkey}>
                        {key}
                      </span>
                    )
                  )}
                </span>
              </span>
              <Image
                src={item.icon}
                alt=""
                width={24}
                height={24}
                className={styles.icon}
              />
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={styles.searchButton}
        aria-label="Search"
      >
        <span className={styles.tooltip}>
          <span className={styles.tooltipLabel}>Search</span>
          <span className={styles.hotkeys}>
            <span className={styles.hotkey}>/</span>
          </span>
        </span>
        <Image
          src="/work/trochi/search.svg"
          alt=""
          width={24}
          height={24}
          className={styles.searchIcon}
        />
      </button>
    </div>
  )
}

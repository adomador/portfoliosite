'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import styles from './TrochiNavBar.module.css'

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '/work/trochi/home-active.svg', iconActive: '/work/trochi/home.svg', hotkeys: ['G', 'then', 'H'] },
  { id: 'lanes', label: 'Lanes', icon: '/work/trochi/lanes.svg', iconActive: '/work/trochi/lanes-active.svg', hotkeys: ['G', 'then', 'L'] },
  { id: 'benchmarks', label: 'Benchmarks', icon: '/work/trochi/benchmarks.svg', iconActive: '/work/trochi/benchmarks-active.svg', hotkeys: ['G', 'then', 'B'] },
  { id: 'coverage', label: 'Coverage', icon: '/work/trochi/coverage.svg', iconActive: '/work/trochi/coverage-active.svg', hotkeys: ['G', 'then', 'C'] },
  { id: 'settings', label: 'Settings', icon: '/work/trochi/settings.svg', iconActive: '/work/trochi/settings-active.svg', hotkeys: ['G', 'then', 'S'] },
] as const

type EquipmentType = 'Van' | 'Temp' | 'Flatbed'

const RECENT_SEARCHES = [
  { route: 'Phoenix, AR → Memphis, TN', equipment: 'Van' as EquipmentType, price: '$1.58', confidence: '92%' },
  { route: 'Chattanooga, TN → Portland, OR', equipment: 'Van' as EquipmentType, price: '$1.51', confidence: '91%' },
  { route: 'Chicago Market', equipment: 'Temp' as EquipmentType, price: '$1.53', confidence: '94%' },
  { route: 'Houston, TX → Dallas, TX', equipment: 'Flatbed' as EquipmentType, price: '$1.48', confidence: '88%' },
  { route: 'Nashville, TN → Laredom TX', equipment: 'Van' as EquipmentType, price: '$1.49', confidence: '81%' },
]

export default function TrochiNavBar() {
  const [activeId, setActiveId] = useState<string>('home')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const openSearch = () => {
    setIsSearchOpen(true)
    setSearchQuery('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSearchOpen) {
          e.preventDefault()
          closeSearch()
        }
        return
      }
      if (e.key === '/' && !isSearchOpen) {
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
        e.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSearchOpen && wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        closeSearch()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSearchOpen])

  const filteredResults = RECENT_SEARCHES.filter(
    (r) => !searchQuery || r.route.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${isSearchOpen ? styles.searchOpen : ''}`}
    >
      <div className={styles.primaryBar}>
        <div className={styles.navIcons}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.navButton} ${isActive ? styles.active : ''}`}
                aria-label={item.label}
                aria-pressed={isActive}
                onClick={() => setActiveId(item.id)}
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
                  src={isActive ? item.iconActive : item.icon}
                  alt=""
                  width={24}
                  height={24}
                  className={styles.icon}
                />
              </button>
            )
          })}
        </div>
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          placeholder="Search for lanes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search for lanes"
        />
      </div>
      <div className={styles.resultsPanel}>
        <p className={styles.resultsHeader}>Recent searches</p>
        <div className={styles.resultsList}>
          {filteredResults.map((result, i) => (
            <div key={i} className={styles.resultRow}>
              <div className={styles.resultLeft}>
                <Image
                  src="/work/trochi/recent-search.svg"
                  alt=""
                  width={16}
                  height={16}
                  className={styles.historyIcon}
                />
                <span className={styles.resultRoute}>{result.route}</span>
              </div>
              <div className={styles.resultRight}>
                <span
                  className={`${styles.equipmentBadge} ${styles[result.equipment.toLowerCase()]}`}
                >
                  {result.equipment}
                </span>
                <span className={styles.resultPrice}>{result.price}</span>
                <div className={styles.resultConfidence}>
                  <Image
                    src="/work/trochi/confidence-badge.svg"
                    alt=""
                    width={16}
                    height={16}
                    className={styles.confidenceIcon}
                  />
                  <span className={styles.resultConfidenceText}>
                    {result.confidence} confidence
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={styles.searchButton}
        aria-label="Search"
        onClick={openSearch}
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

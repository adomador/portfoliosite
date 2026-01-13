'use client'
import { useState, useEffect } from 'react'
import styles from './page.module.css'
import CursorBlur from '@/components/CursorBlur'
import Lottie from 'lottie-react'

const caseStudies = [
  {
    number: '01',
    title: 'Trochi',
    description: '0 to 1 MVP of a freight pricing platform for a startup in the trucking industry.',
    tags: ['SaaS', 'Enterprise Software'],
    slug: 'freight-pricing-platform',
    image: '/trochi-logo.svg',
    visual: '/trochi-visual.svg'
  },
  {
    number: '02', 
    title: 'Diezl',
    description: 'A side project I built to help small trucking companies calculate the profitability of their loads.',
    tags: ['Side Project', 'Mobile App'],
    slug: 'load-profitability-calculator',
    image: '/diezl-logo.svg',
    visual: null
  },
  {
    number: '03',
    title: 'Fleetworthy',
    description: 'Led design and research efforts to create a single pane of glass for fleet managers to manage their vehicles.',
    tags: ['Enterprise', '0 to 1 MVP'],
    slug: 'fleet-management-platform',
    image: '/fleetworthy-logo.svg',
    visual: null
  },
  {
    number: '04',
    title: 'Triumph',
    description: 'Case study description for Triumph.',
    tags: [],
    slug: 'triumph',
    image: '/triumph-logo.svg',
    visual: null
  }
]

const tools = [
  { name: 'Figma', icon: '◈', image: '/Figma-logo.svg' },
  { name: 'Cursor', icon: '◐', image: '/CUBE_2D_DARK.svg' },
  { name: 'Miro', icon: '△', image: '/miro-logo.svg' },
  { name: 'Anthropic', icon: '◉', image: '/anthropic-1.svg' },
  { name: 'Notion', icon: '◎', image: '/notion-logo.svg' },
  { name: 'GitHub', icon: '▢', image: '/github-logo.webp' },
]

export default function Home() {
  const [hoveredCaseStudy, setHoveredCaseStudy] = useState<string | null>(null)
  const [animationData, setAnimationData] = useState<any>(null)

  // Load animation data for Trochi when hovered
  useEffect(() => {
    if (hoveredCaseStudy === 'freight-pricing-platform' && !animationData) {
      fetch('/lane-results-animation.json')
        .then(res => res.json())
        .then(data => setAnimationData(data))
        .catch(err => console.error('Failed to load animation:', err))
    }
  }, [hoveredCaseStudy, animationData])

  return (
    <>
      <CursorBlur />
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logo}>Alfredo E. Domador</div>
        <div className={styles.navLinks}>
          <a href="#work" className={styles.navLink}>Work</a>
          <a href="#about" className={styles.navLink}>About</a>
          <a href="mailto:hello@example.com" className={styles.navLink}>Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="work" className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTagline}>
            <span className={styles.heroTaglineText}>Designer / Builder • Specializing in 🌐 Supply Chain & Logistics 🚚 </span>
          </div>
          <h1 className={styles.heroHeading}>
            I design software that transforms complex enterprise workflows into easy to use systems.
          </h1>
          <p className={styles.heroBody}>
            Through first principles thinking and a bias toward action, I help companies transform ambiguous problems 
            into elegant experiences humans enjoy using.
          </p>
        </div>
        <div className={styles.heroArtisticShape} />
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className={styles.caseStudiesSection}>
        <div className={styles.caseStudiesGrid}>
          {caseStudies.map((study, index) => (
            <article 
              key={study.slug} 
              className={styles.caseStudyCard} 
              data-slug={study.slug}
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => study.slug === 'freight-pricing-platform' && setHoveredCaseStudy(study.slug)}
              onMouseLeave={() => setHoveredCaseStudy(null)}
            >
              <div className={styles.caseStudyImageWrapper}>
                <div className={styles.caseStudyImage}>
                  {study.slug === 'freight-pricing-platform' && hoveredCaseStudy === study.slug && animationData ? (
                    <Lottie 
                      animationData={animationData} 
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : study.image ? (
                    <img src={study.image} alt={study.title} />
                  ) : (
                    <div className={styles.caseStudyImagePlaceholder}>
                      Image
                    </div>
                  )}
                </div>
                <h3 className={styles.caseStudyTitle}>{study.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* About & Tools Section */}
      <section id="about me" className={styles.about}>
        <div className={styles.aboutContent}>
          <p className={styles.sectionLabel}>About Me</p>
          <h2 className={styles.aboutTitle}>
            Born in Venezuela<br />
            Raised in Miami, FL<br />
            Based in Pennsylvania<br />
          </h2>
          <p className={styles.aboutText}>
          Currently solving problems at <a href="https://fleetworthy.com/" className={styles.link} target="_blank" rel="noopener noreferrer">Fleetworthy</a>.
          </p>
          <p className={styles.aboutText}>
            In my free time, I enjoy playing chess, reading fiction, and walking.
          </p>
          <a href="https://www.dropbox.com/scl/fi/b2ofldaawe48whvrqus1d/Domador_Alfredo_Resume_2025.pdf?rlkey=wybkx2aj9f45xzi85r7kwiafr&e=1&st=mbevta12&dl=0" className={styles.aboutCta} target="_blank" rel="noopener noreferrer">
            <span>Download Resume</span>
            <span>↓</span>
          </a>
        </div>
        
        <div className={styles.tools}>
          <h3 className={styles.toolsTitle}>My Tools</h3>
          <div className={styles.toolsGrid}>
            {tools.map((tool) => (
              <div key={tool.name} className={styles.toolItem}>
                <span className={styles.toolIcon}>
                  {tool.image ? (
                    <img src={tool.image} alt={tool.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    tool.icon
                  )}
                </span>
                <span className={styles.toolName}>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.footerName}>Alfredo E. Domador</span>
          <span className={styles.footerCopy}>© {new Date().getFullYear()} Built with Cursor</span>
        </div>
        <div className={styles.footerLinks}>
          <a href="https://linkedin.com/in/adomador13" className={styles.footerLink} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:alfredo.domador13@gmail.com" className={styles.footerLink}>Email</a>
        </div>
      </footer>
    </>
  )
}
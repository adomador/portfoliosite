'use client'
import { useState, useEffect, useRef } from 'react'
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
  const [animationData, setAnimationData] = useState<Record<string, any>>({})
  const [isFadingOut, setIsFadingOut] = useState(false)
  const trochiLottieRef = useRef<any>(null)
  const diezlLottieRef = useRef<any>(null)
  const triumphLottieRef = useRef<any>(null)

  // Load animation data for case studies when hovered
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:loadEffect',message:'Load effect triggered',data:{hoveredCaseStudy,hasData:!!animationData[hoveredCaseStudy||'']},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D'})}).catch(()=>{});
    // #endregion
    if (hoveredCaseStudy === 'freight-pricing-platform' && !animationData['freight-pricing-platform']) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:fetchTrochi',message:'Starting Trochi fetch',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      fetch('/lane-results-animation.json')
        .then(res => res.json())
        .then(data => {
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:fetchTrochiDone',message:'Trochi data loaded',data:{dataLoaded:!!data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          setAnimationData(prev => ({ ...prev, 'freight-pricing-platform': data }))
        })
        .catch(err => console.error('Failed to load Trochi animation:', err))
    }
    if (hoveredCaseStudy === 'load-profitability-calculator' && !animationData['load-profitability-calculator']) {
      fetch('/diezl-animation.json')
        .then(res => res.json())
        .then(data => setAnimationData(prev => ({ ...prev, 'load-profitability-calculator': data })))
        .catch(err => console.error('Failed to load Diezl animation:', err))
    }
    if (hoveredCaseStudy === 'triumph' && !animationData['triumph']) {
      fetch('/triumph-animation.json')
        .then(res => res.json())
        .then(data => setAnimationData(prev => ({ ...prev, 'triumph': data })))
        .catch(err => console.error('Failed to load Triumph animation:', err))
    }
  }, [hoveredCaseStudy, animationData])

  // Control animation playback based on hover state
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:playbackEffect',message:'Playback effect triggered',data:{hoveredCaseStudy,isFadingOut,hasRef:!!trochiLottieRef.current,hasData:!!animationData[hoveredCaseStudy||'']},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C,E'})}).catch(()=>{});
    // #endregion
    if (hoveredCaseStudy === 'freight-pricing-platform' && trochiLottieRef.current) {
      if (!isFadingOut) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:playTrochi',message:'Calling play() on Trochi',data:{refExists:!!trochiLottieRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        trochiLottieRef.current.play()
      } else {
        trochiLottieRef.current.stop()
        trochiLottieRef.current.goToAndStop(0, true)
      }
    }
    if (hoveredCaseStudy === 'load-profitability-calculator' && diezlLottieRef.current) {
      if (!isFadingOut) {
        diezlLottieRef.current.play()
      } else {
        diezlLottieRef.current.stop()
        diezlLottieRef.current.goToAndStop(0, true)
      }
    }
    if (hoveredCaseStudy === 'triumph' && triumphLottieRef.current) {
      if (!isFadingOut) {
        triumphLottieRef.current.play()
      } else {
        triumphLottieRef.current.stop()
        triumphLottieRef.current.goToAndStop(0, true)
      }
    }
  }, [hoveredCaseStudy, isFadingOut, animationData])

  const handleMouseLeave = () => {
    setIsFadingOut(true)
    setTimeout(() => {
      setHoveredCaseStudy(null)
      setIsFadingOut(false)
    }, 300) // Match CSS transition duration
  }

  const handleMouseEnter = (slug: string) => {
    if (slug === 'freight-pricing-platform' || slug === 'load-profitability-calculator' || slug === 'triumph') {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:mouseEnter',message:'Mouse enter',data:{slug,hasData:!!animationData[slug]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,E'})}).catch(()=>{});
      // #endregion
      setIsFadingOut(false)
      setHoveredCaseStudy(slug)
    }
  }

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
          Designing enterprise software for the 21st century.
          </h1>
          <p className={styles.heroBody}>
            Through first principles thinking and a bias toward action, I transform ambiguous problems 
            into elegant experiences humans enjoy using.
          </p>
        </div>
        <div className={styles.heroArtisticShape} />
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className={styles.caseStudiesSection}>
        <h3 className={styles.caseStudiesTitle}>Some work</h3>
        <div className={styles.caseStudiesGrid}>
          {caseStudies.map((study, index) => (
            <article 
              key={study.slug} 
              className={styles.caseStudyCard} 
              data-slug={study.slug}
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => handleMouseEnter(study.slug)}
              onMouseLeave={handleMouseLeave}
            >
              <div className={styles.caseStudyImageWrapper}>
                <div className={styles.caseStudyImage}>
                  {study.image && (
                    <img src={study.image} alt={study.title} />
                  )}
                  {!study.image && (
                    <div className={styles.caseStudyImagePlaceholder}>
                      Image
                    </div>
                  )}
                  {study.slug === 'freight-pricing-platform' && animationData['freight-pricing-platform'] && (
                    <>
                      <Lottie 
                        lottieRef={trochiLottieRef}
                        animationData={animationData['freight-pricing-platform']} 
                        loop={false}
                        autoplay={hoveredCaseStudy === study.slug && !isFadingOut}
                        className={`${styles.caseStudyAnimation} ${(hoveredCaseStudy === study.slug && !isFadingOut) ? '' : styles.caseStudyAnimationFadeOut}`}
                      />
                      <div className={`${styles.trochiOverlay} ${(hoveredCaseStudy === study.slug && !isFadingOut) ? '' : styles.trochiOverlayFadeOut}`} ref={(el) => {
                        // #region agent log
                        if (el) {
                          const overlayRect = el.getBoundingClientRect();
                          const contentEl = el.querySelector('[class*="trochiOverlayContent"]');
                          const logoEl = el.querySelector('[class*="trochiLogo"]');
                          const contentRect = contentEl?.getBoundingClientRect();
                          const logoRect = logoEl?.getBoundingClientRect();
                          const logoStyles = logoEl ? window.getComputedStyle(logoEl) : null;
                          fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:overlay-ref',message:'Overlay dimensions',data:{overlayWidth:overlayRect.width,overlayHeight:overlayRect.height,contentWidth:contentRect?.width,contentHeight:contentRect?.height,logoWidth:logoRect?.width,logoHeight:logoRect?.height,logoComputedWidth:logoStyles?.width,logoComputedHeight:logoStyles?.height,logoMaxWidth:logoStyles?.maxWidth,logoObjectFit:logoStyles?.objectFit},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D'})}).catch(()=>{});
                        }
                        // #endregion
                      }}>
                        <div className={styles.trochiOverlayContent}>
                          <img src="/trochi-logo-overlay.svg" alt="Trochi" className={styles.trochiLogo} />
                          <span className={styles.comingSoon}>Coming soon</span>
                        </div>
                      </div>
                    </>
                  )}
                  {study.slug === 'load-profitability-calculator' && animationData['load-profitability-calculator'] && (
                    <>
                      <Lottie 
                        lottieRef={diezlLottieRef}
                        animationData={animationData['load-profitability-calculator']} 
                        loop={false}
                        autoplay={hoveredCaseStudy === study.slug && !isFadingOut}
                        className={`${styles.caseStudyAnimation} ${(hoveredCaseStudy === study.slug && !isFadingOut) ? '' : styles.caseStudyAnimationFadeOut}`}
                      />
                      <div className={`${styles.trochiOverlay} ${(hoveredCaseStudy === study.slug && !isFadingOut) ? '' : styles.trochiOverlayFadeOut}`}>
                        <div className={styles.trochiOverlayContent}>
                          <img src="/diezl-logo-overlay.svg" alt="Diezl" className={styles.diezlLogo} />
                          <span className={styles.comingSoon}>Coming soon</span>
                        </div>
                      </div>
                    </>
                  )}
                  {study.slug === 'triumph' && animationData['triumph'] && (
                    <>
                      <Lottie 
                        lottieRef={triumphLottieRef}
                        animationData={animationData['triumph']} 
                        loop={false}
                        autoplay={hoveredCaseStudy === study.slug && !isFadingOut}
                        className={`${styles.caseStudyAnimation} ${(hoveredCaseStudy === study.slug && !isFadingOut) ? '' : styles.caseStudyAnimationFadeOut}`}
                      />
                      <div className={`${styles.trochiOverlay} ${(hoveredCaseStudy === study.slug && !isFadingOut) ? '' : styles.trochiOverlayFadeOut}`}>
                        <div className={styles.trochiOverlayContent}>
                          <img src="/triumph-logo-overlay.svg" alt="Triumph" className={styles.triumphLogo} />
                          <span className={styles.comingSoon}>Coming soon</span>
                        </div>
                      </div>
                    </>
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
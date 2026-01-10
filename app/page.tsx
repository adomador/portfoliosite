import styles from './page.module.css'
import CursorBlur from '@/components/CursorBlur'

const caseStudies = [
  {
    number: '01',
    title: 'Trochi',
    description: '0 to 1 MVP of a freight pricing platform for a startup in the trucking industry.',
    tags: ['SaaS', 'Enterprise Software'],
    slug: 'freight-pricing-platform'
  },
  {
    number: '02', 
    title: 'Diezl',
    description: 'A side project I built to help small trucking companies calculate the profitability of their loads.',
    tags: ['Side Project', 'Mobile App'],
    slug: 'load-profitability-calculator'
  },
  {
    number: '03',
    title: 'Fleetworthy',
    description: 'Led design and research efforts to create a single pane of glass for fleet managers to manage their vehicles.',
    tags: ['Enterprise', '0 to 1 MVP'],
    slug: 'fleet-management-platform'
  }
]

const tools = [
  { name: 'Figma', icon: '◈' },
  { name: 'Cursor', icon: '◐' },
  { name: 'Miro', icon: '△' },
  { name: 'Anthropic', icon: '◉' },
  { name: 'Notion', icon: '◎' },
  { name: 'GitHub', icon: '▢' },
]

export default function Home() {
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
            <span className={styles.heroTaglineText}>Designer | Builder </span>
          </div>
          <p className={styles.heroBio}>
          I design software that makes complex enterprise workflows feel easy to use. 
          Through first principles thinking and a bias toward action, I help companies transform tangled problems 
          into elegant systems humans actually enjoy using.
          </p>
          
          <div className={styles.heroCaseStudiesGrid}>
            {caseStudies.map((study, index) => (
              <article key={study.slug} className={styles.caseStudyCard} style={{ animationDelay: `${index * 150}ms` }}>
                <div className={styles.caseStudyImageWrapper}>
                  <div className={styles.caseStudyImage}>
                    <div className={styles.caseStudyImagePlaceholder}>
                      Image
                    </div>
                  </div>
                  <h3 className={styles.caseStudyTitle}>{study.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className={styles.heroArtisticShape} />
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
          <button className={styles.aboutCta}>
            <span>Download Resume</span>
            <span>↓</span>
          </button>
        </div>
        
        <div className={styles.tools}>
          <h3 className={styles.toolsTitle}>My Tools</h3>
          <div className={styles.toolsGrid}>
            {tools.map((tool) => (
              <div key={tool.name} className={styles.toolItem}>
                <span className={styles.toolIcon}>{tool.icon}</span>
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
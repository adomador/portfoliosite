import styles from './page.module.css'
import CursorBlur from '@/components/CursorBlur'

const caseStudies = [
  {
    number: '01',
    title: 'Reimagining Digital Banking',
    description: 'Led the complete redesign of a mobile banking experience, focusing on accessibility and trust. Increased user engagement by 47%.',
    tags: ['Mobile App', 'Fintech'],
    slug: 'digital-banking'
  },
  {
    number: '02', 
    title: 'E-Commerce Platform',
    description: 'Crafted an intuitive shopping experience for a luxury fashion brand, blending editorial design with seamless commerce.',
    tags: ['Web', 'E-Commerce'],
    slug: 'ecommerce-platform'
  },
  {
    number: '03',
    title: 'Healthcare Dashboard',
    description: 'Designed a comprehensive analytics platform for healthcare professionals, simplifying complex data into actionable insights.',
    tags: ['Dashboard', 'Healthcare'],
    slug: 'healthcare-dashboard'
  }
]

const testimonials = [
  {
    quote: 'An exceptional designer who brings both strategic thinking and meticulous craft to every project. The attention to detail is unparalleled.',
    name: 'Sarah Chen',
    role: 'VP of Product, Fintech Startup',
    initials: 'SC'
  },
  {
    quote: 'Working together was transformative for our product. They have a rare ability to translate complex problems into elegant, intuitive solutions.',
    name: 'Marcus Williams',
    role: 'CEO, Healthcare Tech',
    initials: 'MW'
  },
  {
    quote: 'The design work elevated our entire brand. Every interaction feels intentional, every detail considered. Truly remarkable work.',
    name: 'Elena Rodriguez',
    role: 'Creative Director, Agency',
    initials: 'ER'
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
        <div className={styles.logo}>Portfolio</div>
        <div className={styles.navLinks}>
          <a href="#work" className={styles.navLink}>Work</a>
          <a href="#testimonials" className={styles.navLink}>Testimonials</a>
          <a href="#about" className={styles.navLink}>About</a>
          <a href="mailto:hello@example.com" className={styles.navLink}>Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTagline}>
            <div className={`accent-line ${styles.accentLine}`} />
            <span className={styles.heroTaglineText}>Software Designer | Builder </span>
          </div>
          <h1 className={styles.heroTitle}>
            Crafting digital<br />
            experiences with<br />
            <span className={styles.heroTitleAccent}>intention</span>
          </h1>
          <p className={styles.heroBio}>
            I design products that resonate. With a focus on clarity and craft, 
            I help companies transform complex challenges into elegant, 
            human-centered solutions.
          </p>
        </div>
        <div className={styles.heroScroll}>
          <span>Scroll</span>
          <div className={styles.heroScrollLine} />
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="work" className={styles.caseStudies}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>Selected Work</p>
            <h2 className={styles.sectionTitle}>Case Studies</h2>
          </div>
          <span className={styles.sectionCount}>03 Projects</span>
        </div>
        
        <div className={styles.caseStudiesGrid}>
          {caseStudies.map((study) => (
            <article key={study.slug} className={styles.caseStudyCard}>
              <div className={styles.caseStudyImage}>
                <div className={styles.caseStudyImagePlaceholder}>
                  Image
                </div>
              </div>
              <div className={styles.caseStudyContent}>
                <span className={styles.caseStudyNumber}>{study.number}</span>
                <h3 className={styles.caseStudyTitle}>{study.title}</h3>
                <p className={styles.caseStudyDescription}>{study.description}</p>
                <div className={styles.caseStudyMeta}>
                  {study.tags.map((tag) => (
                    <span key={tag} className={styles.caseStudyTag}>{tag}</span>
                  ))}
                </div>
              </div>
              <span className={styles.caseStudyArrow}>→</span>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>What People Say</p>
            <h2 className={styles.sectionTitle}>Testimonials</h2>
          </div>
        </div>
        
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <article key={index} className={styles.testimonialCard}>
              <p className={styles.testimonialQuote}>{testimonial.quote}</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>
                  {testimonial.initials}
                </div>
                <div className={styles.testimonialInfo}>
                  <span className={styles.testimonialName}>{testimonial.name}</span>
                  <span className={styles.testimonialRole}>{testimonial.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* About & Tools Section */}
      <section id="about" className={styles.about}>
        <div className={styles.aboutContent}>
          <p className={styles.sectionLabel}>About</p>
          <h2 className={styles.aboutTitle}>
            Designing at the<br />
            intersection of<br />
            <span className={styles.heroTitleAccent}>art & function</span>
          </h2>
          <p className={styles.aboutText}>
            With over a decade of experience shaping digital products, I bring a 
            <span className={styles.aboutHighlight}> Renaissance approach</span> to 
            modern design—where every pixel serves a purpose and every interaction 
            tells a story.
          </p>
          <p className={styles.aboutText}>
            I believe great design is invisible. It guides without imposing, 
            delights without distracting, and always, always serves the user first.
          </p>
          <button className={styles.aboutCta}>
            <span>Download Resume</span>
            <span>↓</span>
          </button>
        </div>
        
        <div className={styles.tools}>
          <h3 className={styles.toolsTitle}>Tools & Technologies</h3>
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
          <span className={styles.footerName}>Product Designer</span>
          <span className={styles.footerCopy}>© {new Date().getFullYear()} All rights reserved</span>
        </div>
        <div className={styles.footerLinks}>
          <a href="https://linkedin.com" className={styles.footerLink} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://dribbble.com" className={styles.footerLink} target="_blank" rel="noopener noreferrer">Dribbble</a>
          <a href="https://twitter.com" className={styles.footerLink} target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="mailto:hello@example.com" className={styles.footerLink}>Email</a>
        </div>
      </footer>
    </>
  )
}
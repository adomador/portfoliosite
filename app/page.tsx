import styles from './page.module.css'
import CursorBlur from '@/components/CursorBlur'

const caseStudies = [
  {
    number: '01',
    title: 'Revolutionizing data driven freight pricing',
    description: '0 to 1 MVP of a freight pricing platform for a startup in the trucking industry.',
    tags: ['SaaS', 'Enterprise Software'],
    slug: 'freight-pricing-platform'
  },
  {
    number: '02', 
    title: 'Building a Load Profitability Calculator for small trucking companies',
    description: 'A side project I built to help small trucking companies calculate the profitability of their loads.',
    tags: ['Side Project', 'Mobile App'],
    slug: 'load-profitability-calculator'
  },
  {
    number: '03',
    title: 'Unifying the experience of 3 different products',
    description: 'Led design and research efforts to create a single pane of glass for fleet managers to manage their vehicles.',
    tags: ['Enterprise', '0 to 1 MVP'],
    slug: 'fleet-management-platform'
  }
]

const testimonials = [
  {
    quote: 'I managed Alfredo at TriumphPay and highly recommend him as a UX designer or researcher. He drove and improved the research practice at TriumphPay, adding both solid, replicable process and best practices.',
    name: 'Rob Daffin',
    role: 'UX Manager, TriumphPay',
    initials: 'RD'
  },
  {
    quote: 'Alfredo is extremely talented in UX and not just design. Alfredo has overachieved in all aspects from ideation to production throughout product life cycles within the business vertical he supports including the support of research.',
    name: 'John Szrejter',
    role: 'UX Research Lead, TriumphPay',
    initials: 'JS'
  },
  {
    quote: 'Alfredo consistently impresses with his ability to lead in end-to-end research and design efforts. He excels in communicating across diverse audiences, from engineering to leadership.',
    name: 'Kyle LeGrand',
    role: 'Group Product Manager, TriumphPay',
    initials: 'KL'
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
            I design software that solves complex problems. With a focus on first principles and user-centered design, 
            I help companies transform complex workflows into elegant, 
            human-centered solutions.
          </p>
        </div>
        <div className={styles.heroArtisticShape} />
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
            <span className={styles.heroTitleAccent}>creativity & function</span>
          </h2>
          <p className={styles.aboutText}>
          I create user-centered solutions that drive business impact. From strategy to implementation, I collaborate
           across functions and leverage modern tools to move 
           quickly from idea to working product.
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
          <h3 className={styles.toolsTitle}>My Toolbox</h3>
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
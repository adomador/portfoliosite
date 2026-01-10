'use client'
import { useEffect } from 'react'
import styles from './page.module.css'
import CursorBlur from '@/components/CursorBlur'

const caseStudies = [
  {
    number: '01',
    title: 'Trochi',
    description: '0 to 1 MVP of a freight pricing platform for a startup in the trucking industry.',
    tags: ['SaaS', 'Enterprise Software'],
    slug: 'freight-pricing-platform',
    image: '/trochi-image.svg'
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
  // #region agent log
  useEffect(() => {
    const btn = document.querySelector(`.${styles.aboutCta}`);
    if (!btn) {
      fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:41',message:'Button not found',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'F'})}).catch(()=>{});
      return;
    }
    
    // Get all CSS rules that match the button
    const allRules = Array.from(document.styleSheets).flatMap(sheet => {
      try {
        return Array.from(sheet.cssRules).filter(rule => {
          if (rule.type === CSSRule.STYLE_RULE) {
            try { return btn.matches(rule.selectorText); } catch(e) { return false; }
          }
          return false;
        }).map(r => ({ selector: r.selectorText, style: r.style.cssText.substring(0, 200) }));
      } catch(e) { return []; }
    });
    
    fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:57',message:'Matching CSS rules for button',data:{rulesCount:allRules.length,rules:allRules},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'G'})}).catch(()=>{});
    
    const beforeEl = window.getComputedStyle(btn, '::before');
    const initialClipPath = beforeEl.clipPath;
    
    const handleMouseEnter = () => {
      // Check if hover class is applied to the button itself
      const btnStyle = window.getComputedStyle(btn);
      const btnColor = btnStyle.color;
      
      fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:68',message:'Hover - button itself',data:{color:btnColor,matches:btn.matches(':hover')},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'F'})}).catch(()=>{});
      
      setTimeout(() => {
        const hoverBeforeEl = window.getComputedStyle(btn, '::before');
        const hoverClipPath = hoverBeforeEl.clipPath;
        const hoverAnimationName = hoverBeforeEl.animationName;
        const hoverAnimationDuration = hoverBeforeEl.animationDuration;
        
        // Try to find any rules matching ::before on hover
        const beforeRules = Array.from(document.styleSheets).flatMap(sheet => {
          try {
            return Array.from(sheet.cssRules).filter(rule => {
              if (rule.type === CSSRule.STYLE_RULE && rule.selectorText && (rule.selectorText.includes('::before') || rule.selectorText.includes(':before'))) {
                return true;
              }
              return false;
            }).map(r => ({ selector: r.selectorText, animation: r.style.animation || 'none', animationName: r.style.animationName || 'none' }));
          } catch(e) { return []; }
        });
        
        fetch('http://127.0.0.1:7243/ingest/a5c66397-d7ca-4c92-b3ed-299848b16726',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:88',message:'During hover (100ms)',data:{clipPath:hoverClipPath,animationName:hoverAnimationName,animationDuration:hoverAnimationDuration,changed:hoverClipPath!==initialClipPath,beforeRulesCount:beforeRules.length,beforeRules:beforeRules.filter(r=>r.selector.includes('aboutCta'))},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'F,G'})}).catch(()=>{});
      }, 100);
    };
    
    btn.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      btn.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);
  // #endregion
  
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
                    {study.image ? (
                      <img src={study.image} alt={study.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
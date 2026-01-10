# Portfolio Site

A modern, visually striking portfolio website for product designers. Built with Next.js, TypeScript, and CSS Modules.

## Design Philosophy

Inspired by Caravaggio's dramatic use of light and shadow, combined with the elegant interactions of [fey.com](https://fey.com/) and [lfs.gd](https://www.lfs.gd/). The design features:

- **Dark, warm palette** — Deep blacks with golden and crimson accents
- **Renaissance flair** — Dramatic contrast, purposeful whitespace
- **Micro-interactions** — Smooth transitions that guide attention
- **Satoshi typography** — Modern, clean sans-serif

## Features

- Staggered entrance animations on page load
- Hover effects with golden accent reveals
- Smooth scroll navigation
- Responsive design (mobile, tablet, desktop)
- Subtle grain texture overlay
- Custom scrollbar styling

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

## Project Structure

```
PortfolioSite/
├── app/
│   ├── page.tsx           # Main homepage with all sections
│   ├── page.module.css    # Component styles with animations
│   ├── globals.css        # Global styles, variables, utilities
│   ├── layout.tsx         # Root layout
│   ├── projects/          # Project pages
│   ├── about/             # About page (standalone)
│   └── contact/           # Contact page
├── components/
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── ProjectCard.tsx
├── types/
│   └── index.ts           # TypeScript definitions
└── public/                # Static assets (images, resume)
```

## Color Palette

| Variable | Color | Usage |
|----------|-------|-------|
| `--bg-deep` | `#0a0908` | Main background |
| `--accent-gold` | `#c9a227` | Primary accent |
| `--accent-amber` | `#d4a054` | Text highlights |
| `--accent-crimson` | `#8b2635` | Secondary accent |
| `--text-primary` | `#f5f0e8` | Headings |
| `--text-secondary` | `#a39e93` | Body text |

## Customization

### Adding Projects

Edit the `caseStudies` array in `app/page.tsx`:

```typescript
const caseStudies = [
  {
    number: '01',
    title: 'Your Project Title',
    description: 'Brief description...',
    tags: ['Tag1', 'Tag2'],
    slug: 'project-slug'
  },
  // ...
]
```

### Adding Testimonials

Edit the `testimonials` array in `app/page.tsx`:

```typescript
const testimonials = [
  {
    quote: 'Your testimonial text...',
    name: 'Person Name',
    role: 'Role, Company',
    initials: 'PN'
  },
  // ...
]
```

### Adding Project Images

1. Add images to `/public/projects/`
2. Reference them in case study cards

## Next Steps

1. Replace placeholder content with your own
2. Add project images to `/public/`
3. Create individual project pages in `/app/projects/[slug]/`
4. Add your resume PDF to `/public/`
5. Update social links in the footer
6. Configure contact form functionality
7. Deploy to Vercel or your preferred platform

## License

MIT
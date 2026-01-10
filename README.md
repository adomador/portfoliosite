# Portfolio Site

A modern portfolio website built with Next.js and TypeScript.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
PortfolioSite/
├── app/
│   ├── page.tsx          # Home page
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   ├── projects/         # Projects page
│   ├── about/            # About page
│   └── contact/          # Contact page
├── components/
│   ├── Navigation.tsx    # Navigation component
│   ├── Footer.tsx        # Footer component
│   └── ProjectCard.tsx   # Project card component
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Next Steps

1. Add your project images to the `public/` directory
2. Update content in each page
3. Customize styles and layout
4. Add animations and interactions
5. Configure contact form functionality
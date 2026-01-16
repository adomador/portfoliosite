# Deployment Guide

This guide will help you deploy your portfolio site to production with your custom domain.

## Quick Start: Deploy to Vercel (Recommended)

Vercel is the easiest option for Next.js apps and offers:
- ✅ Free tier with generous limits
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Easy domain configuration
- ✅ Automatic deployments from Git

### Step 1: Prepare Your Repository

1. **Commit all your changes:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   ```

2. **Push to GitHub/GitLab/Bitbucket:**
   ```bash
   git push origin main
   ```
   (If you haven't set up a remote yet, create a repository on GitHub first)

### Step 2: Deploy to Vercel

1. **Sign up/Login:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account (recommended)

2. **Import your project:**
   - Click "Add New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings

3. **Configure build settings:**
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)
   - Root Directory: `./` (default)

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your site will be live at `your-project.vercel.app`

### Step 3: Connect Your Custom Domain

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `yourdomain.com` or `www.yourdomain.com`)

2. **Configure DNS:**
   Vercel will show you the DNS records to add. You'll need to add these at your domain registrar:

   **For root domain (yourdomain.com):**
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21` (Vercel's IP)

   **For www subdomain (www.yourdomain.com):**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

3. **Wait for DNS propagation:**
   - DNS changes can take 24-48 hours, but usually work within minutes
   - Vercel will automatically provision SSL certificates

4. **Verify:**
   - Once DNS propagates, your site will be live at your custom domain!

## Alternative Hosting Options

### Netlify

1. Sign up at [netlify.com](https://netlify.com)
2. Connect your Git repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add custom domain in Site settings

### Railway

1. Sign up at [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Add a service → Deploy from GitHub repo
4. Railway auto-detects Next.js
5. Add custom domain in project settings

### Self-Hosting (VPS)

If you prefer a VPS (DigitalOcean, AWS EC2, etc.):

1. **Set up Node.js on your server**
2. **Clone your repository**
3. **Install dependencies:** `npm install --production`
4. **Build:** `npm run build`
5. **Run with PM2:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "portfolio" -- start
   pm2 save
   pm2 startup
   ```
6. **Set up Nginx reverse proxy**
7. **Configure SSL with Let's Encrypt**

## Pre-Deployment Checklist

- [ ] Test the production build locally: `npm run build && npm start`
- [ ] Verify all images and assets load correctly
- [ ] Test the chess game functionality
- [ ] Check mobile responsiveness
- [ ] Test all navigation links
- [ ] Verify contact form (if applicable)
- [ ] Update any hardcoded localhost URLs
- [ ] Review and update meta tags in `app/layout.tsx`
- [ ] Ensure all environment variables are set (if any)

## Post-Deployment

1. **Test your live site:**
   - Visit your domain
   - Test all pages and features
   - Check mobile view

2. **Set up monitoring:**
   - Vercel provides analytics in the dashboard
   - Consider adding Google Analytics if needed

3. **Configure redirects (if needed):**
   Create `next.config.js` redirects:
   ```javascript
   const nextConfig = {
     reactStrictMode: true,
     async redirects() {
       return [
         {
           source: '/old-path',
           destination: '/new-path',
           permanent: true,
         },
       ]
     },
   }
   ```

## Important Notes

### Chess Game State
Your chess game uses in-memory state. On serverless platforms (Vercel, Netlify), the game state will reset when:
- The serverless function goes idle
- A new deployment occurs
- The function container restarts

This is normal behavior for serverless functions. If you need persistent game state, consider:
- Using a database (PostgreSQL, MongoDB)
- Using Redis for session storage
- Using Vercel KV (key-value store)

### Environment Variables
Currently, your app doesn't require environment variables. If you add any later:
- In Vercel: Project → Settings → Environment Variables
- Add variables for Production, Preview, and Development
- Redeploy after adding variables

## Troubleshooting

**Build fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**Domain not working:**
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct
- Check domain status in Vercel dashboard

**API routes not working:**
- Ensure routes are in `app/api/` directory
- Check serverless function logs in Vercel
- Verify CORS settings if needed

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)

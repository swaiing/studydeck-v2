# Deployment Guide

This guide will help you deploy Studydeck v2 to Vercel.

## Prerequisites

- A [Vercel](https://vercel.com) account
- A PostgreSQL database (we recommend [Neon](https://neon.tech) or [Supabase](https://supabase.com))
- Node.js 20.9.0 or higher

## Step 1: Prepare Your Database

### Option A: Neon (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. You'll get two URLs:
   - **Pooled connection** (for `DATABASE_URL`) - ends with `?sslmode=require`
   - **Direct connection** (for `DIRECT_URL`) - for migrations

### Option B: Supabase

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection strings:
   - **Transaction pooler** for `DATABASE_URL`
   - **Session pooler** for `DIRECT_URL`

## Step 2: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/studydeck-v2.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)

5. Add Environment Variables:
   ```
   DATABASE_URL=<your-database-url>
   DIRECT_URL=<your-direct-database-url>
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   NEXTAUTH_URL=<your-vercel-url>
   ```

6. Click "Deploy"

## Step 4: Run Database Migrations

After your first deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Run migrations
vercel env pull .env.local
npx prisma migrate deploy
```

Or manually run migrations using Prisma Studio:
```bash
npx prisma studio
```

## Step 5: Update NEXTAUTH_URL

1. After deployment, copy your Vercel URL (e.g., `https://studydeck-v2.vercel.app`)
2. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
3. Update `NEXTAUTH_URL` to your production URL
4. Redeploy

## Environment Variables

### Required

- `DATABASE_URL` - PostgreSQL connection string (pooled)
- `DIRECT_URL` - PostgreSQL connection string (direct, for migrations)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your app's URL (e.g., `https://studydeck-v2.vercel.app`)

## Post-Deployment

### Run Migrations

```bash
# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Test Your Deployment

1. Visit your Vercel URL
2. Sign up for a new account
3. Create a test deck
4. Study the deck
5. Test all major features

## Troubleshooting

### Build Errors

- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally first

### Database Connection Issues

- Verify DATABASE_URL is correct
- Check if your database allows connections from Vercel IPs
- For Neon/Supabase, ensure SSL is enabled

### NextAuth Errors

- Ensure NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your deployment URL
- Check that cookies are enabled

### Migration Errors

- Run migrations manually: `npx prisma migrate deploy`
- Check Prisma logs for specific errors
- Ensure DIRECT_URL is set for migrations

## Custom Domain (Optional)

1. Go to Vercel Dashboard > Your Project > Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain
5. Redeploy

## Monitoring

- View logs in Vercel Dashboard
- Set up error tracking (optional): Sentry, LogRocket
- Monitor database performance in your database provider's dashboard

## Updating Your Deployment

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push

# Vercel will automatically deploy
```

## Backup

Regularly backup your database:

**Neon:**
- Automatic backups included
- Point-in-time recovery available

**Supabase:**
- Daily backups included
- Manual backups available in dashboard

## Security Checklist

- ✅ NEXTAUTH_SECRET is strong and random
- ✅ Database credentials are in environment variables
- ✅ `.env.local` is in `.gitignore`
- ✅ Rate limiting enabled (optional)
- ✅ HTTPS enforced (automatic on Vercel)

## Performance Optimization

- ✅ Images are optimized (Next.js automatic)
- ✅ Database queries are optimized
- ✅ Static pages are prerendered
- ✅ API responses are cached where appropriate

## Support

For issues:
- Check Vercel logs
- Review database logs
- Test locally first
- Check GitHub issues

---

**Congratulations! Your Studydeck v2 app is now live! 🎉**

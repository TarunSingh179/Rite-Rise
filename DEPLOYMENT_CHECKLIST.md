# Deployment Setup Checklist

Complete these steps to deploy your College Network to production.

## Prerequisites
- [ ] Code pushed to GitHub
- [ ] Node.js 20+ installed locally
- [ ] npm installed

---

## Phase 1: Create External Services (15 mins)

### 1.1 Neon.tech Database
- [ ] Go to https://neon.tech and create account
- [ ] Create new PostgreSQL project
- [ ] Copy connection string (looks like: `postgresql://user:password@host.neon.tech/database`)
- [ ] Save it securely (you'll need this in Step 2)

### 1.2 Upstash Redis
- [ ] Go to https://upstash.com and create account
- [ ] Create new Redis database (free tier)
- [ ] Copy REDIS_URL and access token
- [ ] Save them securely

---

## Phase 2: Local Setup (5 mins)

### 2.1 Install Dependencies
```bash
npm install
```
This installs the new `redis` package.

### 2.2 Configure Environment Variables
1. Copy `.env.example` to `.env.local`
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your credentials:
```env
DATABASE_URL="your_neon_connection_string"
REDIS_URL="your_upstash_redis_url"
REDIS_TOKEN="your_upstash_token"
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET safely:**
```bash
openssl rand -base64 32
```

### 2.3 Test Database Locally
```bash
npm run db:push
```
This verifies your DATABASE_URL is correct.

### 2.4 Test Build Locally
```bash
npm run build
npm start
```
Visit http://localhost:3000 to verify everything works.

---

## Phase 3: Deploy to Vercel (10 mins)

### 3.1 Connect Repository to Vercel
1. Go to https://vercel.com/new
2. Select your GitHub repository
3. Click "Import"

### 3.2 Configure Environment Variables in Vercel
In the "Environment Variables" section, add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `REDIS_URL` | Your Upstash Redis URL |
| `REDIS_TOKEN` | Your Upstash token |
| `NEXTAUTH_SECRET` | Generate new: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-vercel-domain.vercel.app` |

### 3.3 Deploy
1. Click "Deploy"
2. Wait for build to complete (3-5 minutes)
3. Visit your live URL

### 3.4 Verify Production
- [ ] Visit your Vercel domain
- [ ] Test authentication (login/register)
- [ ] Check database connection
- [ ] Verify message polling is active (messages update without refresh)

---

## Phase 4: Post-Deployment (5 mins)

### 4.1 Set Custom Domain (Optional)
1. In Vercel dashboard: Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### 4.2 Setup Production Database
1. In Neon dashboard: Create a production branch (separate from dev)
2. Update `NEXTAUTH_URL` in Vercel to match your domain

### 4.3 Monitor
- [ ] Check Vercel logs for errors
- [ ] Monitor Neon database usage
- [ ] Monitor Upstash Redis commands

---

## Troubleshooting

### Database connection fails
- ✅ Verify DATABASE_URL in Vercel environment variables
- ✅ Check Neon.tech IP whitelist settings
- ✅ Ensure URL has `?sslmode=require` suffix

### Redis not connecting (If used)
- ✅ Verify REDIS_URL and REDIS_TOKEN are correct
- ✅ Check Upstash dashboard for rate limiting
- ✅ Ensure Redis commands are under 10k/day limit

### Build fails on Vercel
- ✅ Run `npm run build` locally to check errors
- ✅ Verify all environment variables are set
- ✅ Check Node.js version compatibility (20+)

### Authentication not working
- ✅ Verify NEXTAUTH_SECRET is set in Vercel
- ✅ Verify NEXTAUTH_URL matches your domain
- ✅ Check database migrations ran successfully

---

## Scaling Beyond Free Tier

When you exceed free tier limits:

| Service | Next Step |
|---------|-----------|
| **Vercel** | Upgrade to Pro ($20/month) |
| **Neon** | Buy additional storage ($0.35/GB/month) |
| **Upstash** | Switch to paid tier ($5/month+) |
| **Backend** | Migrate API routes to Railway if needed |

---

## Useful Commands

```bash
# Local development
npm run dev                    # Start dev server

# Database management
npm run db:push              # Sync Prisma schema to DB
npm run db:migrate           # Create migration
npm run db:studio            # Open Prisma Studio GUI

# Production
npm run build                # Build for production
npm start                    # Start production server

# Deployment scripts
./scripts/deploy.sh          # Full deployment guide (Linux/Mac)
./scripts/deploy.bat         # Full deployment guide (Windows)
```

---

## Support

- **Vercel**: https://vercel.com/docs/nextjs
- **Neon**: https://neon.tech/docs/introduction
- **Upstash**: https://upstash.com/docs/redis/overall/getstarted
- **NextAuth**: https://next-auth.js.org/getting-started/introduction
- **Prisma**: https://www.prisma.io/docs/

---

✅ **All set!** Your College Network is now deployed to production.

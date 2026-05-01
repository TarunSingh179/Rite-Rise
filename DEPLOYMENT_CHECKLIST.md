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
- [ ] Create new PostgreSQL project (Your project: **wispy-mode-74369383**)
- [ ] Copy connection string (looks like: `postgresql://user:password@host.neon.tech/database?sslmode=require`)
- [ ] Save it securely (you'll need this in Step 2)

### 1.2 Upstash Redis (Optional)
- [ ] Go to https://upstash.com and create account
- [ ] Create new Redis database (Your ID: **ff562034-8d18-47ed-9ba5-50ac990d875c**)
- [ ] Copy the **REST URL** and **REST Token** from the Upstash dashboard
- [ ] Save them securely

---

## Phase 2: Local Setup (5 mins)

### 2.1 Install Dependencies
```bash
npm install
```

### 2.2 Configure Environment Variables
1. Copy `.env.example` to `.env.local`
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your credentials:
```env
DATABASE_URL="your_neon_connection_string"
UPSTASH_REDIS_REST_URL="your_upstash_rest_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_rest_token"
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
This verifies your `DATABASE_URL` is correct.

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
3. Select your project (Your project: **rite-rise1**)
4. Click "Import"

### 3.2 Configure Environment Variables in Vercel
In the "Environment Variables" section, add:

| Name | Value | Required |
|------|-------|----------|
| `DATABASE_URL` | Your Neon connection string | ✅ Yes |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` | ✅ Yes |
| `NEXTAUTH_URL` | `https://your-vercel-domain.vercel.app` | ✅ Yes |
| `UPSTASH_REDIS_REST_URL` | Your Upstash REST URL | ❌ Optional |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash REST token | ❌ Optional |

> **⚠️ Important:** Use `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` — not `REDIS_URL`. The REST API is required for Vercel serverless compatibility.

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
4. Update `NEXTAUTH_URL` in Vercel to match your custom domain

### 4.2 Monitor
- [ ] Check Vercel logs for errors
- [ ] Monitor Neon database usage
- [ ] Monitor Upstash Redis commands (if configured)

---

## Troubleshooting

### Database connection fails
- ✅ Verify `DATABASE_URL` in Vercel environment variables
- ✅ Ensure URL has `?sslmode=require` suffix
- ✅ Check Neon project is active and not suspended

### Redis not connecting
- ✅ Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are correct
- ✅ Check Upstash dashboard for rate limiting
- ✅ Ensure Redis commands are under 10k/day limit on free tier
- ✅ Redis is optional — the app works without it

### Build fails on Vercel
- ✅ Run `npm run build` locally to check errors
- ✅ Verify all required environment variables are set
- ✅ Check Node.js version compatibility (20+)

### Authentication not working
- ✅ Verify `NEXTAUTH_SECRET` is set in Vercel
- ✅ Verify `NEXTAUTH_URL` matches your domain exactly
- ✅ Check database is synced: `npx prisma db push`

---

## Scaling Beyond Free Tier

When you exceed free tier limits:

| Service | Next Step |
|---------|-----------|
| **Vercel** | Upgrade to Pro ($20/month) |
| **Neon** | Buy additional storage ($0.35/GB/month) |
| **Upstash** | Switch to paid tier ($5/month+) |

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

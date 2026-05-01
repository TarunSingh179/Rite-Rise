# Deployment & Hosting Guide

## Recommended Stack

This project uses a modern, free-tier friendly deployment stack optimized for Next.js applications.

### Frontend Hosting
- **Platform**: [Vercel](https://vercel.com)
- **Tier**: Free
- **Benefits**: 
  - No sleep/cold starts
  - Native Next.js optimization
  - Automatic deployments from Git
  - Built-in edge functions and middleware support

### Database
- **Platform**: [Neon.tech](https://neon.tech)
- **Tier**: Free (500MB storage)
- **Benefits**:
  - PostgreSQL database with no sleep mode
  - Development branches for safe testing
  - Autoscaling and automatic backups
  - Easy integration with Prisma ORM

### Cache Layer (Optional)
- **Platform**: [Upstash](https://upstash.com)
- **Tier**: Free (10k commands/day)
- **Benefits**:
  - REST-based Redis compatible with serverless
  - Perfect for high-performance data caching
  - No infrastructure management needed

### Backend
- **Platform**: Vercel API Routes (Native Next.js)
- **Architecture**: Serverless-optimized with database polling for real-time features.
- **Benefits**: 
  - Zero server management
  - Scale-to-zero pricing
  - Faster response times with Edge functions

## Stack Summary

| Component | Provider | Free Tier | Purpose |
|-----------|----------|-----------|---------|
| Frontend | Vercel | ✅ Yes | Next.js deployment |
| Database | Neon.tech | ✅ Yes (500MB) | PostgreSQL storage |
| Cache (Opt) | Upstash | ✅ Yes | REST Redis caching |
| Backend | Vercel API Routes | ✅ Yes | Serverless API |

---

## Setup Instructions

### 1. Deploy Frontend to Vercel
```bash
# Push your code to GitHub
git push origin main

# Connect repository to Vercel
# Visit https://vercel.com/new and select your GitHub repository
```

### 2. Configure Neon Database
1. Create an account at [neon.tech](https://neon.tech)
2. Create a PostgreSQL database
3. Get connection string (looks like: `postgresql://user:password@host/database?sslmode=require`)

### 3. Set Up Upstash Redis (Optional)
1. Create an account at [upstash.com](https://upstash.com)
2. Create a Redis database
3. Copy the **REST URL** and **REST Token** from the dashboard

### 4. Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

| Name | Example Value | Required |
|------|---------------|----------|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` | ✅ Yes |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` | ✅ Yes |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | ✅ Yes |
| `UPSTASH_REDIS_REST_URL` | `https://your-redis.upstash.io` | ❌ Optional |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash token | ❌ Optional |
| `RESEND_API_KEY` | Your Resend API key | ❌ Optional |

> **Important:** Use `UPSTASH_REDIS_REST_URL` (not `REDIS_URL`) — this uses the REST API which works with Vercel serverless.

---

## Deployment Checklist
- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Create Neon.tech PostgreSQL database
- [ ] Add `DATABASE_URL` to Vercel environment variables
- [ ] Generate a strong `NEXTAUTH_SECRET` with `openssl rand -base64 32`
- [ ] Add `NEXTAUTH_URL` matching your Vercel domain
- [ ] (Optional) Create Upstash Redis instance and add credentials
- [ ] Run migrations: `npx prisma db push`
- [ ] Verify build succeeds on Vercel
- [ ] Test application at your Vercel domain

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

## Scaling Beyond Free Tier

As your project grows, upgrade components individually:
- **Vercel**: Pro plan ($20/month) for advanced features
- **Neon**: Paid plans for increased storage (100GB+)
- **Upstash**: Paid plans for higher command limits

---

## Troubleshooting

### Database connection fails
- ✅ Verify `DATABASE_URL` in Vercel environment variables
- ✅ Check Neon.tech project is active
- ✅ Ensure URL has `?sslmode=require` suffix

### Redis not connecting
- ✅ Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are correct
- ✅ Check Upstash dashboard for rate limiting
- ✅ Redis is optional — the app works without it

### Build fails on Vercel
- ✅ Run `npm run build` locally to check errors
- ✅ Verify all required environment variables are set
- ✅ Check Node.js version compatibility (20+)

### Authentication not working
- ✅ Verify `NEXTAUTH_SECRET` is set in Vercel
- ✅ Verify `NEXTAUTH_URL` matches your actual domain
- ✅ Check database is synced: `npx prisma db push`

---

## Support

- **Vercel**: https://vercel.com/docs/nextjs
- **Neon**: https://neon.tech/docs/introduction
- **Upstash**: https://upstash.com/docs/redis/overall/getstarted
- **NextAuth**: https://next-auth.js.org/getting-started/introduction
- **Prisma**: https://www.prisma.io/docs/

# Production Deployment - Quick Start

## What's Been Set Up

✅ **Configuration Files Created:**
- `vercel.json` - Vercel deployment configuration
- `src/lib/redis.ts` - Redis client for Upstash
- `.env.example` - Updated with all required variables
- `package.json` - Added `redis` dependency

✅ **Setup Scripts:**
- `scripts/deploy.sh` - Linux/Mac deployment guide
- `scripts/deploy.bat` - Windows deployment guide

✅ **Documentation:**
- `DEPLOYMENT.md` - Architecture overview
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step setup guide

---

## 5-Minute Quick Start

### Step 1: Create Services (3 mins)
```
Neon.tech:   https://neon.tech → Create PostgreSQL DB
Upstash:     https://upstash.com → Create Redis instance
```

### Step 2: Local Setup (2 mins)
```bash
npm install              # Install redis dependency
cp .env.example .env.local
# Edit .env.local with your credentials from Step 1
npm run db:push         # Verify database connection
```

### Step 3: Deploy (auto)
```
Push to GitHub → Connect to Vercel → Add environment variables → Done!
```

---

## Environment Variables Needed

```env
DATABASE_URL=postgresql://...          # From Neon
REDIS_URL=redis://...                  # From Upstash
REDIS_TOKEN=...                        # From Upstash
NEXTAUTH_SECRET=                       # Generate: openssl rand -base64 32
NEXTAUTH_URL=https://your-domain.vercel.app
```

---

## Next Steps

1. **Follow the full checklist:** [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
2. **Understand the architecture:** [DEPLOYMENT.md](DEPLOYMENT.md)
3. **Run deployment script:**
   - Mac/Linux: `./scripts/deploy.sh`
   - Windows: `scripts/deploy.bat`

---

## Verify Deployment Works

After deploying to Vercel:
```bash
# Test these locally first
npm run build      # Should complete without errors
npm start          # Should start server on port 3000
```

Then visit your Vercel URL and check:
- [ ] Login page loads
- [ ] Database queries work (test registration)
- [ ] Real-time features work (if implemented)

---

## Support

- **Issues?** Check [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md#troubleshooting)
- **Questions?** See links in checklist

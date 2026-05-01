# Fix: Setup Vercel Environment Variables (URGENT)

Your app can't register/login because the database connection isn't configured in production.

## Step-by-Step Instructions

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Find and click on your project: **rite-rise1**
3. Click on **Settings** (gear icon at top)

### Step 2: Add Environment Variables
1. In the left sidebar, click **Environment Variables**
2. You'll see a form to add variables

### Step 3: Add EACH of these variables ONE BY ONE

**Variable 1: DATABASE_URL**
- Name: `DATABASE_URL`
- Value: `postgresql://neondb_owner:npg_fu8Vdxe5kSKg@ep-red-darkness-an1hmeqa-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require`
- Environment: Select **Production**
- Click **Add**

**Variable 2: NEXTAUTH_URL**
- Name: `NEXTAUTH_URL`
- Value: `https://rite-rise1.vercel.app`
- Environment: Select **Production**
- Click **Add**

**Variable 3: NEXTAUTH_SECRET**
- Name: `NEXTAUTH_SECRET`
- Value: `college-connect-secret-key-change-in-production`
- Environment: Select **Production**
- Click **Add**

**Variable 4: UPSTASH_REDIS_REST_URL**
- Name: `UPSTASH_REDIS_REST_URL`
- Value: `https://mutual-herring-112054.upstash.io`
- Environment: Select **Production**
- Click **Add**

**Variable 5: UPSTASH_REDIS_REST_TOKEN**
- Name: `UPSTASH_REDIS_REST_TOKEN`
- Value: `gQAAAAAAAbW2AAIgcDE1NDdjMDIzNjNiNjU0NjQ3YmVhYjRlYmE3Zjg2OWE5NQ`
- Environment: Select **Production**
- Click **Add**

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **three dots (•••)** on the right
4. Click **Redeploy**
5. Wait for it to finish (about 1-2 minutes)

### Step 5: Test
1. Go to https://rite-rise1.vercel.app/register
2. Try creating an account
3. Then try logging in at https://rite-rise1.vercel.app/login

## Verification Checklist
- [ ] All 5 variables added in Vercel
- [ ] All set to **Production** environment
- [ ] Clicked "Redeploy"
- [ ] Deployment finished successfully
- [ ] Can create account and login

## Still Having Issues?
- Check Vercel **Function Logs** for database errors
- Make sure you copied the DATABASE_URL exactly (no typos)
- Verify the Neon database is still running

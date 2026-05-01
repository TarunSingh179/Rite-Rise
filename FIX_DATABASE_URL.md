# FIX: Prisma DATABASE_URL Not Set in Vercel

## Error Meaning
Prisma can't find the `DATABASE_URL` environment variable in Vercel production.

## Root Cause
Your `.env` file only works locally. Vercel needs variables set in its dashboard.

## SOLUTION (Follow EXACTLY)

### Step 1: Get Your Database URL
Your Neon database connection string:
```
postgresql://neondb_owner:npg_fu8Vdxe5kSKg@ep-red-darkness-an1hmeqa-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Step 2: Open Vercel Dashboard
- URL: https://vercel.com/dashboard
- Select project: **rite-rise1**

### Step 3: Navigate to Settings
- Look for the **Settings** link at the top navigation (or gear icon)
- Click it

### Step 4: Find Environment Variables
- In the left sidebar, scroll down and find **Environment Variables**
- Click on it

### Step 5: Add DATABASE_URL Variable
Follow these EXACT steps:

1. **Click the text field** labeled "Name"
2. **Type:** `DATABASE_URL` (exactly this)
3. **Click the text field** labeled "Value"  
4. **Paste this exactly:**
   ```
   postgresql://neondb_owner:npg_fu8Vdxe5kSKg@ep-red-darkness-an1hmeqa-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
5. **In the "Environments" dropdown**, select:
   - **✓ Production** (checked)
   - Uncheck Development if checked
6. **Click "Add"**

### Step 6: Add the Other 4 Variables
Repeat Step 5 for each:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXTAUTH_URL` | `https://rite-rise1.vercel.app` | Production |
| `NEXTAUTH_SECRET` | `college-connect-secret-key-change-in-production` | Production |
| `UPSTASH_REDIS_REST_URL` | `https://mutual-herring-112054.upstash.io` | Production |
| `UPSTASH_REDIS_REST_TOKEN` | `gQAAAAAAAbW2AAIgcDE1NDdjMDIzNjNiNjU0NjQ3YmVhYjRlYmE3Zjg2OWE5NQ` | Production |

### Step 7: Verify All 5 Are Added
After adding all, you should see:
- ✅ DATABASE_URL
- ✅ NEXTAUTH_URL
- ✅ NEXTAUTH_SECRET
- ✅ UPSTASH_REDIS_REST_URL
- ✅ UPSTASH_REDIS_REST_TOKEN

All marked as **Production**

### Step 8: Redeploy
1. Go to **Deployments** tab
2. Find the latest deployment at the top
3. Click the **three dots (•••)** on the right side
4. Click **Redeploy**
5. Wait for "Build: ✓ Ready"

### Step 9: Test It
- Visit: https://rite-rise1.vercel.app/register
- Create a test account
- Login with that account

## Screenshot Reference
You should see environment variables listed like:
```
DATABASE_URL                    ••••••••••  Production
NEXTAUTH_URL                    ••••••••••  Production
NEXTAUTH_SECRET                 ••••••••••  Production
UPSTASH_REDIS_REST_URL          ••••••••••  Production
UPSTASH_REDIS_REST_TOKEN        ••••••••••  Production
```

## If You Still See The Error
- Check the Vercel build logs (Deployments → Latest → Build Logs)
- Copy the DATABASE_URL exactly - no extra spaces
- Verify all 5 variables show in Environment Variables list
- Redeploy again

# Vercel Environment Variables Setup

Your app is deployed but needs environment variables configured in Vercel dashboard to work properly.

## Quick Setup (2 mins)

1. **Go to Vercel Dashboard:**
   - Navigate to https://vercel.com/dashboard
   - Select your project: `rite-rise1`

2. **Go to Settings > Environment Variables**

3. **Add these variables:**

| Variable | Value | Type |
|----------|-------|------|
| `NEXTAUTH_URL` | `https://rite-rise1.vercel.app` | Production |
| `NEXTAUTH_SECRET` | `college-connect-secret-key-change-in-production` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://rite-rise1.vercel.app` | Production |
| `DATABASE_URL` | Your Neon connection string | Production |
| `UPSTASH_REDIS_REST_URL` | `https://mutual-herring-112054.upstash.io` | Production |
| `UPSTASH_REDIS_REST_TOKEN` | `gQAAAAAAAbW2AAIgcDE1NDdjMDIzNjNiNjU0NjQ3YmVhYjRlYmE3Zjg2OWE5NQ` | Production |

4. **Redeploy:**
   - After adding variables, go to **Deployments**
   - Click the three dots on the latest deployment
   - Select "Redeploy"

5. **Verify:**
   - Visit https://rite-rise1.vercel.app
   - The app should now load without errors

## Important Notes

- ⚠️ Never commit `.env` with production secrets to GitHub
- 🔒 Use strong `NEXTAUTH_SECRET` in production (consider: `openssl rand -base64 32`)
- 📝 Update `NEXTAUTH_URL` if you use a custom domain

## Having Issues?

- Check Vercel dashboard **Function Logs** for detailed errors
- Verify all required variables are set
- Make sure `DATABASE_URL` is correct and accessible

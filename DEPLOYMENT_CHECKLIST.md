# ✅ Deployment Checklist

## Before You Start

- [ ] You have a [Vercel account](https://vercel.com/signup)
- [ ] You have a [Railway account](https://railway.app/login)
- [ ] Your OpenRouter API key is ready: `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`

## Step 1: Install Tools

```bash
npm run deploy:setup
```

Or manually:
```bash
npm install -g vercel @railway/cli
```

## Step 2: Build Project

```bash
npm run deploy:build
```

## Step 3: Deploy Backend (Railway)

```bash
railway login
railway init
railway up
```

**Set these environment variables in Railway dashboard:**
- [ ] `OPENROUTER_API_KEY=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`
- [ ] `PORT=3000`
- [ ] `NODE_ENV=production`
- [ ] `AI_MODEL=meta-llama/llama-3.1-70b-instruct:free`

**Copy your Railway URL:** `https://______.railway.app`

## Step 4: Deploy Frontend (Vercel)

```bash
cd client
vercel login
vercel
```

**Set this environment variable in Vercel dashboard:**
- [ ] `VITE_API_URL=https://your-railway-url.railway.app`

**Copy your Vercel URL:** `https://______.vercel.app`

## Step 5: Update CORS

**Add to Railway environment variables:**
- [ ] `FRONTEND_URL=https://your-vercel-url.vercel.app`

**Redeploy both:**
```bash
railway up
vercel --prod
```

## Step 6: Test

- [ ] Visit your Vercel URL
- [ ] Try a research query
- [ ] Verify results load correctly

## 🎉 Done!

Your app is now live at:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-api.railway.app

## Quick Commands

```bash
# Deploy backend
railway up

# Deploy frontend
cd client && vercel --prod

# Check logs
railway logs
vercel logs
```
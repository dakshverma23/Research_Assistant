# 🚀 Deploy Your App Now - Step by Step Guide

## Prerequisites

1. **Install deployment tools:**
```bash
# Install Vercel CLI
npm install -g vercel

# Install Railway CLI
npm install -g @railway/cli
```

2. **Create accounts:**
   - [Vercel Account](https://vercel.com/signup) (Free)
   - [Railway Account](https://railway.app/login) (Free $5 credit)

## Step 1: Deploy Backend to Railway 🚂

1. **Login to Railway:**
```bash
railway login
```

2. **Initialize Railway project:**
```bash
railway init
# Choose: "Create new project"
# Project name: "research-assistant-api"
```

3. **Deploy to Railway:**
```bash
railway up
```

4. **Set environment variables in Railway:**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click your project → Variables tab
   - Add these variables:
     ```
     OPENROUTER_API_KEY=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
     PORT=3000
     NODE_ENV=production
     AI_MODEL=meta-llama/llama-3.1-70b-instruct:free
     ```

5. **Get your Railway URL:**
   - In Railway dashboard, copy the domain (e.g., `https://research-assistant-api-production.up.railway.app`)

## Step 2: Deploy Frontend to Vercel 🔷

1. **Login to Vercel:**
```bash
vercel login
```

2. **Deploy from client directory:**
```bash
cd client
vercel
```

3. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? (select your account)
   - Link to existing project? **N**
   - Project name: **intelligent-research-assistant**
   - Directory: **./client** (or just press Enter)
   - Override settings? **N**

4. **Set environment variable in Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click your project → Settings → Environment Variables
   - Add:
     ```
     Name: VITE_API_URL
     Value: https://your-railway-url.railway.app
     ```
   - Click "Add"

5. **Redeploy to apply environment variables:**
```bash
vercel --prod
```

## Step 3: Update CORS Settings 🔧

1. **Update Railway environment variables:**
   - Go back to Railway Dashboard → Variables
   - Add:
     ```
     FRONTEND_URL=https://your-vercel-app.vercel.app
     ```

2. **Redeploy Railway:**
```bash
railway up
```

## Step 4: Test Your Deployment 🧪

1. **Visit your Vercel URL**
2. **Try a research query**
3. **Check that everything works**

## Quick Commands Summary

```bash
# 1. Deploy backend
railway login
railway init
railway up

# 2. Deploy frontend
cd client
vercel login
vercel

# 3. Redeploy after env vars
vercel --prod
railway up
```

## Troubleshooting 🔧

### Common Issues:

1. **CORS Error:**
   - Make sure FRONTEND_URL is set in Railway
   - Make sure VITE_API_URL is set in Vercel

2. **API Not Found:**
   - Check that Railway deployment is successful
   - Verify the Railway URL is correct in Vercel env vars

3. **Build Errors:**
   - Make sure all dependencies are installed
   - Check that shared package builds correctly

### Debug Commands:

```bash
# Check Railway logs
railway logs

# Check Vercel logs
vercel logs

# Test API directly
curl https://your-railway-url.railway.app/api/health
```

## 🎉 Success!

Once deployed, you'll have:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.railway.app`
- **Free hosting** for both!

## Cost Breakdown 💰

- **Vercel**: FREE (100GB bandwidth/month)
- **Railway**: FREE ($5 credit/month)
- **Total**: $0/month for moderate usage

## Next Steps 🚀

1. **Custom Domain** (optional): Add your own domain in Vercel
2. **Monitoring**: Set up error tracking with Sentry
3. **Analytics**: Add Google Analytics
4. **SSL**: Automatic with both platforms

Your app is now live and accessible worldwide! 🌍
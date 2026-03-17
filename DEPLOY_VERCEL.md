# 🚀 Deploy to Vercel (100% FREE)

## Why Vercel?
- **Completely FREE** for personal projects
- **Frontend + Backend** in one platform
- **Serverless functions** for API
- **Automatic deployments** from GitHub
- **Global CDN** for fast loading

## 🎯 One-Click Deployment

### Option 1: Deploy Button (Easiest)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dakshverma23/Research_Assistant)

### Option 2: Manual Deployment

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **Set Environment Variables:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click your project → Settings → Environment Variables
   - Add:
     ```
     OPENROUTER_API_KEY=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
     AI_MODEL=meta-llama/llama-3.1-70b-instruct:free
     NODE_ENV=production
     ```

5. **Redeploy:**
```bash
vercel --prod
```

## 🎉 That's It!

Your app will be live at: `https://your-app.vercel.app`

## Features Included:
- ✅ **Frontend**: React + TypeScript + Tailwind
- ✅ **Backend**: Serverless API functions
- ✅ **AI Research**: OpenRouter integration
- ✅ **Multi-source search**: Google, Bing, Wikipedia
- ✅ **Content extraction**: Smart web scraping
- ✅ **Interactive UI**: Animations and collapsible sections

## Cost: $0/month 💰

Vercel's free tier includes:
- 100GB bandwidth
- Unlimited serverless function invocations
- Global CDN
- Automatic SSL
- Custom domains

## Troubleshooting

### Build Errors:
```bash
# Clear cache and rebuild
vercel --force
```

### Environment Variables:
Make sure all required env vars are set in Vercel dashboard.

### API Issues:
Check function logs in Vercel dashboard → Functions tab.

## 🔗 Useful Links
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Repository](https://github.com/dakshverma23/Research_Assistant)
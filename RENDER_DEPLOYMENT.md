# 🚀 Deploy to Render - Step by Step

## Prerequisites
- GitHub account
- Render account (free at https://render.com)
- Your OpenRouter API key

## 🎯 Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Create Render Service

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub Repository**: 
   - Select your `Research_Assistant` repository
4. **Configure Service**:
   - **Name**: `intelligent-research-assistant`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npm run build:all`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Select "Free" (or paid for better performance)

### 3. Set Environment Variables

In the Render dashboard, go to **Environment** tab and add:

```
OPENROUTER_API_KEY=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
AI_MODEL=meta-llama/llama-3.1-70b-instruct:free
NODE_ENV=production
PORT=10000
```

### 4. Deploy

1. **Click "Create Web Service"**
2. **Wait for build** (5-10 minutes first time)
3. **Your app will be live** at: `https://your-app-name.onrender.com`

## 🎉 What You Get

- **Full App**: Frontend + Backend in one URL
- **Real-time Progress**: All your original features work
- **Zero Code Changes**: Your entire codebase works as-is
- **Automatic SSL**: HTTPS enabled by default
- **Custom Domain**: Can add your own domain later

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### App Won't Start
- Check start logs for errors
- Verify environment variables are set
- Check PORT configuration

### API Errors
- Verify OPENROUTER_API_KEY is correct
- Check API quota and limits
- Review server logs for detailed errors

## 💰 Cost

**Free Tier**:
- 750 hours/month (enough for personal projects)
- Sleeps after 15 minutes of inactivity
- Slower performance

**Paid Tier** ($7/month):
- Always on
- Better performance
- No sleep mode

## 🚀 Going Live

Once deployed, your app will be available at:
**https://intelligent-research-assistant.onrender.com**

All features work exactly as they do locally:
- ✅ Real-time research progress
- ✅ AI-powered analysis
- ✅ Interactive UI with animations
- ✅ Multi-source search
- ✅ Export functionality

## 🔄 Updates

To update your deployed app:
```bash
git add .
git commit -m "Update app"
git push origin main
```

Render will automatically rebuild and redeploy!
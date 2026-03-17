# 🚀 Deploy to Render - Step by Step

## Prerequisites
- GitHub account
- Render account (free at https://render.com)
- Your OpenRouter API key

## ⚠️ IMPORTANT: Choose Your Deployment Method

Render has TWO ways to deploy. Choose ONE:

### Method A: Blueprint (Recommended - Uses render.yaml)
### Method B: Manual Setup (Dashboard only)

---

## 🎯 Method A: Blueprint Deployment (RECOMMENDED)

This method uses the `render.yaml` file for automatic configuration.

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Create Service from Blueprint

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Blueprint"**
3. **Connect GitHub Repository**: 
   - Select your `Research_Assistant` repository
4. **Render will automatically detect `render.yaml`**
5. **Set the OPENROUTER_API_KEY**:
   - When prompted, enter your API key: `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`
6. **Click "Apply"**

That's it! Render will use all settings from `render.yaml`.

---

## 🎯 Method B: Manual Setup (If you already created a service)

### If Render is trying to run Python/gunicorn:

1. **Go to your service in Render dashboard**
2. **Click "Settings"** (left sidebar)
3. **Scroll to "Build & Deploy"**
4. **Change these settings**:
   - **Environment**: Select `Node`
   - **Build Command**: `npm ci && npm run build:all`
   - **Start Command**: `npm run start:prod`
5. **Scroll to "Environment Variables"** and add:
   ```
   OPENROUTER_API_KEY=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
   AI_MODEL=meta-llama/llama-3.1-70b-instruct:free
   NODE_ENV=production
   PORT=10000
   ```
6. **Click "Save Changes"**
7. **Trigger Manual Deploy**: Click "Manual Deploy" → "Deploy latest commit"

---

## ✅ Latest Fixes Applied

The following issues have been resolved:
- ✅ Fixed shared module resolution for TypeScript compilation
- ✅ Enhanced deployment script to copy shared package to node_modules
- ✅ Updated TypeScript path mappings for better module resolution
- ✅ Node.js version set to 20 (latest LTS)
- ✅ All TypeScript strict mode issues resolved
- ✅ Added `.node-version` file to ensure correct Node.js detection

## 🎉 What You Get

- **Full App**: Frontend + Backend in one URL
- **Real-time Progress**: All your original features work
- **Zero Code Changes**: Your entire codebase works as-is
- **Automatic SSL**: HTTPS enabled by default
- **Custom Domain**: Can add your own domain later

## 🔧 Troubleshooting

### "gunicorn: command not found" Error
**Problem**: Render detected your app as Python instead of Node.js

**Solution**:
1. Go to service Settings in Render dashboard
2. Change Environment to `Node`
3. Update Build Command to: `npm ci && npm run build:all`
4. Update Start Command to: `npm run start:prod`
5. Save and redeploy

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility (should be 20)
- Check that shared package builds successfully first

### App Won't Start
- Check start logs for errors
- Verify environment variables are set correctly
- Check PORT configuration (should be 10000)

### API Errors
- Verify OPENROUTER_API_KEY is correct and active
- Check API quota and limits on OpenRouter dashboard
- Review server logs for detailed errors

### "Cannot find module 'shared'" Error
- This has been fixed in the latest deployment script
- The script now copies the shared package to both client and server node_modules
- If you still see this, ensure you're using the latest code from GitHub

## � Cost

**Free Tier**:
- 750 hours/month (enough for personal projects)
- Sleeps after 15 minutes of inactivity
- Slower performance
- Perfect for testing and demos

**Paid Tier** ($7/month):
- Always on
- Better performance
- No sleep mode
- Recommended for production use

## 🚀 Going Live

Once deployed, your app will be available at:
**https://your-app-name.onrender.com**

All features work exactly as they do locally:
- ✅ Real-time research progress
- ✅ AI-powered analysis with Meta Llama 3.1 70B
- ✅ Interactive UI with animations
- ✅ Multi-source search (Wikipedia, Google, Scholar)
- ✅ Export functionality
- ✅ Collapsible key findings
- ✅ Research modes (General, Academic, News, Technical)

## 🔄 Updates

To update your deployed app:
```bash
git add .
git commit -m "Update app"
git push origin main
```

Render will automatically rebuild and redeploy within 5-10 minutes!

## 📝 Environment Variables Reference

| Variable | Value | Required | Description |
|----------|-------|----------|-------------|
| `OPENROUTER_API_KEY` | Your API key | ✅ Yes | OpenRouter API key for AI model access |
| `AI_MODEL` | `meta-llama/llama-3.1-70b-instruct:free` | ✅ Yes | AI model to use (free tier) |
| `NODE_ENV` | `production` | ✅ Yes | Sets production mode |
| `PORT` | `10000` | ✅ Yes | Port for the server (Render default) |

## 🆘 Still Having Issues?

If you're still seeing the gunicorn error:
1. **Delete the existing service** in Render dashboard
2. **Use Method A (Blueprint)** to create a new service
3. This ensures Render uses the correct configuration from `render.yaml`
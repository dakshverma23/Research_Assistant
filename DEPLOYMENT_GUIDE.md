# 🚀 Deployment Guide - Intelligent Research Assistant

## 🎯 Best Deployment Options

### 🆓 **FREE Options (Recommended for Testing)**

#### 1. **Vercel + Railway** ⭐ EASIEST & FREE
- **Frontend**: Vercel (Free tier)
- **Backend**: Railway (Free $5/month credit)
- **Total Cost**: FREE for small usage

#### 2. **Netlify + Render**
- **Frontend**: Netlify (Free tier)
- **Backend**: Render (Free tier with limitations)
- **Total Cost**: FREE with some limitations

#### 3. **GitHub Pages + Heroku**
- **Frontend**: GitHub Pages (Free)
- **Backend**: Heroku (Free tier discontinued, but alternatives exist)

### 💰 **Paid Options (Production Ready)**

#### 1. **Vercel Pro + Railway Pro**
- **Cost**: ~$20-40/month
- **Best for**: Professional use

#### 2. **AWS (EC2 + S3 + CloudFront)**
- **Cost**: ~$10-30/month
- **Best for**: Full control

#### 3. **DigitalOcean Droplet**
- **Cost**: $5-10/month
- **Best for**: Simple VPS hosting

## 🚀 Step-by-Step Deployment

### Option 1: Vercel + Railway (RECOMMENDED)

#### 🎨 Frontend Deployment (Vercel)

1. **Prepare for deployment:**
```bash
# Build the client
npm run build --workspace=client

# Test the build locally
npm run preview --workspace=client
```

2. **Deploy to Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from client directory
cd client
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: intelligent-research-assistant
# - Directory: ./
# - Override settings? N
```

3. **Configure environment variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-railway-backend-url.railway.app`

#### 🔧 Backend Deployment (Railway)

1. **Prepare backend:**
```bash
# Create railway.json in project root
```

2. **Create railway.json:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start --workspace=server",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

3. **Deploy to Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

4. **Set environment variables in Railway:**
   - Go to Railway Dashboard → Your Project → Variables
   - Add all your .env variables:
     - `OPENROUTER_API_KEY`
     - `PORT=3000`
     - `NODE_ENV=production`
     - `GOOGLE_SEARCH_API_KEY` (optional)
     - `BING_SEARCH_API_KEY` (optional)

### Option 2: Docker Deployment

#### 📦 Create Docker Files

1. **Create Dockerfile for backend:**
```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY shared/ ./shared/
COPY server/ ./server/

# Build shared package
RUN npm run build --workspace=shared

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "run", "start", "--workspace=server"]
```

2. **Create Dockerfile for frontend:**
```dockerfile
# client/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY shared/ ./shared/
COPY client/ ./client/

# Build shared package
RUN npm run build --workspace=shared

# Build client
RUN npm run build --workspace=client

# Production stage
FROM nginx:alpine
COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

3. **Create docker-compose.yml:**
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: client/Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:3000

  backend:
    build:
      context: .
      dockerfile: server/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - PORT=3000
      - NODE_ENV=production
```

4. **Deploy with Docker:**
```bash
# Build and run
docker-compose up -d

# Or deploy to any Docker hosting service
```

### Option 3: Traditional VPS (DigitalOcean)

#### 🖥️ VPS Setup

1. **Create a DigitalOcean Droplet:**
   - Ubuntu 22.04 LTS
   - $5/month basic plan
   - Add SSH key

2. **Server setup:**
```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install Nginx
apt install nginx -y

# Clone your repository
git clone https://github.com/yourusername/intelligent-research-assistant.git
cd intelligent-research-assistant

# Install dependencies
npm install

# Build shared package
npm run build --workspace=shared

# Build frontend
npm run build --workspace=client

# Create production environment file
cp .env.example .env
nano .env  # Add your API keys
```

3. **Configure PM2:**
```bash
# Create ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'research-assistant-api',
    script: 'npm',
    args: 'run start --workspace=server',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

4. **Configure Nginx:**
```nginx
# /etc/nginx/sites-available/research-assistant
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /root/intelligent-research-assistant/client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/research-assistant /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 🔧 Pre-Deployment Checklist

### 📋 Code Preparation

1. **Update API URLs:**
```typescript
// client/src/api/client.ts
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api'
  : '/api'
```

2. **Environment Variables:**
```bash
# Production .env
OPENROUTER_API_KEY=your_actual_key
PORT=3000
NODE_ENV=production
GOOGLE_SEARCH_API_KEY=your_google_key  # Optional
BING_SEARCH_API_KEY=your_bing_key      # Optional
```

3. **Build Scripts:**
```json
// package.json
{
  "scripts": {
    "build:all": "npm run build --workspace=shared && npm run build --workspace=client && npm run build --workspace=server",
    "start:prod": "npm run start --workspace=server"
  }
}
```

### 🔒 Security Setup

1. **CORS Configuration:**
```typescript
// server/src/index.ts
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com']
    : ['http://localhost:5173'],
  credentials: true
}))
```

2. **Rate Limiting:**
```bash
npm install express-rate-limit --workspace=server
```

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use('/api', limiter)
```

## 💰 Cost Breakdown

### Free Tier (Testing)
| Service | Cost | Limits |
|---------|------|--------|
| Vercel | FREE | 100GB bandwidth |
| Railway | FREE | $5 credit/month |
| **Total** | **$0** | Good for testing |

### Production (Small Scale)
| Service | Cost/Month | Features |
|---------|------------|----------|
| Vercel Pro | $20 | Unlimited bandwidth |
| Railway Pro | $20 | Better resources |
| **Total** | **$40** | Production ready |

### VPS Option
| Service | Cost/Month | Features |
|---------|------------|----------|
| DigitalOcean | $5-10 | Full control |
| Domain | $10-15/year | Custom domain |
| **Total** | **$6-12** | Most economical |

## 🌐 Domain & SSL

### Custom Domain
1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **Point DNS** to your hosting service
3. **Enable SSL** (usually automatic)

### Free SSL Options
- **Vercel**: Automatic SSL
- **Railway**: Automatic SSL
- **Let's Encrypt**: Free SSL for VPS

## 📊 Monitoring & Analytics

### Free Monitoring
```bash
# Add to your backend
npm install express-status-monitor --workspace=server
```

### Production Monitoring
- **Sentry**: Error tracking
- **LogRocket**: User sessions
- **Google Analytics**: Usage stats

## 🚀 Quick Deploy Commands

### Vercel (Frontend)
```bash
cd client
vercel --prod
```

### Railway (Backend)
```bash
railway up
```

### Docker
```bash
docker-compose up -d --build
```

### VPS
```bash
git pull
npm run build:all
pm2 restart all
```

## 🎯 Recommended Deployment Strategy

### For Learning/Portfolio:
**Vercel + Railway (Free)**
- Easy setup
- No server management
- Good for demos

### For Production:
**DigitalOcean VPS**
- Full control
- Cost effective
- Scalable

### For Enterprise:
**AWS/GCP/Azure**
- Maximum scalability
- Advanced features
- Higher cost

## 🔧 Troubleshooting

### Common Issues:
1. **CORS errors**: Check origin settings
2. **API not found**: Verify proxy configuration
3. **Build failures**: Check Node.js version
4. **Environment variables**: Ensure all keys are set

### Debug Commands:
```bash
# Check logs
pm2 logs
railway logs
vercel logs

# Test API
curl https://your-api-url.com/api/health

# Test build
npm run build:all
```

## 🎉 Summary

**Easiest Option**: Vercel + Railway (Free)
**Most Control**: DigitalOcean VPS ($5/month)
**Best for Scale**: AWS/Vercel Pro ($40/month)

Choose based on your needs:
- **Learning**: Free tier
- **Portfolio**: Free/cheap VPS
- **Business**: Paid hosting

Would you like me to help you deploy to any specific platform? I can guide you through the exact steps! 🚀
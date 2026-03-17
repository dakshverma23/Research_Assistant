#!/bin/bash

# Deployment script for Intelligent Research Assistant
# This script helps deploy to Vercel (frontend) and Railway (backend)

echo "🚀 Starting deployment process..."

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        echo "   npm install -g $2"
        exit 1
    fi
}

echo "🔍 Checking required tools..."
check_tool "vercel" "vercel"
check_tool "railway" "@railway/cli"

# Build the project
echo "🔨 Building the project..."
npm run build --workspace=shared
if [ $? -ne 0 ]; then
    echo "❌ Failed to build shared package"
    exit 1
fi

npm run build --workspace=client
if [ $? -ne 0 ]; then
    echo "❌ Failed to build client"
    exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Railway (backend)
echo "🚂 Deploying backend to Railway..."
railway up
if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy to Railway"
    exit 1
fi

echo "✅ Backend deployed to Railway!"

# Get Railway URL
echo "📋 Please copy your Railway backend URL and update the Vercel environment variable:"
echo "   VITE_API_URL=https://your-railway-app.railway.app"

# Deploy to Vercel (frontend)
echo "🔷 Deploying frontend to Vercel..."
cd client
vercel --prod
if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy to Vercel"
    exit 1
fi

cd ..
echo "✅ Frontend deployed to Vercel!"

echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update VITE_API_URL in Vercel dashboard with your Railway URL"
echo "2. Update FRONTEND_URL in Railway dashboard with your Vercel URL"
echo "3. Test your deployed application"
echo ""
echo "🔗 Useful links:"
echo "   Vercel Dashboard: https://vercel.com/dashboard"
echo "   Railway Dashboard: https://railway.app/dashboard"
@echo off
echo 🚀 Starting deployment process...

echo 🔍 Checking if tools are installed...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Railway CLI not found. Installing...
    npm install -g @railway/cli
)

echo 🔨 Building the project...
call npm run build --workspace=shared
if %errorlevel% neq 0 (
    echo ❌ Failed to build shared package
    pause
    exit /b 1
)

call npm run build --workspace=client
if %errorlevel% neq 0 (
    echo ❌ Failed to build client
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

echo 🚂 Ready to deploy to Railway...
echo Please run: railway login
echo Then run: railway init
echo Then run: railway up
echo.

echo 🔷 Ready to deploy to Vercel...
echo Please run: cd client
echo Then run: vercel login
echo Then run: vercel
echo.

echo 📋 Don't forget to set environment variables!
echo See DEPLOY_NOW.md for detailed instructions.

pause
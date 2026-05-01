@echo off
REM College Network - Deployment Setup Script (Windows)
REM This script guides you through setting up Vercel, Neon, and Upstash

echo.
echo Deployment Setup for College Network
echo =====================================
echo.

REM Step 1: Git Setup
echo Step 1: Preparing Git repository
echo Make sure your code is pushed to GitHub before continuing.
pause

REM Step 2: Environment Variables
echo.
echo Step 2: Setting up environment variables
echo You'll need to create these services and get your credentials:
echo.

echo 1. Neon.tech PostgreSQL Database:
echo    - Visit: https://neon.tech
echo    - Create account and database
echo    - Get connection string
set /p DATABASE_URL="Paste your DATABASE_URL: "
echo.

echo 2. Upstash Redis (Optional):
echo    - Visit: https://upstash.com
echo    - Create Redis database
echo    - Press Enter to skip if not using Redis
set /p REDIS_URL="Paste your REDIS_URL (optional): "
if not "%REDIS_URL%"=="" (
    set /p REDIS_TOKEN="Paste your REDIS_TOKEN: "
)
echo.

REM Step 3: Database Setup
echo Step 3: Setting up database
echo Running Prisma migrations...
call npx prisma db push
echo Database setup complete
echo.

REM Step 4: Vercel Deployment
echo Step 4: Deploying to Vercel
echo Visit: https://vercel.com/new
echo Connect your GitHub repository and add these environment variables:
echo   - DATABASE_URL=%DATABASE_URL%
if not "%REDIS_URL%"=="" (
    echo   - REDIS_URL=%REDIS_URL%
    echo   - REDIS_TOKEN=%REDIS_TOKEN%
)
echo   - NEXTAUTH_SECRET=(generate for production)
echo   - NEXTAUTH_URL=https://your-domain.vercel.app
echo.
pause

echo.
echo Deployment Prep Complete!
echo Your application is ready to be live with:
echo   Frontend: Vercel
echo   Database: Neon.tech
echo   Realtime: Database Polling (Serverless)

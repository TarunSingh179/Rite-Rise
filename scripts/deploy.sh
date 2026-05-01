#!/bin/bash

# College Network - Deployment Setup Script
# This script guides you through setting up Vercel, Neon, and Upstash

set -e

echo "🚀 College Network - Deployment Setup"
echo "======================================"
echo ""

# Step 1: Git Setup
echo "📦 Step 1: Preparing Git repository"
echo "Make sure your code is pushed to GitHub before continuing."
read -p "Press Enter when your code is pushed to GitHub..."
echo ""

# Step 2: Environment Variables
echo "🔑 Step 2: Setting up environment variables"
echo "You'll need to create these services and get your credentials:"
echo ""
echo "1. Neon.tech PostgreSQL Database:"
echo "   - Visit: https://neon.tech"
echo "   - Create account and database"
echo "   - Get connection string: postgresql://user:password@host/database"
read -p "Paste your DATABASE_URL: " DATABASE_URL
echo ""

echo "2. Upstash Redis:"
echo "   - Visit: https://upstash.com"
echo "   - Create Redis database"
echo "   - Get REDIS_URL and token"
read -p "Paste your REDIS_URL: " REDIS_URL
read -p "Paste your REDIS_TOKEN: " REDIS_TOKEN
echo ""

# Step 3: Create .env.local
echo "📝 Creating .env.local"
cat > .env.local << EOF
# Database - Neon.tech
DATABASE_URL="$DATABASE_URL"

# Redis - Upstash
REDIS_URL="$REDIS_URL"
REDIS_TOKEN="$REDIS_TOKEN"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WS_URL="http://localhost:3000"
EOF

echo "✅ .env.local created"
echo ""

# Step 4: Database Setup
echo "💾 Step 3: Setting up database"
echo "Running Prisma migrations..."
npm run db:push
echo "✅ Database setup complete"
echo ""

# Step 5: Vercel Deployment
echo "🌐 Step 4: Deploying to Vercel"
echo "Visit: https://vercel.com/new"
echo "1. Connect your GitHub repository"
echo "2. Add environment variables:"
echo "   - DATABASE_URL=$DATABASE_URL"
echo "   - REDIS_URL=$REDIS_URL"
echo "   - REDIS_TOKEN=$REDIS_TOKEN"
echo "   - NEXTAUTH_SECRET=(generate new one for production)"
echo "   - NEXTAUTH_URL=https://your-domain.vercel.app"
echo ""
read -p "Press Enter after deploying to Vercel..."
echo ""

echo "✅ Deployment Complete!"
echo ""
echo "Your application is now live with:"
echo "  Frontend: Vercel"
echo "  Database: Neon.tech"
echo "  Cache/Realtime: Upstash Redis"

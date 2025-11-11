# 🚀 SkillSyncAI - Deployment Guide

**Last Updated**: November 11, 2025  
**Project**: AI-LMS  
**Status**: Production Ready

---

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deploy to Vercel (Recommended)](#deploy-to-vercel-recommended)
3. [Deploy to AWS](#deploy-to-aws)
4. [Deploy to DigitalOcean](#deploy-to-digitalocean)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] All tests pass: `npm run lint`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in production build

### Database
- [ ] Migrations applied: `npm run db:push`
- [ ] Database backups enabled
- [ ] Connection string uses production database
- [ ] Database has proper indexes (see schema)

### Environment
- [ ] All `.env` variables set (see template)
- [ ] Clerk webhook configured
- [ ] CORS origins configured correctly
- [ ] No hardcoded secrets in code

### Security
- [ ] `NODE_ENV=production` set
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] CORS whitelist set
- [ ] Security headers configured

### Performance
- [ ] Next.js build optimization verified
- [ ] Images optimized
- [ ] Bundle size acceptable
- [ ] Database queries optimized

### Testing
- [ ] Authentication flow tested
- [ ] Role-based access tested
- [ ] Course enrollment tested
- [ ] Admin functions tested

---

## 🎯 Deploy to Vercel (Recommended)

### Why Vercel?
- ✅ Optimized for Next.js
- ✅ Automatic deployments from Git
- ✅ Serverless functions included
- ✅ Free tier available
- ✅ Global edge network

### Step 1: Prepare Repository

```powershell
# Ensure all changes committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub/GitLab/Bitbucket
3. Authorize Vercel to access your repositories

### Step 3: Import Project

1. Click "Add New..." → "Project"
2. Select your `AI-LMS` repository
3. Configure build settings:
   - **Framework**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Step 4: Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add all variables from `.env.local`:

```
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
NEXT_PUBLIC_APP_URL
NODE_ENV (set to "production")
```

3. For each variable:
   - Select environments: **Production, Preview, Development**
   - Add value
   - Click "Save"

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete (5-10 minutes)
3. View deployment at `https://<project>.vercel.app`

### Step 6: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

### Step 7: Configure Webhooks

1. Go to Clerk dashboard
2. Settings → Webhooks
3. Add endpoint: `https://<your-domain>/api/webhooks/clerk`
4. Subscribe to: **user.created**, **user.updated**, **user.deleted**

### Automatic Deployments

Vercel will automatically deploy when you push to `main`:

```powershell
# Deploy to production
git push origin main

# Deploy to staging (preview)
git push origin staging
```

---

## ☁️ Deploy to AWS

### Architecture
```
Route 53 (DNS)
     ↓
CloudFront (CDN)
     ↓
Application Load Balancer
     ↓
EC2 Instances (Auto-scaling)
     ↓
RDS PostgreSQL
     ↓
S3 (file storage)
```

### Step 1: Create AWS Account

1. Go to [https://aws.amazon.com](https://aws.amazon.com)
2. Sign up or use existing account
3. Create IAM user for deployment

### Step 2: Set Up RDS Database

```powershell
# Via AWS Console:
# 1. Go to RDS → Create Database
# 2. Engine: PostgreSQL 14
# 3. Template: Production
# 4. Allocate storage: 20 GB minimum
# 5. Enable backup: 7 days
# 6. Enable encryption

# Note the connection string:
# postgresql://admin:password@mydb.xxxxx.rds.amazonaws.com:5432/skillsyncai
```

### Step 3: Create EC2 Instance

```bash
# 1. Go to EC2 → Launch Instance
# 2. AMI: Ubuntu 22.04 LTS
# 3. Instance type: t3.medium (or larger for production)
# 4. Storage: 30 GB (gp3)
# 5. Security group: Allow ports 80, 443, 22

# SSH into instance
ssh -i mykey.pem ubuntu@<public-ip>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone repository
git clone https://github.com/LeveL-P1/AI-LMS.git
cd AI-LMS

# Install dependencies
npm install

# Create .env file
nano .env.production

# Add all environment variables
# (use Shift+Insert to paste)

# Build application
npm run build

# Start with PM2
pm2 start "npm start" --name "skillsyncai"
pm2 save
sudo pm2 startup

# Enable HTTPS with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --standalone -d yourdomain.com
```

### Step 4: Configure Nginx

```bash
sudo apt install nginx -y

# Create config file
sudo nano /etc/nginx/sites-available/skillsyncai

# Add configuration:
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/skillsyncai /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5: Set Up Auto-Scaling

1. Go to EC2 → Auto Scaling Groups
2. Create launch template with your instance configuration
3. Set minimum instances: 2
4. Set maximum instances: 5
5. Configure scaling policies based on CPU/memory

---

## 🌊 Deploy to DigitalOcean

### Recommended: App Platform (Easiest)

1. Go to [https://cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Click **Create** → **Apps**
3. Select your GitHub repository
4. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Run Command**: `npm start`
   - **Port**: 3000
5. Add environment variables
6. Add PostgreSQL database
7. Deploy

### Alternative: Droplets (More Control)

```bash
# Create Droplet (Ubuntu 22.04, $6/month starter)
# SSH into droplet
ssh root@your-ip

# Follow same steps as AWS EC2 above
# Install Node.js, PM2, Nginx, SSL
```

---

## 🔧 Environment Configuration

### Production `.env`

```
# Database (use managed database service)
DATABASE_URL="postgresql://user:pass@db.service.com:5432/skillsyncai"
DIRECT_URL="postgresql://user:pass@db.service.com:5432/skillsyncai"

# Clerk (production keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_xxx"
CLERK_SECRET_KEY="sk_live_xxx"
CLERK_WEBHOOK_SECRET="whsec_xxx"

# Clerk URLs (update to production domain)
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

# Supabase (production)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx"
SUPABASE_SERVICE_ROLE_KEY="eyJxxx"

# OpenAI
OPENAI_API_KEY="sk-xxx"

# App Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Security Headers

Add to `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
```

---

## 📊 Post-Deployment

### Verification

```powershell
# Test endpoints
$domain = "https://yourdomain.com"

# Landing page
Invoke-WebRequest "$domain/" | Select-Object StatusCode

# Sign in page
Invoke-WebRequest "$domain/sign-in" | Select-Object StatusCode

# API health
Invoke-WebRequest "$domain/api/courses" | Select-Object StatusCode

# Check HTTPS
Invoke-WebRequest -Uri "$domain" -SkipHttpsCheck:$false
```

### Database Backup

For Vercel + Supabase:
1. Supabase automatically backs up daily
2. Enable automated backups in console
3. Test restore procedure monthly

For AWS RDS:
1. Enable automated backups: 7 days retention
2. Test restore to separate instance
3. Document restore procedure

### DNS Configuration

```
Record Type    Name                Value
A              yourdomain.com      <IP address>
CNAME          www                 yourdomain.com
MX             yourdomain.com      (email setup)
TXT            @                   (SPF, DKIM, etc)
```

---

## 📈 Monitoring & Maintenance

### Uptime Monitoring

Set up with UptimeRobot or similar:

```
Service: HTTP Monitor
URL: https://yourdomain.com/api/health
Interval: Every 5 minutes
Alert: Email/Slack if down for 5+ minutes
```

### Error Tracking

```powershell
# Option 1: Sentry (recommended)
# 1. Create account at https://sentry.io
# 2. Create Next.js project
# 3. Add to next.config.ts

# Option 2: Built-in Next.js error logging
# Logs to: /var/log/pm2/app.log (if using PM2)
```

### Performance Monitoring

```powershell
# Google Lighthouse
# Test at: https://pagespeed.web.dev/

# Target scores:
# - Performance: 90+
# - Accessibility: 90+
# - Best Practices: 90+
# - SEO: 90+
```

### Database Maintenance

```sql
-- Monthly: Analyze query performance
ANALYZE;

-- Quarterly: Reindex
REINDEX DATABASE skillsyncai;

-- Monitor connections
SELECT count(*) FROM pg_stat_activity;

-- Check disk usage
SELECT pg_database.datname,
       pg_size_pretty(pg_database_size(pg_database.datname))
FROM pg_database;
```

### Update Dependencies

```powershell
# Check for updates
npm outdated

# Update minor versions
npm update

# Update major versions (be careful!)
npm install -g npm-check-updates
ncu -u
npm install

# Rebuild and test
npm run build
npm run lint
npm test

# Deploy to staging first
git push origin staging

# Once verified, deploy to production
git push origin main
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Build fails** | Check logs, ensure all env vars set, run `npm install` fresh |
| **Database connection error** | Verify DATABASE_URL, check security groups/firewall |
| **Clerk webhook fails** | Verify webhook secret in Clerk dashboard & .env |
| **CORS errors** | Check origin whitelist in Clerk & API config |
| **Memory limit exceeded** | Increase instance size or optimize database queries |
| **High latency** | Enable caching, optimize images, check database query time |

---

## 📞 Deployment Support

For detailed help:
1. **Vercel Docs**: https://vercel.com/docs
2. **Next.js Deployment**: https://nextjs.org/docs/deployment
3. **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment
4. **Clerk Deployment**: https://clerk.com/docs/deployment/overview

---

**Created**: November 11, 2025  
**Project**: SkillSyncAI v0.1.0  
**Recommended**: Deploy to Vercel for easiest setup

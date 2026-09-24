# ☁️ FileConverter Pro — Free Cloud Deployment Guide

This guide details how to deploy the entire **FileConverter Pro** SaaS (Next.js Frontend, Node.js Microservices, PostgreSQL, Redis, and Object Storage) using 100% free cloud provider tiers.

---

## 🏗️ Architecture Overview for Cloud Deployment

| Layer | Recommended Free Cloud Provider | Free Tier Specs |
|---|---|---|
| **Frontend SPA** | **Vercel** | Unlimited deployments, global CDN Edge Network. |
| **Backend Microservices** | **Render** or **Koyeb** | Docker web services, auto SSL, continuous deployment from GitHub. |
| **PostgreSQL Database** | **Supabase** or **Render Postgres** | 500MB database, pgvector support, auto backups. |
| **Redis Cache & Queues** | **Upstash Redis** | 10,000 requests/day, serverless Redis compatibility. |
| **S3 Storage (Files & Results)**| **Cloudflare R2** or **Supabase Storage** | 10 GB free storage/month, zero egress fees. |

---

## 1. 🌐 Step 1: Deploy Next.js Frontend to Vercel (Free)

1. Sign in to [Vercel](https://vercel.com) using your GitHub account (`hamdiouni`).
2. Click **Add New > Project** and select your repository: `hamdiouni/fileconverter-frontend`.
3. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
4. Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://fileconverter-backend.onrender.com/api/v1
   NEXT_PUBLIC_S3_ENDPOINT=https://<your-r2-or-supabase-bucket-url>
   NEXT_PUBLIC_SITE_URL=https://fileconverter-frontend.vercel.app
   ```
5. Click **Deploy**. Vercel will build and assign your free live domain (e.g., `https://fileconverter-frontend.vercel.app`).

---

## 2. 🗄️ Step 2: Provision Free PostgreSQL Database (Supabase)

1. Sign up at [Supabase](https://supabase.com).
2. Create a new project named `fileconverter-db`.
3. Go to **Project Settings > Database** and copy your **Connection String (URI)**:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres
   ```
4. Apply database migrations:
   ```bash
   cd backend
   npx prisma migrate deploy --schema=./prisma/schema.prisma
   ```

---

## 3. ⚡ Step 3: Provision Free Redis (Upstash)

1. Sign up at [Upstash](https://upstash.com).
2. Create a Serverless Redis database:
   - Region: Select nearest to your backend services.
   - TLS: Enabled.
3. Copy your Redis connection string:
   ```env
   REDIS_URL=rediss://default:[YOUR-PASSWORD]@[YOUR-ENDPOINT].upstash.io:6379
   ```

---

## 4. 🪣 Step 4: Provision Free S3 Object Storage (Cloudflare R2)

1. Sign up at [Cloudflare](https://dash.cloudflare.com).
2. Go to **R2 Object Storage** and create 2 buckets:
   - `fileconverter-uploads`
   - `fileconverter-results`
3. Click **Manage R2 API Tokens** > **Create API Token** (Permissions: Edit/Read/Write).
4. Save credentials:
   ```env
   S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
   S3_ACCESS_KEY_ID=<YOUR_R2_ACCESS_KEY>
   S3_SECRET_ACCESS_KEY=<YOUR_R2_SECRET_KEY>
   S3_BUCKET_UPLOADS=fileconverter-uploads
   S3_BUCKET_RESULTS=fileconverter-results
   ```

---

## 5. 🐳 Step 5: Deploy Backend Microservices to Render (Free)

1. Sign in to [Render](https://render.com).
2. Click **New + > Web Service**.
3. Select your repository: `hamdiouni/fileconverter-backend`.
4. Environment Variables:
   Set the following variables in Render dashboard:
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
   REDIS_URL=rediss://default:[PASSWORD]@[ENDPOINT].upstash.io:6379
   JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_32_chars_min
   JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_32_chars_min
   S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
   S3_ACCESS_KEY_ID=<R2_KEY>
   S3_SECRET_ACCESS_KEY=<R2_SECRET>
   GUEST_DAILY_LIMIT=20
   ```
5. Render automatically builds the Dockerfile and exposes your backend API at `https://fileconverter-backend.onrender.com`.

---

## ✅ Deployment Checklist

- [x] Frontend pushed to GitHub (`https://github.com/hamdiouni/fileconverter-frontend`)
- [x] Backend pushed to GitHub (`https://github.com/hamdiouni/fileconverter-backend`)
- [x] Vercel Frontend Deployment configured
- [x] Free PostgreSQL (Supabase) schema applied
- [x] Free Redis (Upstash) connected
- [x] Free Cloudflare R2 S3 storage configured

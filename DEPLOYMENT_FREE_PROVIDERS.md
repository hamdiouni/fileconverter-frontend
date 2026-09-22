# 100% Free Cloud Deployment Guide (Zero Fees, No Credit Card Required)

This guide provides three completely free deployment options for the **FileConverter Pro Backend** that require **NO payment or credit card**, and connects it to your live Vercel frontend (`https://fileconverter-frontend-fawn.vercel.app`).

---

## Why Render Asked for a Fee & How It's Fixed

Render previously showed a payment/credit card prompt because the blueprint requested a **Managed PostgreSQL Addon**. 
We have upgraded the backend Docker container ([Dockerfile](file:///c:/Users/HP/OneDrive/Bureau/New%20folder/converter-main/backend/Dockerfile)) to run an **embedded PostgreSQL + Redis** stack internally. 

The blueprint ([render.yaml](file:///c:/Users/HP/OneDrive/Bureau/New%20folder/converter-main/backend/render.yaml)) now uses **only** the 100% Free Web Service with **zero database addons**.

---

## Option 1: Koyeb (Recommended — 100% Free, No Credit Card)

[Koyeb](https://www.koyeb.com) provides a generous Free Eco tier that runs Docker containers directly from GitHub with zero credit card required.

### Steps to Deploy:
1. Go to **[app.koyeb.com](https://app.koyeb.com)** and sign up / log in with your GitHub account (**`hamdiouni`**).
2. Click **Create Service**.
3. Under **Deployment Method**, select **GitHub**.
4. Select your public repository: **`hamdiouni/fileconverter-backend`**.
5. In **Builder**, select **Dockerfile** (it will auto-detect the root `Dockerfile`).
6. In **Ports**, verify or set port to **`8080`** (Protocol: HTTP, Path: `/`).
7. In **Instance Type**, select **Free (Eco)** ($0.00 / month).
8. Click **Deploy**.
9. In ~2 minutes, your service will be live with a public HTTPS URL:
   ```
   https://<your-service>-hamdiouni.koyeb.app
   ```

---

## Option 2: Hugging Face Spaces (16 GB RAM Free Forever, No Credit Card)

[Hugging Face Spaces](https://huggingface.co/spaces) offers free Docker container hosting with **16 GB RAM and 2 vCPUs** with **zero payment info**.

### Steps to Deploy:
1. Go to **[huggingface.co/new-space](https://huggingface.co/new-space)** (create a free account if you don't have one).
2. Set **Space name**: `fileconverter-api`.
3. Set **License**: `mit` (or open).
4. Select **Space SDK**: **Docker** &rarr; **Blank**.
5. Set **Space hardware**: **Free (2 vCPU · 16 GB RAM)**.
6. Set **Visibility**: **Public**.
7. Click **Create Space**.
8. In your terminal, push the backend code to your Hugging Face space:
   ```bash
   cd backend
   git remote add space https://huggingface.co/spaces/hamdiouni/fileconverter-api
   git push space master:main
   ```
9. Your space will build and launch at:
   ```
   https://hamdiouni-fileconverter-api.hf.space
   ```

---

## Option 3: Render (Free Web Service without Database Gate)

Now that the database requirement is removed from [render.yaml](file:///c:/Users/HP/OneDrive/Bureau/New%20folder/converter-main/backend/render.yaml):

1. Go to **[dashboard.render.com](https://dashboard.render.com)**.
2. Click **New +** &rarr; **Web Service** (do NOT choose Blueprint).
3. Connect **`hamdiouni/fileconverter-backend`**.
4. Select **Docker** environment.
5. Select **Free Instance Type** ($0/month).
6. Click **Create Web Service**.
7. Render will build and deploy without asking for any credit card or fee!

---

## Connecting the Cloud Backend to Your Deployed Vercel Frontend

Once your backend is deployed on any of the options above:

1. Copy your new backend public URL (e.g., `https://fileconverter-backend-hamdiouni.koyeb.app` or `https://fileconverter-backend-api.onrender.com`).
2. Go to your **[Vercel Dashboard](https://vercel.com)** &rarr; Project **`fileconverter-frontend-fawn`**.
3. Navigate to **Settings** &rarr; **Environment Variables**.
4. Add or update:
   ```env
   NEXT_PUBLIC_API_URL=https://<your-backend-url>/api/v1
   ```
   *(Example: `https://fileconverter-backend-hamdiouni.koyeb.app/api/v1`)*
5. Go to **Deployments** &rarr; Click `...` on the latest deployment &rarr; **Redeploy**.

Your Vercel frontend is now connected to your live free cloud backend!

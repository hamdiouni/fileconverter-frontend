# 🚀 FileConverter Pro — Frontend Web Application

**FileConverter Pro** is a modern, high-performance web application for converting files across **2,021 conversion pairs** and **11 format categories** (Images, Video, Audio, Documents, Spreadsheets, Presentations, Archives, Ebooks, Vector graphics, Fonts, and CAD).

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Zustand**.

---

## 🌟 Key Features

- **⚡ 2,021 Conversion Pairs**: Supports 199 file formats across 11 major categories.
- **🎁 Guest Mode**: 20 free daily file conversions without creating an account or logging in.
- **🎨 Dark & Light Theme**: Persistent theme switcher powered by Tailwind CSS.
- **📱 36 Pre-rendered Pages**: Interactive tools catalog (`/tools`), category pages (`/tools/[category]`), convert page (`/convert`), auth flows (`/auth/login`, `/auth/signup`, `/auth/reset`), dashboard, and compliance pages (`/terms`, `/privacy`, `/security`, `/cookies`, `/help`, `/contact`, `/status`, `/enterprise`).
- **🔐 User Dashboard**: API Key management, webhook management, user settings, and account management.
- **Direct S3 Presigned Uploads**: Instant file upload directly to S3/MinIO buckets with progress tracking.

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server & Client Components) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Shadcn UI components |
| **State Management** | Zustand (persistent auth store) |
| **Icons** | Lucide React |
| **Toasts** | Sonner |
| **Deployment** | Vercel / Docker |

---

## 📦 Getting Started

### Prerequisites
- **Node.js**: v18.x or v20.x
- **npm**: v9+ or v10+

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/hamdiouni/fileconverter-frontend.git
cd fileconverter-frontend

# 2. Install dependencies
npm install

# 3. Create .env.local file
cp .env.example .env.local  # or edit .env.local manually
```

### Environment Variables (`.env.local`)

```env
# URL of Nginx API Gateway (Reverse proxy routing to microservices)
NEXT_PUBLIC_API_URL=http://localhost:80/api/v1

# Direct MinIO / S3 endpoint for presigned URL uploads
NEXT_PUBLIC_S3_ENDPOINT=http://localhost:9000

# Public origin URL of the Next.js app
NEXT_PUBLIC_SITE_URL=http://localhost:8080

NODE_ENV=development
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) (or `http://localhost:3000`) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## ☁️ Cloud Deployment (Free Tier)

This frontend application is optimized for **1-Click Deployment on Vercel**:

1. Push your code to GitHub (`hamdiouni/fileconverter-frontend`).
2. Connect your repository to [Vercel](https://vercel.com).
3. Set environment variable `NEXT_PUBLIC_API_URL` to your production backend API gateway URL.
4. Click **Deploy**.

For step-by-step instructions covering Vercel, Supabase, Upstash, Cloudflare R2, and Render, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 📚 Related Repositories & Guides

- ⚙️ **Backend Microservices**: [hamdiouni/fileconverter-backend](https://github.com/hamdiouni/fileconverter-backend)
- 📖 **Complete Manual Configurations Guide**: [`CONFIGURATION.md`](./CONFIGURATION.md)
- ☁️ **Free Cloud Deployment Guide**: [`DEPLOYMENT.md`](./DEPLOYMENT.md)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

# FileConverter Pro — Complete Manual & System Configurations Guide

This document provides an exhaustive manual configuration guide for all layers of the **FileConverter Pro** platform: Next.js Frontend, Backend Microservices, PostgreSQL Database, Redis Caching, MinIO Object Storage, Python Conversion Workers, Nginx API Gateway, and the Observability Stack (Grafana, Prometheus, Loki, Alertmanager, MailHog).

---

## 📐 System Architecture & Data Flow

```
Frontend (Next.js SPA on :8080)
       │
       ▼
Nginx API Gateway (Port :80)
       ├──> /api/v1/auth          ➜ Auth Service (:3000)
       ├──> /api/v1/users         ➜ User Service (:3001)
       ├──> /api/v1/uploads       ➜ Upload Service (:3002) ──> MinIO S3 Storage (:9000)
       ├──> /api/v1/conversions   ➜ Orchestrator (:3003)  ──> Redis Queue (:6379) & Postgres (:5432)
       ├──> /api/v1/billing       ➜ Billing Service (:3004)
       ├──> /api/v1/notifications ➜ Notification Service (:3005)
       └──> /api/v1/admin         ➜ Admin Service (:3006)

Redis Worker Streams (:6379)
       ├──> Image Worker (ImageMagick / libvips)
       ├──> Video Worker (FFmpeg)
       ├──> Audio Worker (FFmpeg)
       ├──> Document Worker (LibreOffice)
       ├──> CAD & Font Worker (FreeCAD / FontForge)
       └──> Archive Worker (7-Zip / unar)
```

---

## 1. 🌐 Next.js Frontend Configuration

Location: `c:\Users\HP\OneDrive\Bureau\New folder\converter-main\.env.local`

Create or update `.env.local` in the project root:

```env
# URL of Nginx API Gateway (Reverse proxy routing to microservices)
NEXT_PUBLIC_API_URL=http://localhost:80/api/v1

# Direct MinIO S3 endpoint for presigned URL file uploads/downloads
NEXT_PUBLIC_S3_ENDPOINT=http://localhost:9000

# Canonical public origin URL of the Next.js app
NEXT_PUBLIC_SITE_URL=http://localhost:8080

# Environment mode
NODE_ENV=development
```

---

## 2. ⚙️ Backend Microservices Configuration

Location: `c:\Users\HP\OneDrive\Bureau\New folder\converter-main\backend\.env`

Create or update `backend/.env`:

```env
# ── Environment ──────────────────────────────────────────────────────────────
NODE_ENV=development

# ── PostgreSQL Database ──────────────────────────────────────────────────────
POSTGRES_USER=fileconverter
POSTGRES_PASSWORD=fileconverter_dev
POSTGRES_DB=fileconverter
POSTGRES_PORT=5432
DATABASE_URL=postgresql://fileconverter:fileconverter_dev@postgres:5432/fileconverter

# ── Redis In-Memory Store & Streams ──────────────────────────────────────────
REDIS_PASSWORD=redis_dev_password
REDIS_PORT=6379
REDIS_URL=redis://:redis_dev_password@redis:6379

# ── JWT Authentication Secrets ───────────────────────────────────────────────
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_32_chars_min
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_32_chars_min
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ── MinIO / AWS S3 Object Storage ────────────────────────────────────────────
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin_dev
S3_ENDPOINT=http://minio:9000
S3_REGION=us-east-1
S3_BUCKET_UPLOADS=fileconverter-uploads
S3_BUCKET_RESULTS=fileconverter-results
S3_BUCKET_TEMP=fileconverter-temp
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin_dev

# ── Microservice Port Bindings ───────────────────────────────────────────────
AUTH_SERVICE_PORT=3000
USER_SERVICE_PORT=3001
UPLOAD_SERVICE_PORT=3002
ORCHESTRATOR_SERVICE_PORT=3003
BILLING_SERVICE_PORT=3004
NOTIFICATION_SERVICE_PORT=3005
ADMIN_SERVICE_PORT=3006
API_GATEWAY_PORT=80
FRONTEND_PORT=8080

# ── Stripe Billing & Webhooks (Optional for local dev) ──────────────────────
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 3. 📦 MinIO S3 Storage Buckets & Policies

MinIO runs on `http://localhost:9000` (Console: `http://localhost:9001`).

### Required Storage Buckets
The `fc_minio_init` service automatically creates the following 3 buckets on startup:
1. `fileconverter-uploads`: Stores original user uploads via presigned URLs.
2. `fileconverter-results`: Stores output files after conversion.
3. `fileconverter-temp`: Stores temporary chunked/multipart working files.

### CORS & Anonymous Access Policy
To permit direct browser uploads and file downloads from `http://localhost:8080`, execute:
```bash
# Register local MinIO client alias
docker exec -it fc_minio_init mc alias set local http://minio:9000 minioadmin minioadmin_dev

# Grant public download access for generated result files
docker exec -it fc_minio_init mc anonymous set download local/fileconverter-uploads
docker exec -it fc_minio_init mc anonymous set download local/fileconverter-results
```

---

## 4. 🐍 Python Conversion Workers Concurrency

Set host CPU/RAM worker concurrency in `backend/.env` according to hardware specs:

| Worker Service | Technology / Core Tool | Recommended Local Concurrency |
|---|---|---|
| `IMAGE_WORKER_CONCURRENCY` | ImageMagick, libvips, Pillow | `2` |
| `VIDEO_WORKER_CONCURRENCY` | FFmpeg (H.264, VP9, AV1) | `1` |
| `AUDIO_WORKER_CONCURRENCY` | FFmpeg (MP3, AAC, FLAC) | `2` |
| `DOCUMENT_WORKER_CONCURRENCY` | LibreOffice, Pandoc, pdf2image | `1` |
| `CAD_FONT_WORKER_CONCURRENCY` | FreeCAD, FontForge | `1` |
| `ARCHIVE_WORKER_CONCURRENCY` | 7-Zip, unar | `2` |

---

## 5. 🔀 Nginx API Gateway CORS & Route Configuration

Location: `backend/services/api-gateway/conf.d/fileconverter.conf`

All external HTTP traffic from the web browser (`http://localhost:8080`) routes through port `:80`.

### Key Gateway Requirements:
1. **No Location Trailing Slashes**: All route definitions MUST be specified without trailing slashes (e.g. `location /api/v1/uploads`) to prevent 301 redirects on preflight requests.
2. **CORS Preflight (204 OK)**:
   ```nginx
   if ($request_method = 'OPTIONS') {
       add_header 'Access-Control-Allow-Origin' '*' always;
       add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
       add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,X-API-Key' always;
       add_header 'Access-Control-Max-Age' 1728000;
       add_header 'Content-Type' 'text/plain; charset=utf-8';
       add_header 'Content-Length' 0;
       return 204;
   }
   ```

---

## 6. 📊 Observability & Monitoring Dashboards

| Monitoring Component | URL / Port | Purpose / Default Credentials |
|---|---|---|
| **Grafana Dashboards** | `http://localhost:3100` | Real-time service metrics & logs (`admin` / `admin`). |
| **Prometheus** | `http://localhost:9090` | Scrapes `/metrics` endpoints across all 8 microservices. |
| **MailHog Web UI** | `http://localhost:8025` | Development SMTP email inbox for auth emails & notifications. |
| **Loki Log Engine** | `http://localhost:3200` | Aggregates stdout/stderr logs from all Docker containers. |
| **Alertmanager** | `http://localhost:9093` | Alert routing engine. |

---

## 7. 🎁 Guest Mode & Anonymous Usage Configuration

Guest Mode enables first-time visitors to convert up to **5 files per day** without creating an account or logging in.

### Technical Implementation:
1. **Middleware Fallback**: When an HTTP request lacks an `Authorization: Bearer ...` header, `authenticate` middleware generates a guest user identity:
   - `userId`: `guest_<client_ip>` (e.g. `guest_127_0_0_1`)
   - `tier`: `guest`
   - `email`: `guest_<ip>@guest.local`
2. **Database Provisioning**: The `upsert` pattern ensures a guest User record exists in PostgreSQL so foreign key checks on `file_uploads` and `conversion_jobs` pass seamlessly.
3. **Redis Rate Limiting**:
   - Cache key format: `guest_daily_uploads:<guest_ip>:<YYYY-MM-DD>`
   - Daily limit: `5` conversions per IP address per calendar day.
   - TTL: `86400` seconds (24 hours).
   - Upon exceeding 5 uploads, the API responds with HTTP `429 GUEST_LIMIT_EXCEEDED` prompting the user to create a free account.

---

## 8. 📊 Grafana Manual Provisioning & Metrics Setup

Grafana provides real-time system visualization, worker queue monitoring, CPU/Memory utilization, and log aggregation.

- **Access URL**: `http://localhost:3100`
- **Default Credentials**: `admin` / `admin`

### Step-by-Step Manual Grafana Configuration:

#### 1. Add Datasources:
1. Navigate to **Connections > Data Sources > Add data source** in Grafana.
2. **Prometheus**:
   - Name: `Prometheus`
   - URL: `http://prometheus:9090` (internal Docker host) or `http://localhost:9090` (host system)
   - Save & Test.
3. **Loki**:
   - Name: `Loki`
   - URL: `http://loki:3100` (internal Docker host) or `http://localhost:3200` (host system)
   - Save & Test.

#### 2. Automatic Docker Provisioning:
Alternatively, Grafana is pre-configured via files in `backend/monitoring/grafana/`:
- `datasources.yml`: Automatically registers Prometheus (`http://prometheus:9090`) and Loki (`http://loki:3100`).
- `dashboards.yml`: Automatically loads dashboard definitions from `/var/lib/grafana/dashboards`.

#### 3. Essential Dashboard Metrics:
- **API Request Latency & Error Rate**: `rate(http_requests_total{status=~"5.."}[5m])`
- **Active Conversion Queue Depth**: `redis_stream_length{stream="conversion_jobs"}`
- **Worker Process Health**: `up{job=~"image-worker|video-worker|document-worker"}`

---

## 9. 🔐 OAuth 2.0 Configuration (Google & GitHub)

To enable 1-Click Social Sign-In (Google & GitHub) in Next.js Auth / Auth Service:

### Google OAuth Setup:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services > Credentials** and click **Create Credentials > OAuth client ID**.
4. Application type: **Web application**.
5. Authorized JavaScript origins: `http://localhost:8080`, `http://localhost`
6. Authorized redirect URIs:
   - `http://localhost:8080/api/auth/callback/google`
   - `http://localhost/api/v1/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**.

### GitHub OAuth Setup:
1. Go to **GitHub Settings > Developer Settings > OAuth Apps > New OAuth App**.
2. Application name: `FileConverter Pro (Dev)`
3. Homepage URL: `http://localhost:8080`
4. Authorization callback URL: `http://localhost:8080/api/auth/callback/github`
5. Click **Register application** and generate a new **Client Secret**.

### Environment Setup:
Add the credentials to `backend/.env` and `.env.local`:
```env
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

---

## 10. 🛠️ Prisma & OpenSSL Manual Troubleshooting

When running Prisma CLI commands directly on Windows host machines, you may see:
```text
prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
Please manually install OpenSSL and try installing Prisma again.
Error: Could not load `--schema` from provided path `prisma/schema.prisma`: file or directory not found
```

### Cause & Resolution:
1. **Schema Path**: The root folder `prisma/schema.prisma` is located at `backend/prisma/schema.prisma`. Running `npx prisma` from the project root without `--schema=backend/prisma/schema.prisma` fails to find the schema.
2. **Containerized Execution (Recommended)**: In Docker, `fc_db_migrate` runs automatically inside Alpine Linux with OpenSSL pre-installed (`apk add openssl`).
3. **Manual Execution Command**:
   To manually apply versioned database migrations from your host system or inside Docker:
   ```bash
   # From host system (inside backend/ directory):
   npx prisma migrate deploy --schema=./prisma/schema.prisma

   # Or inside Docker container:
   docker exec -it fc_upload_service ./node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma
   ```

---

## 🚀 Running the Full Stack

### Step 1: Start Docker Microservices Stack
```bash
cd backend
docker compose down --remove-orphans
docker compose up -d --build
```

### Step 2: Verify Container Health
```bash
docker compose ps
```

### Step 3: Start Next.js Frontend Development Server
```bash
# In project root directory
npm run dev
```

Visit `http://localhost:8080` to access FileConverter Pro!
# In project root
npm run dev
# Open http://localhost:8080 (or http://localhost:3000 when running Next.js dev)
```

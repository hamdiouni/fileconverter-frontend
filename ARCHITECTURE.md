# FileConverter Pro — Backend Architecture

## 1. Overview

FileConverter Pro is a file conversion SaaS platform supporting 2,000+ conversion types across 12 categories (Documents, Images, Audio, Video, Archives, Ebooks, Presentations, Spreadsheets, CAD, Fonts). The frontend (Next.js 13 + TypeScript) already exists. This document defines the backend architecture: a Dockerized microservices system that handles authentication, uploads, conversion job orchestration, category-specific conversion workers, billing, and admin tooling.

The core design principle: **route by format family, not by individual conversion pair.** With 2,000+ possible conversions, a service-per-conversion-type approach is unmanageable. Instead, a small number of category worker pools (image, video/audio, document, archive, CAD/font) each handle every conversion within their domain, pulling jobs from their own queue and scaling independently based on load and resource profile.

---

## 2. High-Level Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway (Nginx/Kong)              │
└───────┬──────────┬──────────┬──────────┬──────────┬─────────┘
        │          │          │          │          │
   ┌────▼───┐ ┌────▼────┐ ┌───▼────┐ ┌───▼─────┐ ┌──▼──────┐
   │  Auth  │ │  User/   │ │ Upload │ │ Billing │ │ Admin   │
   │Service │ │ Account  │ │Service │ │ Service │ │ Service │
   └────┬───┘ └────┬─────┘ └───┬────┘ └───┬─────┘ └──┬──────┘
        │          │           │          │           │
        └──────────┴─────┬─────┴──────────┴───────────┘
                          │
                 ┌────────▼─────────┐
                 │   Message Queue   │
                 │  (Redis/RabbitMQ) │
                 └────────┬──────────┘
                          │
      ┌──────────┬────────┼────────┬───────────┬──────────┐
 ┌────▼───┐ ┌────▼───┐ ┌──▼─────┐ ┌▼────────┐ ┌▼─────────┐
 │ Image  │ │ Video  │ │Document│ │ Audio   │ │ Archive/ │
 │Convert │ │Convert │ │Convert │ │Convert  │ │ CAD/Font │
 │Worker  │ │Worker  │ │Worker  │ │Worker   │ │ Workers  │
 └────┬───┘ └────┬───┘ └───┬────┘ └────┬────┘ └────┬─────┘
      │          │         │           │           │
      └──────────┴────┬────┴───────────┴───────────┘
                       │
              ┌────────▼─────────┐
              │  Object Storage   │
              │   (S3/MinIO)      │
              └───────────────────┘

  Shared: PostgreSQL (users/jobs/billing), Redis (cache/sessions),
  Prometheus + Grafana (monitoring), ELK/Loki (logging)
```

---

## 3. Service Breakdown

| Service | Responsibility | Suggested Tech |
|---|---|---|
| **API Gateway** | Routing, rate limiting, SSL termination, request auth check | Kong or Nginx |
| **Auth Service** | JWT issuance/refresh, OAuth (Google/GitHub), API key management | Node/Express or Go |
| **User Service** | Profiles, subscription tier, usage quotas | Node/Express + PostgreSQL |
| **Upload Service** | Chunked/resumable uploads, presigned URLs, file-type validation, virus scan hook | Node/Express + S3/MinIO |
| **Conversion Orchestrator** | Validates format pairs, enqueues jobs, tracks status, exposes polling/webhooks | Node/Express + BullMQ |
| **Image Worker** | ImageMagick / libvips / Sharp | Python or Node, isolated container |
| **Video/Audio Worker** | FFmpeg | Python, GPU-optional container |
| **Document Worker** | LibreOffice headless, Pandoc | Python, heavier container |
| **Archive/CAD/Font Worker(s)** | 7zip/unar, FreeCAD/OpenSCAD, FontForge | Python |
| **Billing Service** | Stripe subscriptions, metered usage billing | Node/Express |
| **Notification Service** | Email/webhook on job completion or failure | Node/Express + SES/SendGrid |
| **Admin Service** | Internal dashboards, user/job moderation, analytics | Node/Express |

---

## 4. Data Layer

- **PostgreSQL** — `users`, `subscriptions`, `api_keys`, `conversion_jobs`, `usage_logs`
- **Redis** — session cache, job queues (BullMQ/RabbitMQ), rate-limit counters
- **Object Storage** — S3-compatible bucket (MinIO locally, S3 in production) for uploaded and converted files, with TTL-based lifecycle cleanup

---

## 5. API Contracts (Summary)

**Auth**
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/api-keys`

**Users**
- `GET /users/me`
- `PATCH /users/me`
- `GET /users/me/usage`

**Uploads**
- `POST /uploads` → returns presigned URL + upload id

**Conversions**
- `POST /conversions` — body: source file id, target format → returns job id
- `GET /conversions/:id` — status: `queued` / `processing` / `done` / `failed`, result URL
- `GET /conversions` — paginated job history for a user

**Billing**
- `POST /billing/checkout-session`
- `POST /billing/webhook`

**Admin**
- `GET /admin/jobs`
- `GET /admin/users`
- `GET /admin/metrics`

---

## 6. Docker & Deployment Strategy

- One Dockerfile per service, multi-stage builds to minimize image size.
- `docker-compose.yml` for local development: gateway, all services, workers, Postgres, Redis, MinIO, and a mail-testing container (e.g., Mailhog).
- Separate `docker-compose.prod.yml` (or Kubernetes manifests) with resource limits, health checks, and worker replica scaling.
- Shared `.env` / `.env.example` for configuration — secrets are never baked into images.
- `Makefile` or npm scripts for `up`, `down`, `logs`, `migrate`, `seed`.

---

## 7. Cross-Cutting Concerns

- **Logging**: centralized structured (JSON) logs shipped to Loki or the ELK stack.
- **Monitoring**: Prometheus metrics endpoint per service; Grafana dashboards for queue depth, per-category conversion latency, and error rates.
- **Idempotency**: idempotency keys on job submission to prevent duplicate conversions.
- **Limits**: file size/type limits enforced at both the gateway and the upload service.
- **Graceful shutdown**: workers finish or requeue in-flight jobs on termination.
- **Cleanup**: a scheduled cron container purges expired files from object storage.

---

## 8. Recommended Improvements

1. **Normalize conversion paths.** Route many formats through a small set of canonical intermediate formats rather than maintaining a direct converter for every pair — reduces engine sprawl and maintenance load.
2. **Validate before queuing.** Add a format-detection/validation layer ahead of the queue; many real-world "conversion failures" are malformed or mislabeled input files, not converter bugs.
3. **Design billing into the job schema early.** Decide up front whether pricing is per-conversion, per-MB, or per-plan-quota — retrofitting metered billing later is costly.
4. **Sandbox the workers.** Run conversion engines (LibreOffice, FFmpeg, ImageMagick) inside sandboxed containers (gVisor/Firecracker, or strict seccomp/AppArmor profiles) since these tools process untrusted user files and have a real CVE history (e.g., ImageTragick).
5. **Add a dead-letter queue.** Route repeatedly-failing jobs to a DLQ with alerting instead of silently dropping them.
6. **Scale worker pools independently.** Video/CAD workers are far more resource-intensive than font/archive workers — a shared pool will bottleneck under mixed load.
7. **Cache identical conversions.** Hash the source file + target format to skip redundant reprocessing of duplicate requests.

---

## 9. Build Order (Recommended)

1. Scaffold directory structure + `docker-compose.yml`
2. Auth Service
3. Upload Service
4. Conversion Orchestrator
5. Image Worker (reference implementation for other workers)
6. Remaining category workers (video/audio, document, archive/CAD/font)
7. Billing Service
8. Notification Service
9. Admin Service
10. Monitoring/logging stack (Prometheus, Grafana, Loki)

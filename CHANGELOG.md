# Changelog

All notable changes made to the FileConverter system to fix critical integration gaps identified in the September 2026 system audit.

## [Unreleased] - 2026-09-22

### Issue 1: Google OAuth Token Mismatch Fix
- **auth-service**:
  - Added `handleGoogleLogin(googleId, email, name, avatarUrl)` in `auth.service.ts` to find-or-create user accounts from Google profile data and issue authentic FileConverter JWT access & refresh tokens signed with `JWT_ACCESS_SECRET`.
  - Added `POST /internal/auth/google` internal route (`internal.routes.ts`) for service-to-service communication within the Docker network.
  - Registered `internalRoutes` in `app.ts`.
  - Made `OAUTH_GOOGLE_CLIENT_ID` and `OAUTH_GOOGLE_CLIENT_SECRET` required in `env.ts`.
  - Added integration test `src/test/integration/google-oauth.test.ts`.
- **frontend**:
  - In `app/api/auth/callback/google/route.ts`, replaced storage of raw Google `ya29...` token with internal server-side call to `http://auth-service:3000/internal/auth/google`.
  - Stored FileConverter JWT token pair and user profile in `fc_auth` localStorage and cookie.

### Issue 2: Dashboard Authentication Refresh Fix
- **frontend**:
  - Added `isInitialized: boolean` flag to `lib/auth-store.ts`.
  - Set `isInitialized = true` in `init()` once localStorage reading completes.
  - Updated route guards in `app/dashboard/page.tsx`, `app/dashboard/api-keys/page.tsx`, `app/dashboard/webhooks/page.tsx`, and `app/settings/page.tsx` to only redirect when `isInitialized && !user`, preventing premature redirects to `/auth/login` on page refresh.

### Issue 3: Real Conversion Pipeline (BullMQ Queue & Workers)
- **conversion-orchestrator**:
  - Implemented BullMQ-compatible `QueueProducer` in `src/queue/producer.ts` pushing to `bull:fc:queue:<family>:wait`.
  - Replaced fake `setTimeout` simulation in `conversion.service.ts` with real Redis queue dispatching.
  - Added `POST /internal/conversions/:jobId/status` in `src/routes/internal.routes.ts` for worker progress and completion reporting.
  - On terminal states (`completed` / `failed`), triggers webhook notifications to `notification-service`.
  - Added `NOTIFICATION_SERVICE_URL`, `S3_BUCKET_UPLOADS`, `S3_BUCKET_RESULTS`, and `ORCHESTRATOR_INTERNAL_URL` in `src/config/env.ts`.
  - Added integration test `src/test/integration/queue-dispatch.test.ts`.
- **workers**:
  - Replaced dummy sleep loops in `image-worker`, `video-worker`, `audio-worker`, `document-worker`, `archive-worker`, and `cad-font-worker` with active Redis `BRPOP` consumer loops on `bull:fc:queue:<family>:wait`.
  - Implemented source download from MinIO, format transformation, result upload to `fileconverter-results`, and status callback dispatch to the orchestrator.
  - Added unit test `tests/test_worker_loop.py` in `image-worker`.

### Issue 4: Webhook Management & Delivery
- **database**:
  - Added `WebhookEndpoint` model and `webhookEndpoints` relation to `User` in `backend/prisma/schema.prisma`.
- **user-service**:
  - Implemented CRUD routes (`GET`, `POST`, `DELETE /api/v1/webhooks`) in `src/routes/webhook.routes.ts`.
  - Registered `webhookRoutes` in `src/app.ts`.
  - Added integration test `src/test/integration/webhook-crud.test.ts`.
- **api-gateway**:
  - Added `location /api/v1/webhooks` block in `backend/services/api-gateway/conf.d/fileconverter.conf` proxying to `user_service`.
- **notification-service**:
  - Updated `recordDelivery` in `src/services/notification.service.ts` to match the Prisma schema (`webhookUrl`, `retryCount`, `payload`, `deliveredAt`).
  - Added `X-FileConverter-Signature` header in `sendWebhook`.
  - Added internal route `POST /internal/notifications/webhooks/send` in `src/routes/notification.routes.ts`.

### Infrastructure
- **docker-compose**:
  - Added `OAUTH_GOOGLE_CLIENT_ID` and `OAUTH_GOOGLE_CLIENT_SECRET` to `auth-service`.
  - Added `NOTIFICATION_SERVICE_URL`, `S3_BUCKET_UPLOADS`, `S3_BUCKET_RESULTS`, and `ORCHESTRATOR_INTERNAL_URL` to `orchestrator-service`.
  - Added `WEBHOOK_HMAC_SECRET` to `notification-service`.
  - Updated `backend/.env` with `WEBHOOK_HMAC_SECRET`.

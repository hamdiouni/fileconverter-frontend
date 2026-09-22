# Comprehensive System Audit & Diagnostic Report

**Project:** FileConverter (Distributed Web & Microservices Platform)  
**Date:** September 2026  
**Scope:** Full codebase audit covering frontend, backend microservices, workers, database models, and API gateway routing.  
**Mode:** Analysis & Diagnostic Report.

---

## 1. Executive Summary

The project possesses a well-structured modern architecture comprising a **Next.js 14 (App Router)** frontend and a **Node.js/Fastify + Python** microservices backend orchestrated by **Docker Compose** and **Nginx**.

While the container infrastructure and routing are operational, a deep source-code audit across all files reveals that **several key features are currently simulated, stubbed, or disconnected**. This leads to runtime failures during specific user journeys (e.g., Google OAuth login, dashboard page refreshes, file conversion execution, and webhook management).

```
   ┌──────────────────────────────────────────────────────────┐
   │                   Frontend (Next.js 14)                  │
   └──────────────┬─────────────────────────────┬─────────────┘
                  │ (HTTP / JWT)                │ (Raw Google Token)
                  ▼                             ▼
   ┌──────────────────────────────┐     ┌─────────────────────┐
   │    Nginx API Gateway (:80)   │     │  Google Auth Flow   │
   └──────────────┬───────────────┘     │  [Token Mismatch]   │
                  │                     └─────────────────────┘
     ┌────────────┼────────────┬─────────────┐
     ▼            ▼            ▼             ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐
│  Auth   │  │  User   │  │ Upload  │  │ Orchestrator │
│ Service │  │ Service │  │ Service │  │   Service    │
└─────────┘  └─────────┘  └─────────┘  └──────┬───────┘
                                              │ (setTimeout Mock)
                                              ▼
                                       ┌──────────────┐
                                       │ Real Workers │ ◄── [DISCONNECTED]
                                       │ (Idle Sleep) │
                                       └──────────────┘
```

---

## 2. Frontend Critical Findings (`fileconverter-frontend`)

### 🔴 Critical Issue 1: Google OAuth Access Token vs. Backend JWT Mismatch
* **Affected File:** `app/api/auth/callback/google/route.ts` (lines 82–93, 146)
* **Underlying Cause:**  
  The Next.js Google OAuth callback route receives Google's raw OAuth access token (`tokens.access_token`, beginning with `ya29...`) and directly saves it into `localStorage` under `fc_auth`:
  ```typescript
  // app/api/auth/callback/google/route.ts:82
  const authTokens = {
    accessToken: tokens.access_token, // <--- Raw Google access token
    refreshToken: tokens.refresh_token,
    ...
  };
  localStorage.setItem('fc_auth', JSON.stringify(storedAuthPayload));
  ```
  When the user redirects to `/dashboard`, the client requests user data from the backend via `lib/api-client.ts` using `Authorization: Bearer ya29...`.  
  However, `backend/services/user-service/src/middleware/authenticate.ts` (line 28) validates requests using:
  ```typescript
  jwt.verify(token, env.JWT_ACCESS_SECRET)
  ```
* **Impact:**  
  The signature verification fails immediately with a `401 Unauthorized` response. The user is ejected and bounced back to `/auth/login`. Google login does not maintain an authenticated session with the backend.

---

### 🔴 Critical Issue 2: Dashboard Auth Guard Race Condition on Page Refresh
* **Affected Files:**
  * `app/dashboard/page.tsx` (lines 104–112)
  * `app/dashboard/api-keys/page.tsx` (line 55)
  * `app/dashboard/webhooks/page.tsx` (line 55)
  * `app/settings/page.tsx` (line 45)
* **Underlying Cause:**  
  `lib/auth-store.ts` (line 28) initializes with `user: null` and does not provide an `isInitialized` boolean flag. In the protected pages:
  ```typescript
  // app/dashboard/page.tsx:104
  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login?redirect=/dashboard');
    }
  }, [user, router]);
  ```
* **Impact:**  
  On initial component mount or browser reload (<kbd>F5</kbd>), React runs the second `useEffect` while `user` is still `null` before `init()` reads and validates `localStorage`. Logged-in users are prematurely logged out and redirected to login.

---

### 🟠 High Issue 3: Missing Backend Webhook Endpoints (404 Not Found)
* **Affected Files:**
  * `lib/api-client.ts` (lines 335–343)
  * `app/dashboard/webhooks/page.tsx` (lines 60–75)
* **Underlying Cause:**  
  The frontend API client attempts to manage user webhooks:
  ```typescript
  // lib/api-client.ts:335
  export const webhooks = {
    list: () => request<WebhookEndpoint[]>('GET', '/webhooks'),
    create: (url, events) => request<WebhookEndpoint>('POST', '/webhooks', ...),
    delete: (id) => request('DELETE', `/webhooks/${id}`),
  };
  ```
  Neither `backend/services/api-gateway/conf.d/fileconverter.conf` nor any backend microservice defines `/api/v1/webhooks`. Furthermore, `backend/prisma/schema.prisma` contains no table or model for user webhooks.
* **Impact:**  
  Navigating to `/dashboard/webhooks` causes API requests to fail with HTTP `404 NOT_FOUND: Route not found`.

---

### 🟡 Medium Issue 4: Mocked YouTube Converter
* **Affected File:** `components/convert/youtube-converter.tsx` (lines 115–125)
* **Underlying Cause:**  
  The YouTube extraction tool simulates a download by creating a fake 12-byte binary Blob in browser memory instead of invoking a backend processing worker:
  ```typescript
  // components/convert/youtube-converter.tsx:117
  const sampleBlob = new Blob([
    new Uint8Array([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d]),
  ], { type: mime });
  ```
* **Impact:**  
  Users who download extracted media receive a corrupt, unplayable 12-byte dummy file.

---

### 🟡 Medium Issue 5: Cosmetic Contact & Status Pages
* **Affected Files:**
  * `app/contact/page.tsx` (lines 18–23)
  * `app/status/page.tsx` (lines 25–55)
* **Underlying Cause:**  
  * In `app/contact/page.tsx`, `handleSubmit` triggers a generic `toast.success(...)` and resets the form without dispatching any backend network request or email.
  * In `app/status/page.tsx`, the service status indicators are hardcoded green elements accompanied by `new Date().toLocaleString()`. It does not perform health checks against `/healthz` or backend service instances.
* **Impact:**  
  Contact requests are never recorded or received; status indicators do not reflect actual downtime or health status.

---

### 🟢 Low Issue 6: ESLint Unescaped HTML Entities
* **Affected Files:**
  * `components/ads/monetization-guide-dialog.tsx` (lines 186–187, unescaped `"` quotes)
  * `components/convert/youtube-converter.tsx` (line 150, unescaped `'` apostrophe)
* **Impact:**  
  Triggers React/Next.js lint warnings during build (`react/no-unescaped-entities`).

---

## 3. Backend Critical Findings (`fileconverter-backend`)

### 🔴 Critical Issue 1: Mocked Conversion Pipeline & File Identity Bug
* **Affected File:** `backend/services/conversion-orchestrator/src/services/conversion.service.ts` (lines 259–284)
* **Underlying Cause:**  
  The `conversion-orchestrator` does not dispatch conversion tasks to BullMQ queues or worker services. Instead, it fakes processing via timers:
  ```typescript
  // conversion.service.ts:259
  setTimeout(async () => {
    // updates status to 'processing' (progress: 50)
    setTimeout(async () => {
      await this.prisma.conversionJob.update({
        where: { id: job.id },
        data: {
          status: 'completed',
          progress: 100,
          resultFileId: sourceFileId, // <--- RETURNS UNCONVERTED SOURCE FILE
        },
      });
    }, 1200);
  }, 400);
  ```
* **Impact:**  
  Any conversion (e.g., PDF to PNG, MP4 to MP3) marks itself as "completed" after 1.6 seconds, but simply assigns the original input file ID as the output file ID. No actual file format conversion takes place.

---

### 🔴 Critical Issue 2: Disconnected Python Conversion Workers
* **Affected Files:**
  * `backend/workers/image-worker/src/worker.py` (lines 58–60)
  * `backend/workers/video-worker/src/worker.py`
  * `backend/workers/audio-worker/src/worker.py`
  * `backend/workers/document-worker/src/worker.py`
  * `backend/workers/archive-worker/src/worker.py`
  * `backend/workers/cad-font-worker/src/worker.py`
* **Underlying Cause:**  
  Although conversion utility functions (e.g., Pillow, FFmpeg, LibreOffice scripts) exist inside `src/converter.py`, the worker entrypoints only launch a basic HTTP healthcheck server on port 9090 and enter an idle sleep loop:
  ```python
  # worker.py:58
  while not _shutdown:
      time.sleep(1)
  ```
  The workers do not connect to Redis, do not subscribe to queues/streams, and do not pull tasks from MinIO.
* **Impact:**  
  All 6 worker containers sit idle consuming resources while conversions are simulated by the orchestrator.

---

### 🟠 High Issue 3: Hardcoded Stripe Exception in Billing Service
* **Affected File:** `backend/services/billing-service/src/server.ts` (lines 6–26)
* **Underlying Cause:**  
  The server provides a hardcoded mock object instead of initializing the official `stripe` SDK:
  ```typescript
  // server.ts:6
  const productionStripe = {
    checkout: {
      sessions: {
        create: async (_params: any): Promise<any> => {
          throw new Error('Real Stripe SDK not configured. Set STRIPE_SECRET_KEY and import stripe SDK.');
        },
      },
    },
    ...
  };
  ```
* **Impact:**  
  Any user clicking to upgrade their subscription tier (Pro or Business) encounters an uncaught internal server error (`500`).

---

### 🟡 Medium Issue 4: Missing `cleanup-service` in Docker Stack
* **Affected Location:** `backend/services/cleanup-service`
* **Underlying Cause:**  
  A complete scheduled file cleanup microservice exists in source code, but it is not defined inside `backend/docker-compose.yml`.
* **Impact:**  
  Expired files and orphan uploads in MinIO S3 storage are never purged automatically, which will lead to storage exhaustion over time in production.

---

### 🟢 Low Issue 5: Unused Monorepo Shared Packages
* **Affected Location:** `backend/packages/*` (`types`, `conversion-path`, `correlation`, `format-validator`)
* **Underlying Cause:**  
  Shared packages defined in `backend/packages/` are not linked via npm workspaces or imported by the individual microservices. Each service re-declares its own types and validation schemas independently.

---

## 4. Diagnostic Summary Matrix

| ID | Component | Location | Severity | Defect Description |
|:---|:---|:---|:---:|:---|
| **F-01** | Frontend Auth | `app/api/auth/callback/google/route.ts` | 🔴 Critical | Stores raw Google token instead of backend JWT; causes immediate 401 on API calls. |
| **F-02** | Frontend Dashboard | `app/dashboard/page.tsx` & guards | 🔴 Critical | Component mounts with `user: null`, redirecting to login before `init()` completes. |
| **B-01** | Conversion Orchestrator | `services/conversion-orchestrator` | 🔴 Critical | Replaces real pipeline with `setTimeout`; returns source file as result file. |
| **B-02** | Worker Microservices | `backend/workers/*` | 🔴 Critical | Workers run idle `while True: sleep(1)`; do not listen to BullMQ or Redis. |
| **F-03** | Webhooks Feature | `app/dashboard/webhooks/page.tsx` | 🟠 High | Invokes `/api/v1/webhooks` which does not exist in Nginx or backend (404). |
| **B-03** | Billing Service | `backend/services/billing-service` | 🟠 High | Stripe client is stubbed with throw expressions; checkout is non-functional. |
| **F-04** | YouTube Converter | `components/convert/youtube-converter` | 🟡 Medium | Generates mock 12-byte dummy Blob; no real video/audio download occurs. |
| **F-05** | Contact / Status | `app/contact`, `app/status` | 🟡 Medium | Contact form does not send messages; status page displays mock static data. |
| **B-04** | Infrastructure | `backend/docker-compose.yml` | 🟡 Medium | `cleanup-service` is implemented in source code but omitted from docker compose. |
| **F-06** | Code Quality | `components/ads/monetization-guide...` | 🟢 Low | Unescaped JSX entities (`"` and `'`). |
| **B-05** | Monorepo Structure | `backend/packages/*` | 🟢 Low | Shared utility packages exist in repository but are unreferenced by services. |

---

## 5. Recommended Remediation Strategy

1. **Phase 1: Session & Authentication Stability (F-01, F-02)**
   * Introduce `isInitialized: boolean` to `lib/auth-store.ts` and adjust route guards so pages do not redirect until storage is verified.
   * In `app/api/auth/callback/google/route.ts`, sign a valid internal JWT matching `JWT_ACCESS_SECRET` or exchange it via `auth-service` so `/api/v1/users/me` authenticates smoothly.

2. **Phase 2: UI Integrity & Dead Ends (F-03, F-04, F-06)**
   * Fix unescaped JSX quotes in monetization and YouTube dialogs.
   * Add a fallback or temporary maintenance state for `/dashboard/webhooks` until backend webhook registry tables are provisioned.

3. **Phase 3: Real Conversion Worker Integration (B-01, B-02)**
   * Connect `conversion-orchestrator` to dispatch jobs to BullMQ / Redis streams.
   * Update the Python workers (`worker.py`) to consume tasks, retrieve files from MinIO, execute `converter.py`, and push results back to MinIO.

4. **Phase 4: Billing & Cleanup Lifecycle (B-03, B-04)**
   * Configure real `Stripe` SDK in `billing-service` using environment variables.
   * Add `cleanup-service` to `docker-compose.yml` to automatically expire old files.

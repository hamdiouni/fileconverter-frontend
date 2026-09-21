/**
 * FileConverter Pro — typed API client
 *
 * All calls go to the Nginx gateway at /api/v1/... (proxied at runtime).
 * In static-export mode (next.config.js output:'export') these are
 * client-side fetch calls made after hydration.
 *
 * Auth state is kept in localStorage under "fc_auth" via the auth-store.
 */

// ─── Configuration ────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:80/api/v1';

// ─── Shared types (mirror backend shape) ─────────────────────────────────────

export type SubscriptionTier = 'free' | 'pro' | 'business' | 'enterprise';
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
    timestamp: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;   // seconds
  tokenType: 'Bearer';
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface RegisterResult extends AuthTokens {
  user: AuthUser;
}

export interface UserProfile {
  userId: string;
  email: string;
  name: string | null;
  company: string | null;
  avatar: string | null;
  tier: SubscriptionTier;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionQuotas {
  conversionsPerMonth: number;
  maxFileSize: number;
  apiCallsPerMonth: number;
  storageRetentionDays: number;
  priorityProcessing: boolean;
  whiteLabel: boolean;
}

export interface UsageStats {
  conversionsThisMonth: number;
  apiCallsThisMonth: number;
  storageUsed: number;
  quotas: SubscriptionQuotas;
  resetDate: string;
}

export interface UploadResponse {
  uploadId: string;
  presignedUrl: string;
  expiresIn: number;
  fields: Record<string, string>;
}

export interface FileMetadata {
  id: string;
  userId: string;
  filename: string;
  originalFilename: string;
  size: number;
  contentType: string;
  storageKey: string;
  virusScanStatus: 'pending' | 'clean' | 'infected';
  uploadStatus: 'pending' | 'uploaded' | 'expired';
  uploadedAt: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface ConversionJob {
  id: string;
  userId: string;
  sourceFileId: string;
  sourceFormat: string;
  targetFormat: string;
  status: JobStatus;
  progress: number;
  options: Record<string, unknown>;
  resultFileId: string | null;
  errorMessage: string | null;
  webhookUrl: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface ConversionRequest {
  sourceFileId: string;
  targetFormat: string;
  options?: Record<string, unknown>;
  idempotencyKey?: string;
  webhookUrl?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiKey {
  id: string;
  name: string | null;
  permissions: string[];
  expiresAt: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

// ─── Token storage helpers ────────────────────────────────────────────────────

const TOKEN_KEY = 'fc_auth';

export interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;  // epoch ms
  user: AuthUser;
}

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(tokens: AuthTokens, user: AuthUser): void {
  const payload: StoredAuth = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: Date.now() + tokens.expiresIn * 1000,
    user,
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(payload));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAccessToken(): string | null {
  return getStoredAuth()?.accessToken ?? null;
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function request<T>(
  method: string,
  path: string,
  options: {
    body?: unknown;
    token?: string | null;
    headers?: Record<string, string>;
  } = {},
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    ...options.headers,
  };
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const token = options.token !== undefined ? options.token : getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 204) return undefined as unknown as T;

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = json as ApiError;
    throw new ApiClientError(
      res.status,
      err.error?.code ?? 'UNKNOWN',
      err.error?.message ?? `HTTP ${res.status}`,
      err.error?.requestId,
    );
  }

  return json as T;
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export const auth = {
  async register(email: string, password: string): Promise<RegisterResult> {
    const result = await request<RegisterResult>('POST', '/auth/register', {
      body: { email, password },
      token: null,
    });
    setStoredAuth(result, result.user);
    return result;
  },

  async login(email: string, password: string): Promise<RegisterResult> {
    const result = await request<RegisterResult>('POST', '/auth/login', {
      body: { email, password },
      token: null,
    });
    setStoredAuth(result, result.user);
    return result;
  },

  async refresh(): Promise<AuthTokens> {
    const stored = getStoredAuth();
    if (!stored) throw new ApiClientError(401, 'UNAUTHORIZED', 'Not authenticated');
    const result = await request<AuthTokens>('POST', '/auth/refresh', {
      body: { refreshToken: stored.refreshToken },
      token: null,
    });
    setStoredAuth(result, stored.user);
    return result;
  },

  logout(): void {
    clearStoredAuth();
  },

  isAuthenticated(): boolean {
    const stored = getStoredAuth();
    if (!stored) return false;
    // Consider expired if less than 60s remaining
    return stored.expiresAt > Date.now() + 60_000;
  },

  async requestPasswordReset(email: string): Promise<void> {
    return request('POST', '/auth/reset-password', { body: { email }, token: null });
  },

  async listApiKeys(): Promise<ApiKey[]> {
    return request<ApiKey[]>('GET', '/auth/api-keys');
  },

  async createApiKey(
    name: string,
    permissions: string[] = [],
    expiresAt?: string,
  ): Promise<ApiKey & { key: string }> {
    return request('POST', '/auth/api-keys', { body: { name, permissions, expiresAt } });
  },

  async revokeApiKey(id: string): Promise<void> {
    return request('DELETE', `/auth/api-keys/${id}`);
  },
};

// ─── User endpoints ───────────────────────────────────────────────────────────

export const users = {
  async getProfile(): Promise<UserProfile> {
    return request<UserProfile>('GET', '/users/me');
  },

  async updateProfile(data: Partial<Pick<UserProfile, 'name' | 'company'>>): Promise<UserProfile> {
    return request<UserProfile>('PATCH', '/users/me', { body: data });
  },

  async getUsage(): Promise<UsageStats> {
    return request<UsageStats>('GET', '/users/me/usage');
  },

  async deleteAccount(): Promise<void> {
    return request('DELETE', '/users/me');
  },
};

// ─── Webhook endpoints ────────────────────────────────────────────────────────

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
  lastDeliveryAt: string | null;
  lastStatus: 'success' | 'failed' | null;
}

export const webhooksApi = {
  async list(): Promise<WebhookEndpoint[]> {
    return request<WebhookEndpoint[]>('GET', '/webhooks');
  },

  async create(url: string, events: string[]): Promise<WebhookEndpoint> {
    return request<WebhookEndpoint>('POST', '/webhooks', { body: { url, events } });
  },

  async delete(id: string): Promise<void> {
    return request('DELETE', `/webhooks/${id}`);
  },
};

// ─── Upload endpoints ─────────────────────────────────────────────────────────

export const uploads = {
  /**
   * Step 1 — request a presigned URL from the backend.
   */
  async requestPresignedUrl(
    filename: string,
    contentType: string,
    size: number,
  ): Promise<UploadResponse> {
    return request<UploadResponse>('POST', '/uploads', {
      body: { filename, contentType, fileSize: size, size },
    });
  },

  /**
   * Step 2 — upload directly to S3/MinIO using the presigned URL.
   * Supports both standard S3 PUT presigned URLs and POST policy uploads.
   */
  async uploadToStorage(
    presignedUrl: string,
    file: File,
    fields?: Record<string, string>,
    onProgress?: (pct: number) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (fields && Object.keys(fields).length > 0) {
        // Multipart POST upload
        const formData = new FormData();
        Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
        formData.append('file', file);
        xhr.open('POST', presignedUrl);

        if (onProgress) {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
          };
        }

        xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)));
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(formData);
      } else {
        // Standard S3 PutObject presigned URL upload (PUT)
        xhr.open('PUT', presignedUrl);
        if (file.type) {
          xhr.setRequestHeader('Content-Type', file.type);
        }

        if (onProgress) {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
          };
        }

        xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload failed with status ${xhr.status}`)));
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(file);
      }
    });
  },

  /**
   * Step 3 — notify the backend the upload is complete.
   */
  async confirmUpload(uploadId: string): Promise<void> {
    return request('POST', `/uploads/${uploadId}/complete`, { body: {} });
  },

  async getMetadata(uploadId: string): Promise<FileMetadata> {
    return request<FileMetadata>('GET', `/uploads/${uploadId}`);
  },

  async getDownloadUrl(uploadId: string): Promise<{ url: string; expiresAt: string }> {
    return request('GET', `/uploads/${uploadId}/download`);
  },
};

// ─── Conversion endpoints ─────────────────────────────────────────────────────

export const conversions = {
  async submit(req: ConversionRequest): Promise<{ jobId: string; status: JobStatus }> {
    return request('POST', '/conversions', { body: req });
  },

  async getStatus(jobId: string): Promise<ConversionJob> {
    return request<ConversionJob>('GET', `/conversions/${jobId}`);
  },

  async list(params: {
    status?: JobStatus;
    page?: number;
    pageSize?: number;
  } = {}): Promise<PaginatedResponse<ConversionJob>> {
    const qs = new URLSearchParams();
    if (params.status)   qs.set('status', params.status);
    if (params.page)     qs.set('page', String(params.page));
    if (params.pageSize) qs.set('pageSize', String(params.pageSize));
    const q = qs.toString() ? `?${qs.toString()}` : '';
    return request<PaginatedResponse<ConversionJob>>('GET', `/conversions${q}`);
  },

  async cancel(jobId: string): Promise<ConversionJob> {
    return request('DELETE', `/conversions/${jobId}`);
  },

  /**
   * Poll job status every `intervalMs` until terminal state, timeout, or maxAttempts.
   * Calls `onProgress` on each poll with the current job snapshot.
   */
  async poll(
    jobId: string,
    options: {
      intervalMs?: number;
      timeoutMs?: number;
      onProgress?: (job: ConversionJob) => void;
    } = {},
  ): Promise<ConversionJob> {
    const { intervalMs = 2_000, timeoutMs = 180_000, onProgress } = options;
    const deadline = Date.now() + timeoutMs;
    const TERMINAL: JobStatus[] = ['completed', 'failed', 'cancelled'];

    while (Date.now() < deadline) {
      const job = await conversions.getStatus(jobId);
      onProgress?.(job);
      if (TERMINAL.includes(job.status)) return job;
      await new Promise((r) => setTimeout(r, intervalMs));
    }

    throw new ApiClientError(408, 'TIMEOUT', `Job ${jobId} did not complete within ${timeoutMs}ms`);
  },
};

// ─── Re-export error class for instanceof checks in components ────────────────

export { ApiClientError };

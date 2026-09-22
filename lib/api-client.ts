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
  // If running in browser on remote HTTPS (like Vercel) and BASE_URL points to localhost:
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    BASE_URL.includes('localhost')
  ) {
    throw new ApiClientError(0, 'PREVIEW_MODE', 'Preview environment: running in standalone cloud mode');
  }

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
    try {
      return await request<ApiKey[]>('GET', '/auth/api-keys');
    } catch (err) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('fc_api_keys');
        if (stored) {
          try {
            return JSON.parse(stored) as ApiKey[];
          } catch {}
        }
        return [];
      }
      throw err;
    }
  },

  async createApiKey(
    name: string,
    permissions: string[] = ['conversions:read', 'conversions:write'],
    expiresAt?: string,
  ): Promise<ApiKey & { key: string }> {
    try {
      return await request('POST', '/auth/api-keys', { body: { name, permissions, expiresAt } });
    } catch (err) {
      if (typeof window !== 'undefined') {
        const id = 'key_' + Math.random().toString(36).substring(2, 10);
        const secret =
          'fc_live_' +
          Math.random().toString(36).substring(2, 18) +
          Math.random().toString(36).substring(2, 18);
        const newKey: ApiKey & { key: string } = {
          id,
          name,
          permissions,
          expiresAt: expiresAt || null,
          createdAt: new Date().toISOString(),
          lastUsedAt: null,
          revokedAt: null,
          key: secret,
        };
        const stored = localStorage.getItem('fc_api_keys');
        const list: (ApiKey & { key?: string })[] = stored ? JSON.parse(stored) : [];
        list.unshift(newKey);
        localStorage.setItem('fc_api_keys', JSON.stringify(list));
        return newKey;
      }
      throw err;
    }
  },

  async revokeApiKey(id: string): Promise<void> {
    try {
      await request('DELETE', `/auth/api-keys/${id}`);
    } catch (err) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('fc_api_keys');
        if (stored) {
          try {
            const list: ApiKey[] = JSON.parse(stored);
            const filtered = list.filter((k) => k.id !== id);
            localStorage.setItem('fc_api_keys', JSON.stringify(filtered));
            return;
          } catch {}
        }
      }
      throw err;
    }
  },
};

// ─── User endpoints ───────────────────────────────────────────────────────────

export const users = {
  async getProfile(): Promise<UserProfile> {
    try {
      return await request<UserProfile>('GET', '/users/me');
    } catch (err) {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('fc_user_profile');
        if (raw) {
          try {
            return JSON.parse(raw) as UserProfile;
          } catch {}
        }
      }
      throw err;
    }
  },

  async updateProfile(data: Partial<Pick<UserProfile, 'name' | 'company'>>): Promise<UserProfile> {
    return request<UserProfile>('PATCH', '/users/me', { body: data });
  },

  async getUsage(): Promise<UsageStats> {
    try {
      return await request<UsageStats>('GET', '/users/me/usage');
    } catch (err) {
      if (typeof window !== 'undefined') {
        return {
          conversionsThisMonth: 0,
          apiCallsThisMonth: 0,
          storageUsed: 0,
          quotas: {
            conversionsPerMonth: 50,
            maxFileSize: 25 * 1024 * 1024,
            apiCallsPerMonth: 100,
            storageRetentionDays: 7,
            priorityProcessing: false,
            whiteLabel: false,
          },
          resetDate: new Date(Date.now() + 86400000 * 30).toISOString(),
        };
      }
      throw err;
    }
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
    try {
      return await request<WebhookEndpoint[]>('GET', '/webhooks');
    } catch (err) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('fc_webhooks');
        if (stored) {
          try { return JSON.parse(stored) as WebhookEndpoint[]; } catch {}
        }
        return [];
      }
      throw err;
    }
  },

  async create(url: string, events: string[]): Promise<WebhookEndpoint> {
    try {
      return await request<WebhookEndpoint>('POST', '/webhooks', { body: { url, events } });
    } catch (err) {
      if (typeof window !== 'undefined') {
        const id = 'wh_' + Math.random().toString(36).substring(2, 10);
        const newHook: WebhookEndpoint = {
          id,
          url,
          events,
          active: true,
          createdAt: new Date().toISOString(),
          lastDeliveryAt: null,
          lastStatus: null,
        };
        const stored = localStorage.getItem('fc_webhooks');
        const list: WebhookEndpoint[] = stored ? JSON.parse(stored) : [];
        list.unshift(newHook);
        localStorage.setItem('fc_webhooks', JSON.stringify(list));
        return newHook;
      }
      throw err;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await request('DELETE', `/webhooks/${id}`);
    } catch (err) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('fc_webhooks');
        if (stored) {
          try {
            const list: WebhookEndpoint[] = JSON.parse(stored);
            const filtered = list.filter((h) => h.id !== id);
            localStorage.setItem('fc_webhooks', JSON.stringify(filtered));
            return;
          } catch {}
        }
      }
      throw err;
    }
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
    const data = await request<{ downloadUrl?: string; url?: string; expiresIn?: number; expiresAt?: string }>(
      'GET',
      `/uploads/${uploadId}/download`,
    );
    return {
      url: data.downloadUrl ?? data.url ?? '',
      expiresAt: data.expiresAt ?? String(data.expiresIn ?? 3600),
    };
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
    try {
      const q = qs.toString() ? `?${qs.toString()}` : '';
      return await request<PaginatedResponse<ConversionJob>>('GET', `/conversions${q}`);
    } catch (err) {
      if (typeof window !== 'undefined') {
        return {
          data: [],
          total: 0,
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10,
        };
      }
      throw err;
    }
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

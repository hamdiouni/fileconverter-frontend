# ─── Stage 1: Install dependencies ──────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --omit=dev 2>/dev/null || npm ci --omit=dev

# ─── Stage 2: Build Next.js static export ────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
# Need dev deps for the build too
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline 2>/dev/null || npm ci
COPY . .
# API URL points to the Nginx gateway container inside Docker
ENV NEXT_PUBLIC_API_URL=http://localhost/api/v1
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─── Stage 3: Serve the static export with Nginx ─────────────────────────────
FROM nginx:1.25-alpine AS runner
# wget is already in nginx:alpine; just add curl as fallback
RUN apk add --no-cache curl

# Remove default nginx config and page
RUN rm -f /etc/nginx/conf.d/default.conf /usr/share/nginx/html/index.html

# Copy the Next.js static export
COPY --from=builder /app/out /usr/share/nginx/html

# SPA-friendly Nginx config
COPY docker/nginx-frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fs http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]

FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate && npm run build

# Use Debian Bookworm (not slim) — includes full OpenSSL 3.x
FROM node:22-bookworm AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs

# Create directories for runtime data
RUN mkdir -p /app/prisma /app/data

# public/ may not exist in this project
RUN mkdir -p /app/public

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy missing runtime dependencies for API routes
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs

RUN chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="mysql://eternally_yours:eternally_yours_password@mysql:3306/eternally_yours"
ENV NODE_ENV="production"

CMD ["node", "server.js"]

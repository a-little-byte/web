FROM node:24-slim AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

RUN cp -r .next/standalone/* ./
RUN cp -r .next/static .next/standalone/.next/
RUN cp -r public .next/standalone/

FROM node:24-slim AS runner

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV NEXT_PUBLIC_NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]

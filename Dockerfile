FROM node:20 AS dependencies
RUN npm install -g pnpm
WORKDIR /app
COPY package.json package.json ./
COPY prisma ./
RUN pnpm install --production
RUN pnpm install prisma
RUN npx prisma generate

FROM node:20-slim AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build

FROM node:20-slim AS runner
RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends

WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/types ./src/types
COPY --from=builder /app/src/seed ./src/seed
COPY --from=builder /app/src/utils ./src/utils
RUN mkdir -p /app/public/uploads

EXPOSE 3000
CMD ["pnpm", "start"]
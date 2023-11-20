FROM node:16-alpine AS dependencies
RUN npm install -g pnpm
WORKDIR /app
COPY package.json package.json ./
COPY prisma ./
RUN pnpm install
RUN pnpm install prisma
RUN npx prisma generate

FROM node:16-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build

FROM node:16-alpine AS runner

WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["pnpm", "start"]
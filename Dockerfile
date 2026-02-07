# Dockerfile
FROM node:21-alpine AS builder

WORKDIR /chord_bot

COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:21-alpine

WORKDIR /chord_bot

COPY --from=builder /chord_bot/dist ./dist
COPY --from=builder /chord_bot/node_modules ./node_modules
COPY --from=builder /chord_bot/package.json ./
COPY --from=builder /chord_bot/prisma ./prisma
COPY --from=builder /chord_bot/data ./data

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
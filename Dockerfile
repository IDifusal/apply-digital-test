FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN pnpm run build

FROM node:20-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod && \
    pnpm store prune && \
    npm cache clean --force && \
    rm -rf /root/.npm /root/.pnpm-store /tmp/*

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

CMD ["node", "dist/main.js"]

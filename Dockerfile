# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# standaloneのnode_modulesにはアプリが実際にimportする分（@prisma/client等）しか
# トレースされず、prisma CLI（migrate deployの実行に必要）はその依存関係
# （@prisma/config → effect/c12等）を個別に手動コピーすると際限なく増えて壊れやすい。
# package-lock.jsonどおりの本番依存関係（devDependencies除く）をnpm ciで
# 正規にインストールし、その後standaloneの出力で上書きする方式にする。
# これによりNext.js実行に使われるのは引き続きstandaloneのトレース済みファイルのままで、
# prisma CLIの依存関係だけをnpmの解決に任せて過不足なく補える。
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]

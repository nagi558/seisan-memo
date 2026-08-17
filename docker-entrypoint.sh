#!/bin/sh
set -e

# 本番起動時にPrisma migrationを確実に適用してからNext.jsを起動する。
# set -eにより、migrate deployが失敗（非ゼロ終了）した時点でスクリプトは
# 直ちに終了し、以降のexec node server.jsは実行されない。
# DATABASE_URL等の秘密情報は出力しない（migrate deployのログにも接続文字列は含まれない）。
# node_modules/.bin/prismaのシンボリックリンクはDockerのCOPYで実体化されると
# 相対require("./cli.js")が壊れるため、CLI本体のエントリーポイントを直接指定する。
echo "Applying database migrations (prisma migrate deploy)..."
node ./node_modules/prisma/build/index.js migrate deploy

echo "Migrations applied. Starting Next.js server..."
exec node server.js

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3);

-- Backfill: このマイグレーション以前から存在するユーザーは、初期設定機能が
-- 存在する前から使っているユーザーなので、createdAtの時点で設定済み扱いとする。
-- これにより既存ユーザーが/setupへ強制的に送られることを防ぐ。
UPDATE "User" SET "onboardingCompletedAt" = "createdAt" WHERE "onboardingCompletedAt" IS NULL;

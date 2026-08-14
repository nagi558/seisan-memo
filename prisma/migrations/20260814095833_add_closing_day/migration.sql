-- AlterTable
ALTER TABLE "User" ADD COLUMN     "closingDay" INTEGER;

-- AddCheckConstraint
-- closingDayはPrisma Schema単体ではCHECK制約を表現できないため、
-- カスタムSQLとして1〜31の範囲制約をDBに追加する（29〜31の除外はアプリ層で担保する）。
ALTER TABLE "User" ADD CONSTRAINT "User_closingDay_range" CHECK ("closingDay" BETWEEN 1 AND 31);

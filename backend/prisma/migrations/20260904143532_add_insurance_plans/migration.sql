-- CreateEnum
CREATE TYPE "InsuranceTier" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM');

-- CreateTable
CREATE TABLE "insurance_plans" (
    "id" BIGSERIAL NOT NULL,
    "provider" VARCHAR(100) NOT NULL,
    "plan_name" VARCHAR(100) NOT NULL,
    "tier" "InsuranceTier" NOT NULL,
    "coverage_amount" DECIMAL(10,2) NOT NULL,
    "premium_rate" DECIMAL(5,4) NOT NULL,
    "minimum_premium" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "insurance_plans_pkey" PRIMARY KEY ("id")
);

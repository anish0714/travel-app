-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "loyalty_points_earned" INTEGER NOT NULL DEFAULT 0;

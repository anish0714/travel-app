-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TRAVELER', 'SUPPORT', 'ADMIN', 'FINANCE');

-- CreateEnum
CREATE TYPE "LoyaltyTier" AS ENUM ('NONE', 'SILVER', 'GOLD', 'PLATINUM');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CabinClass" AS ENUM ('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('FLIGHT', 'HOTEL', 'INSURANCE');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('HELD', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('AUTHORIZED', 'CAPTURED', 'REFUNDED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'PAYPAL', 'WALLET');

-- CreateEnum
CREATE TYPE "SupplierType" AS ENUM ('HOTEL_CHAIN', 'CHANNEL_MANAGER', 'INDEPENDENT');

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "loyalty_tier" "LoyaltyTier" NOT NULL DEFAULT 'NONE',
    "loyalty_points" INTEGER NOT NULL DEFAULT 0,
    "role" "Role" NOT NULL DEFAULT 'TRAVELER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airports" (
    "id" SERIAL NOT NULL,
    "iata_code" CHAR(3) NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "id" SERIAL NOT NULL,
    "iata_code" CHAR(2) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flights" (
    "id" BIGSERIAL NOT NULL,
    "airline_id" INTEGER NOT NULL,
    "flight_number" VARCHAR(10) NOT NULL,
    "origin_airport_id" INTEGER NOT NULL,
    "destination_airport_id" INTEGER NOT NULL,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "arrival_time" TIMESTAMP(3) NOT NULL,
    "aircraft_type" TEXT,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_fares" (
    "id" BIGSERIAL NOT NULL,
    "flight_id" BIGINT NOT NULL,
    "cabin_class" "CabinClass" NOT NULL,
    "fare_code" VARCHAR(20) NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "seats_available" INTEGER NOT NULL,
    "refundable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "flight_fares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SupplierType" NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotels" (
    "id" BIGSERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "star_rating" DECIMAL(2,1) NOT NULL,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_rooms" (
    "id" BIGSERIAL NOT NULL,
    "hotel_id" BIGINT NOT NULL,
    "room_type" TEXT NOT NULL,
    "max_occupancy" INTEGER NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "currency" CHAR(3) NOT NULL,

    CONSTRAINT "hotel_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_rate_plans" (
    "id" BIGSERIAL NOT NULL,
    "room_id" BIGINT NOT NULL,
    "rate_code" VARCHAR(20) NOT NULL,
    "refundable" BOOLEAN NOT NULL,
    "cancellation_deadline" TIMESTAMP(3),
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "hotel_rate_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "guest_email" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "total_amount" DECIMAL(10,2) NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_items" (
    "id" BIGSERIAL NOT NULL,
    "booking_id" BIGINT NOT NULL,
    "item_type" "ItemType" NOT NULL,
    "reference_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'HELD',

    CONSTRAINT "booking_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travelers" (
    "id" BIGSERIAL NOT NULL,
    "booking_id" BIGINT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "passport_number" VARCHAR(30),

    CONSTRAINT "travelers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" BIGSERIAL NOT NULL,
    "booking_id" BIGINT NOT NULL,
    "gateway_transaction_id" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_policies" (
    "id" BIGSERIAL NOT NULL,
    "booking_id" BIGINT NOT NULL,
    "provider" VARCHAR(100) NOT NULL,
    "plan_name" VARCHAR(100) NOT NULL,
    "coverage_amount" DECIMAL(10,2) NOT NULL,
    "premium" DECIMAL(10,2) NOT NULL,
    "policy_number" VARCHAR(50) NOT NULL,

    CONSTRAINT "insurance_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "hotel_id" BIGINT,
    "airline_id" INTEGER,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "airports_iata_code_key" ON "airports"("iata_code");

-- CreateIndex
CREATE UNIQUE INDEX "airlines_iata_code_key" ON "airlines"("iata_code");

-- CreateIndex
CREATE INDEX "flights_origin_airport_id_destination_airport_id_departure__idx" ON "flights"("origin_airport_id", "destination_airport_id", "departure_time");

-- CreateIndex
CREATE INDEX "booking_items_item_type_reference_id_idx" ON "booking_items"("item_type", "reference_id");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_policies_policy_number_key" ON "insurance_policies"("policy_number");

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "airlines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_origin_airport_id_fkey" FOREIGN KEY ("origin_airport_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_destination_airport_id_fkey" FOREIGN KEY ("destination_airport_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_fares" ADD CONSTRAINT "flight_fares_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_rooms" ADD CONSTRAINT "hotel_rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_rate_plans" ADD CONSTRAINT "hotel_rate_plans_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "hotel_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travelers" ADD CONSTRAINT "travelers_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_policies" ADD CONSTRAINT "insurance_policies_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "airlines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

// Mirrors backend/prisma/schema.prisma. BigInt ids are serialized as
// strings over JSON (see backend/src/server.js), so every id here is a
// string even though it's a BigInt column in Postgres.

export type Role = "TRAVELER" | "SUPPORT" | "ADMIN" | "FINANCE";
export type LoyaltyTier = "NONE" | "SILVER" | "GOLD" | "PLATINUM";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type CabinClass = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
export type ItemType = "FLIGHT" | "HOTEL" | "INSURANCE";
export type ItemStatus = "HELD" | "CONFIRMED" | "CANCELLED";
export type PaymentStatus = "AUTHORIZED" | "CAPTURED" | "REFUNDED" | "FAILED";
export type PaymentMethod = "CARD" | "PAYPAL" | "WALLET";
export type SupplierType = "HOTEL_CHAIN" | "CHANNEL_MANAGER" | "INDEPENDENT";
export type InsuranceTier = "BASIC" | "STANDARD" | "PREMIUM";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Airport {
  id: string;
  iataCode: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
}

export interface Airline {
  id: string;
  iataCode: string;
  name: string;
}

export interface FlightFare {
  id: string;
  flightId: string;
  cabinClass: CabinClass;
  fareCode: string;
  basePrice: string;
  currency: string;
  seatsAvailable: number;
  refundable: boolean;
}

export interface Flight {
  id: string;
  airlineId: string;
  flightNumber: string;
  originAirportId: string;
  destinationAirportId: string;
  departureTime: string;
  arrivalTime: string;
  aircraftType: string | null;
  airline: Airline;
  origin: Airport;
  destination: Airport;
  fares: FlightFare[];
}

export interface Supplier {
  id: string;
  name: string;
  type: SupplierType;
}

export interface HotelRatePlan {
  id: string;
  roomId: string;
  rateCode: string;
  refundable: boolean;
  cancellationDeadline: string | null;
  price: string;
}

export interface HotelRoom {
  id: string;
  hotelId: string;
  roomType: string;
  maxOccupancy: number;
  basePrice: string;
  currency: string;
  ratePlans: HotelRatePlan[];
}

export interface Hotel {
  id: string;
  supplierId: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  starRating: string;
  supplier: Supplier;
}

export interface HotelDetail extends Hotel {
  rooms: HotelRoom[];
}

export interface Traveler {
  id: string;
  bookingId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber: string | null;
}

export interface BookingItem {
  id: string;
  bookingId: string;
  itemType: ItemType;
  referenceId: string;
  quantity: number;
  unitPrice: string;
  status: ItemStatus;
}

export interface Payment {
  id: string;
  bookingId: string;
  gatewayTransactionId: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface LoyaltyEarned {
  pointsEarned: number;
  totalPoints: number;
  tier: LoyaltyTier;
}

export interface Booking {
  id: string;
  userId: string | null;
  guestEmail: string | null;
  status: BookingStatus;
  totalAmount: string;
  discountAmount: string;
  loyaltyPointsEarned: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  items: BookingItem[];
  travelers: Traveler[];
  payments?: Payment[];
  // Only present on the response from POST /bookings, for a signed-in
  // traveler who actually earned points on this specific booking.
  loyalty?: LoyaltyEarned;
}

export interface InsurancePlan {
  id: string;
  provider: string;
  planName: string;
  tier: InsuranceTier;
  coverageAmount: string;
  premiumRate: string;
  minimumPremium: string;
  description: string;
  // Only present when GET /insurance-plans is called with ?tripCost=
  estimatedPremium?: string;
}

export interface ApiError {
  error: string;
}

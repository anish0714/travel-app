"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";

const STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-ink/10 text-ink-soft",
  COMPLETED: "bg-blue-100 text-blue-800",
};

const BookingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { token, loading } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    api
      .get<Booking>(`/bookings/${id}`, token)
      .then(setBooking)
      .catch((err: Error) => setError(err.message));
  }, [id, token, loading]);

  if (error) return <p className="mx-auto max-w-2xl px-4 py-8 text-red-600">{error}</p>;
  if (!booking) return <p className="mx-auto max-w-2xl px-4 py-8 text-ink-soft">Loading…</p>;

  const subtotal = booking.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
  const hasDiscount = Number(booking.discountAmount) > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Booking #{booking.id}</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[booking.status]}`}>
          {booking.status}
        </span>
      </div>

      {booking.loyaltyPointsEarned > 0 && (
        <div className="mb-4 rounded-lg bg-signal/10 px-4 py-3 text-sm text-signal">
          You earned <span className="font-semibold">{booking.loyaltyPointsEarned.toLocaleString()}</span> loyalty
          points on this booking.
        </div>
      )}

      <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
        <div className="mb-4 border-b border-ink/10 pb-4">
          {hasDiscount && (
            <>
              <div className="flex items-center justify-between text-sm text-ink-soft">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal, booking.currency)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm text-route">
                <span>Loyalty discount</span>
                <span>-{formatMoney(booking.discountAmount, booking.currency)}</span>
              </div>
            </>
          )}
          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm text-ink-soft">Total</p>
            <p className="text-xl font-bold text-ink">{formatMoney(booking.totalAmount, booking.currency)}</p>
          </div>
        </div>

        <h2 className="mb-2 text-sm font-semibold text-ink-soft">Items</h2>
        <ul className="mb-4 flex flex-col gap-2">
          {booking.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">
                {item.itemType} · qty {item.quantity} · {item.status}
              </span>
              <span className="font-medium text-ink">{formatMoney(item.unitPrice, booking.currency)}</span>
            </li>
          ))}
        </ul>

        <h2 className="mb-2 text-sm font-semibold text-ink-soft">Travelers</h2>
        <ul className="flex flex-col gap-1">
          {booking.travelers.map((traveler) => (
            <li key={traveler.id} className="text-sm text-ink-soft">
              {traveler.firstName} {traveler.lastName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookingDetailPage;

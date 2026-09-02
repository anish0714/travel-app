"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";

const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-ink/10 text-ink-soft",
  COMPLETED: "bg-blue-100 text-blue-800",
};

export default function BookingDetailPage() {
  const { id } = useParams();
  const { token, loading } = useAuth();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading) return;
    api
      .get(`/bookings/${id}`, token)
      .then(setBooking)
      .catch((err) => setError(err.message));
  }, [id, token, loading]);

  if (error) return <p className="mx-auto max-w-2xl px-4 py-8 text-red-600">{error}</p>;
  if (!booking) return <p className="mx-auto max-w-2xl px-4 py-8 text-ink-soft">Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Booking #{booking.id}</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[booking.status]}`}>
          {booking.status}
        </span>
      </div>

      <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-4">
          <p className="text-sm text-ink-soft">Total</p>
          <p className="text-xl font-bold text-ink">{formatMoney(booking.totalAmount, booking.currency)}</p>
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
}

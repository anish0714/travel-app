"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";

const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-zinc-200 text-zinc-600",
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
  if (!booking) return <p className="mx-auto max-w-2xl px-4 py-8 text-zinc-500">Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Booking #{booking.id}</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[booking.status]}`}>
          {booking.status}
        </span>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-4">
          <p className="text-sm text-zinc-500">Total</p>
          <p className="text-xl font-bold text-zinc-900">{formatMoney(booking.totalAmount, booking.currency)}</p>
        </div>

        <h2 className="mb-2 text-sm font-semibold text-zinc-700">Items</h2>
        <ul className="mb-4 flex flex-col gap-2">
          {booking.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">
                {item.itemType} · qty {item.quantity} · {item.status}
              </span>
              <span className="font-medium text-zinc-900">{formatMoney(item.unitPrice, booking.currency)}</span>
            </li>
          ))}
        </ul>

        <h2 className="mb-2 text-sm font-semibold text-zinc-700">Travelers</h2>
        <ul className="flex flex-col gap-1">
          {booking.travelers.map((traveler) => (
            <li key={traveler.id} className="text-sm text-zinc-600">
              {traveler.firstName} {traveler.lastName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";

const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-zinc-200 text-zinc-600",
  COMPLETED: "bg-blue-100 text-blue-800",
};

export default function BookingsPage() {
  const { user, token, loading } = useAuth();
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    api
      .get("/bookings/me", token)
      .then(setBookings)
      .catch((err) => setError(err.message));
  }, [token]);

  if (loading) return <p className="mx-auto max-w-3xl px-4 py-8 text-zinc-500">Loading…</p>;

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-zinc-600">
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>{" "}
          to see your trips.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">My Trips</h1>
      {error && <p className="text-red-600">{error}</p>}
      {bookings === null && !error && <p className="text-zinc-500">Loading your bookings…</p>}
      {bookings && bookings.length === 0 && <p className="text-zinc-500">No bookings yet — go search a flight or hotel.</p>}

      <ul className="flex flex-col gap-3">
        {bookings?.map((booking) => (
          <li key={booking.id}>
            <Link
              href={`/bookings/${booking.id}`}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-blue-300"
            >
              <div>
                <p className="font-medium text-zinc-900">Booking #{booking.id}</p>
                <p className="text-sm text-zinc-500">
                  {booking.items.length} item{booking.items.length === 1 ? "" : "s"} ·{" "}
                  {booking.travelers.length} traveler{booking.travelers.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-zinc-900">{formatMoney(booking.totalAmount, booking.currency)}</span>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[booking.status]}`}>
                  {booking.status}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

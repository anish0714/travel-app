"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

const BookingsPage = () => {
  const { user, token, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api
      .get<Booking[]>("/bookings/me", token)
      .then(setBookings)
      .catch((err: Error) => setError(err.message));
  }, [token]);

  if (loading) return <p className="mx-auto max-w-3xl px-4 py-8 text-ink-soft">Loading…</p>;

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-ink-soft">
          <Link href="/login" className="text-route hover:underline">
            Log in
          </Link>{" "}
          to see your trips.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">My Trips</h1>
      {error && <p className="text-red-600">{error}</p>}
      {bookings === null && !error && <p className="text-ink-soft">Loading your bookings…</p>}
      {bookings && bookings.length === 0 && (
        <p className="text-ink-soft">No bookings yet — go search a flight or hotel.</p>
      )}

      <ul className="flex flex-col gap-3">
        {bookings?.map((booking) => (
          <li key={booking.id}>
            <Link
              href={`/bookings/${booking.id}`}
              className="flex items-center justify-between rounded-xl border border-ink/10 bg-white p-5 shadow-sm transition-colors hover:border-route/30"
            >
              <div>
                <p className="font-medium text-ink">Booking #{booking.id}</p>
                <p className="text-sm text-ink-soft">
                  {booking.items.length} item{booking.items.length === 1 ? "" : "s"} ·{" "}
                  {booking.travelers.length} traveler{booking.travelers.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-ink">{formatMoney(booking.totalAmount, booking.currency)}</span>
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
};

export default BookingsPage;

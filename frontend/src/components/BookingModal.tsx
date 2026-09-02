"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import type { Booking, ItemType } from "@/lib/types";

type BookingModalProps = {
  itemType: ItemType;
  referenceId: string;
  label: string;
  price: string | number;
  currency?: string;
  onClose: () => void;
};

const BookingModal = ({ itemType, referenceId, label, price, currency = "CAD", onClose }: BookingModalProps) => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [guestEmail, setGuestEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const booking = await api.post<Booking>(
        "/bookings",
        {
          ...(user ? {} : { guestEmail }),
          items: [{ itemType, referenceId, quantity: 1 }],
          travelers: [{ firstName, lastName, dateOfBirth }],
        },
        token
      );
      router.push(`/bookings/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Confirm booking</h2>
            <p className="text-sm text-ink-soft">{label}</p>
          </div>
          <button type="button" onClick={onClose} className="text-ink-soft/70 hover:text-ink-soft" aria-label="Close">
            ✕
          </button>
        </div>

        <p className="mb-4 text-2xl font-bold text-ink">{formatMoney(price, currency)}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!user && (
            <input
              type="email"
              required
              placeholder="Email address"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
          )}
          <div className="flex gap-3">
            <input
              type="text"
              required
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="flex-1 rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="flex-1 rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
          </div>
          <label className="text-xs text-ink-soft">
            Date of birth
            <input
              type="date"
              required
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="mt-1 block w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-md bg-route px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-route-dark disabled:opacity-50"
          >
            {submitting ? "Booking…" : "Confirm booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;

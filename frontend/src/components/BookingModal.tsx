"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import type { Booking, InsurancePlan, ItemType } from "@/lib/types";

type BookingModalProps = {
  itemType: ItemType;
  referenceId: string;
  label: string;
  price: string | number;
  currency?: string;
  onClose: () => void;
};

const TIER_BADGE_STYLES: Record<string, string> = {
  BASIC: "bg-ink/10 text-ink-soft",
  STANDARD: "bg-signal/10 text-signal",
  PREMIUM: "bg-route/10 text-route",
};

const BookingModal = ({ itemType, referenceId, label, price, currency = "CAD", onClose }: BookingModalProps) => {
  const { user, token, refreshUser } = useAuth();
  const router = useRouter();
  const [guestEmail, setGuestEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [plans, setPlans] = useState<InsurancePlan[] | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const offerInsurance = itemType !== "INSURANCE";

  useEffect(() => {
    if (!offerInsurance) return;
    api
      .get<InsurancePlan[]>(`/insurance-plans?tripCost=${price}`)
      .then(setPlans)
      .catch(() => setPlans([])); // insurance is an optional upsell — never block booking on it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPlan = plans?.find((p) => p.id === selectedPlanId) ?? null;
  const totalPrice = Number(price) + (selectedPlan ? Number(selectedPlan.estimatedPremium) : 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const items = [
        { itemType, referenceId, quantity: 1 },
        ...(selectedPlan ? [{ itemType: "INSURANCE" as ItemType, referenceId: selectedPlan.id, quantity: 1 }] : []),
      ];
      const booking = await api.post<Booking>(
        "/bookings",
        {
          ...(user ? {} : { guestEmail }),
          items,
          travelers: [{ firstName, lastName, dateOfBirth }],
        },
        token
      );
      if (booking.loyalty) await refreshUser();
      router.push(`/bookings/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Confirm booking</h2>
            <p className="text-sm text-ink-soft">{label}</p>
          </div>
          <button type="button" onClick={onClose} className="text-ink-soft/70 hover:text-ink-soft" aria-label="Close">
            ✕
          </button>
        </div>

        <p className="mb-4 text-2xl font-bold text-ink">{formatMoney(totalPrice, currency)}</p>

        {offerInsurance && plans && plans.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-sm font-medium text-ink">Add trip protection</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setSelectedPlanId(null)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  selectedPlanId === null ? "border-ink/40 bg-ink/5" : "border-ink/15 hover:border-ink/30"
                }`}
              >
                <span className="font-medium text-ink">No thanks</span>
                <span className="ml-2 text-ink-soft">Continue without insurance</span>
              </button>

              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`rounded-lg border-2 px-3 py-2 text-left text-sm transition-colors ${
                    selectedPlanId === plan.id
                      ? "border-route bg-route/5"
                      : "border-transparent bg-ink/5 hover:bg-ink/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${TIER_BADGE_STYLES[plan.tier]}`}
                      >
                        {plan.tier}
                      </span>
                      <span className="font-medium text-ink">{plan.planName}</span>
                    </span>
                    <span className="font-semibold text-ink">
                      +{formatMoney(plan.estimatedPremium ?? plan.minimumPremium, currency)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">
                    {plan.provider} · {formatMoney(plan.coverageAmount, currency)} coverage
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">{plan.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

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

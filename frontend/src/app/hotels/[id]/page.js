"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import BookingModal from "@/components/BookingModal";

export default function HotelDetailPage() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState(null);
  const [selectedRatePlan, setSelectedRatePlan] = useState(null);

  useEffect(() => {
    api
      .get(`/hotels/${id}`)
      .then(setHotel)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="mx-auto max-w-4xl px-4 py-8 text-red-600">{error}</p>;
  if (!hotel) return <p className="mx-auto max-w-4xl px-4 py-8 text-zinc-500">Loading…</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{hotel.name}</h1>
          <p className="text-sm text-zinc-500">
            {hotel.address}, {hotel.city}
          </p>
          <p className="mt-1 text-xs text-zinc-400">{hotel.supplier.name}</p>
        </div>
        <span className="whitespace-nowrap rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
          {Number(hotel.starRating).toFixed(1)}★
        </span>
      </div>

      <ul className="flex flex-col gap-4">
        {hotel.rooms.map((room) => (
          <li key={room.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-zinc-900">{room.roomType}</p>
              <p className="text-xs text-zinc-500">Sleeps {room.maxOccupancy}</p>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {room.ratePlans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {plan.refundable ? "Flexible" : "Advance purchase"}
                    </p>
                    <p className="text-xs text-zinc-500">{plan.refundable ? "Free cancellation" : "Non-refundable"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-zinc-900">{formatMoney(plan.price, room.currency)}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRatePlan({
                          referenceId: plan.id,
                          price: plan.price,
                          currency: room.currency,
                          label: `${hotel.name} · ${room.roomType} · ${plan.refundable ? "Flexible" : "Advance purchase"}`,
                        })
                      }
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {selectedRatePlan && (
        <BookingModal
          itemType="HOTEL"
          referenceId={selectedRatePlan.referenceId}
          price={selectedRatePlan.price}
          currency={selectedRatePlan.currency}
          label={selectedRatePlan.label}
          onClose={() => setSelectedRatePlan(null)}
        />
      )}
    </div>
  );
}

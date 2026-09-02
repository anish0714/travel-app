"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { seededImage } from "@/lib/images";
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
  if (!hotel) return <p className="mx-auto max-w-4xl px-4 py-8 text-ink-soft">Loading…</p>;

  return (
    <div>
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <Image
          src={seededImage(`hotel-${hotel.id}-${hotel.city}`, 1600, 700)}
          alt={hotel.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-4xl px-4 pb-6 text-white">
          <div className="flex items-end justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{hotel.name}</h1>
              <p className="text-sm text-white/80">
                {hotel.address}, {hotel.city}
              </p>
              <p className="mt-1 text-xs text-white/60">{hotel.supplier.name}</p>
            </div>
            <span className="whitespace-nowrap rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-ink shadow-sm">
              {Number(hotel.starRating).toFixed(1)}★
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <ul className="flex flex-col gap-4">
          {hotel.rooms.map((room) => (
            <li key={room.id} className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">{room.roomType}</p>
                <p className="text-xs text-ink-soft">Sleeps {room.maxOccupancy}</p>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {room.ratePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between rounded-lg border border-ink/10 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {plan.refundable ? "Flexible" : "Advance purchase"}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {plan.refundable ? "Free cancellation" : "Non-refundable"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-ink">{formatMoney(plan.price, room.currency)}</span>
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
                        className="rounded-md bg-route px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-route-dark"
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
      </div>

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

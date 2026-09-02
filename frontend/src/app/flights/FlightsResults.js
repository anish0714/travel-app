"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { formatTime, formatDateLabel, formatDuration, formatMoney } from "@/lib/format";
import BookingModal from "@/components/BookingModal";

const AIRLINE_COLORS = {
  AC: "bg-red-50 text-red-700",
  WS: "bg-signal/10 text-signal",
  PD: "bg-violet-50 text-violet-700",
  F8: "bg-route/10 text-route",
};

export default function FlightsResults() {
  const params = useSearchParams();
  const origin = params.get("origin");
  const destination = params.get("destination");
  const date = params.get("date");

  const [flights, setFlights] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFare, setSelectedFare] = useState(null);

  useEffect(() => {
    if (!origin || !destination || !date) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting before a new fetch, not a render loop
    setFlights(null);
    setError(null);
    api
      .get(`/flights?origin=${origin}&destination=${destination}&date=${date}`)
      .then(setFlights)
      .catch((err) => setError(err.message));
  }, [origin, destination, date]);

  if (!origin || !destination || !date) {
    return <p className="mx-auto max-w-4xl px-4 py-8 text-ink-soft">Search for a flight from the home page.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-ink">
        {origin} → {destination}
      </h1>
      <p className="mb-6 text-sm text-ink-soft">{formatDateLabel(`${date}T00:00:00`)}</p>

      {error && <p className="text-red-600">{error}</p>}
      {!error && flights === null && <p className="text-ink-soft">Searching flights…</p>}
      {flights && flights.length === 0 && <p className="text-ink-soft">No flights found for this route and date.</p>}

      <ul className="flex flex-col gap-4">
        {flights?.map((flight) => (
          <li key={flight.id} className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                    AIRLINE_COLORS[flight.airline.iataCode] ?? "bg-ink/5 text-ink"
                  }`}
                >
                  {flight.airline.iataCode}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{flight.airline.name}</p>
                  <p className="text-xs text-ink-soft">
                    {flight.airline.iataCode}
                    {flight.flightNumber} · {flight.aircraftType}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-ink">{formatTime(flight.departureTime)}</p>
                  <p className="text-xs text-ink-soft">{origin}</p>
                </div>
                <div className="flex flex-col items-center px-1">
                  <p className="text-xs text-ink-soft">{formatDuration(flight.departureTime, flight.arrivalTime)}</p>
                  <div className="my-1 h-px w-14 border-t border-dashed border-ink/25" />
                  <svg viewBox="0 0 24 24" className="h-3 w-3 rotate-90 fill-ink-soft">
                    <path d="M2.5 19.5l6-2.25v-6l-6-3.75V5.25L12 9.75l9.5-4.5v2.25l-6 3.75v6l6 2.25v2.25L12 15.75l-9.5 6z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{formatTime(flight.arrivalTime)}</p>
                  <p className="text-xs text-ink-soft">{destination}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {flight.fares.map((fare) => (
                <div
                  key={fare.id}
                  className="flex items-center justify-between rounded-lg border border-ink/10 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {fare.cabinClass.replace("_", " ")} · {fare.fareCode}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {fare.refundable ? "Refundable" : "Non-refundable"} · {fare.seatsAvailable} seats left
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-ink">{formatMoney(fare.basePrice, fare.currency)}</span>
                    <button
                      type="button"
                      disabled={fare.seatsAvailable < 1}
                      onClick={() =>
                        setSelectedFare({
                          referenceId: fare.id,
                          price: fare.basePrice,
                          currency: fare.currency,
                          label: `${flight.airline.iataCode}${flight.flightNumber} · ${origin} → ${destination} · ${fare.cabinClass}`,
                        })
                      }
                      className="rounded-md bg-route px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-route-dark disabled:opacity-40"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {selectedFare && (
        <BookingModal
          itemType="FLIGHT"
          referenceId={selectedFare.referenceId}
          price={selectedFare.price}
          currency={selectedFare.currency}
          label={selectedFare.label}
          onClose={() => setSelectedFare(null)}
        />
      )}
    </div>
  );
}

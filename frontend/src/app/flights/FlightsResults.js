"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { formatTime, formatDateLabel, formatDuration, formatMoney } from "@/lib/format";
import BookingModal from "@/components/BookingModal";

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
    return <p className="mx-auto max-w-4xl px-4 py-8 text-zinc-600">Search for a flight from the home page.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-zinc-900">
        {origin} → {destination}
      </h1>
      <p className="mb-6 text-sm text-zinc-500">{formatDateLabel(`${date}T00:00:00`)}</p>

      {error && <p className="text-red-600">{error}</p>}
      {!error && flights === null && <p className="text-zinc-500">Searching flights…</p>}
      {flights && flights.length === 0 && <p className="text-zinc-500">No flights found for this route and date.</p>}

      <ul className="flex flex-col gap-4">
        {flights?.map((flight) => (
          <li key={flight.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {flight.airline.name} · {flight.airline.iataCode}
                  {flight.flightNumber}
                </p>
                <p className="text-xs text-zinc-500">{flight.aircraftType}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-zinc-900">
                  {formatTime(flight.departureTime)} → {formatTime(flight.arrivalTime)}
                </p>
                <p className="text-xs text-zinc-500">{formatDuration(flight.departureTime, flight.arrivalTime)}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {flight.fares.map((fare) => (
                <div
                  key={fare.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {fare.cabinClass.replace("_", " ")} · {fare.fareCode}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {fare.refundable ? "Refundable" : "Non-refundable"} · {fare.seatsAvailable} seats left
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-zinc-900">{formatMoney(fare.basePrice, fare.currency)}</span>
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
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-40"
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

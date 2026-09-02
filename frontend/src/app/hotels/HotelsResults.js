"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function HotelsResults() {
  const params = useSearchParams();
  const city = params.get("city");
  const minRating = params.get("minRating");

  const [hotels, setHotels] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting before a new fetch, not a render loop
    setHotels(null);
    setError(null);
    const query = new URLSearchParams({ city });
    if (minRating) query.set("minRating", minRating);
    api
      .get(`/hotels?${query.toString()}`)
      .then(setHotels)
      .catch((err) => setError(err.message));
  }, [city, minRating]);

  if (!city) {
    return <p className="mx-auto max-w-4xl px-4 py-8 text-zinc-600">Search for a hotel from the home page.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Hotels in {city}</h1>

      {error && <p className="text-red-600">{error}</p>}
      {!error && hotels === null && <p className="text-zinc-500">Searching hotels…</p>}
      {hotels && hotels.length === 0 && <p className="text-zinc-500">No hotels match that filter.</p>}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {hotels?.map((hotel) => (
          <li key={hotel.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-zinc-900">{hotel.name}</p>
                <p className="text-sm text-zinc-500">{hotel.address}</p>
                <p className="mt-1 text-xs text-zinc-400">{hotel.supplier.name}</p>
              </div>
              <span className="whitespace-nowrap rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                {Number(hotel.starRating).toFixed(1)}★
              </span>
            </div>
            <Link
              href={`/hotels/${hotel.id}`}
              className="mt-4 inline-block rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              View rooms
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

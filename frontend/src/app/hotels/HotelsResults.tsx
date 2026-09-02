"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { seededImage } from "@/lib/images";
import type { Hotel } from "@/lib/types";

const HotelsResults = () => {
  const params = useSearchParams();
  const city = params.get("city");
  const minRating = params.get("minRating");

  const [hotels, setHotels] = useState<Hotel[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting before a new fetch, not a render loop
    setHotels(null);
    setError(null);
    const query = new URLSearchParams({ city });
    if (minRating) query.set("minRating", minRating);
    api
      .get<Hotel[]>(`/hotels?${query.toString()}`)
      .then(setHotels)
      .catch((err: Error) => setError(err.message));
  }, [city, minRating]);

  if (!city) {
    return <p className="mx-auto max-w-4xl px-4 py-8 text-ink-soft">Search for a hotel from the home page.</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Hotels in {city}</h1>

      {error && <p className="text-red-600">{error}</p>}
      {!error && hotels === null && <p className="text-ink-soft">Searching hotels…</p>}
      {hotels && hotels.length === 0 && <p className="text-ink-soft">No hotels match that filter.</p>}

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {hotels?.map((hotel) => (
          <li key={hotel.id}>
            <Link
              href={`/hotels/${hotel.id}`}
              className="group block overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ink/5 transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={seededImage(`hotel-${hotel.id}-${hotel.city}`, 600, 450)}
                  alt={hotel.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold text-ink shadow-sm">
                  {Number(hotel.starRating).toFixed(1)}★
                </span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-ink">{hotel.name}</p>
                <p className="text-sm text-ink-soft">{hotel.address}</p>
                <p className="mt-1 text-xs text-ink-soft/70">{hotel.supplier.name}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelsResults;

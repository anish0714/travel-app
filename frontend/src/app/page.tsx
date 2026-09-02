"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { HOTEL_CITIES } from "@/lib/constants";
import { seededImage } from "@/lib/images";
import type { Airport } from "@/lib/types";

type Destination = {
  city: string;
  blurb: string;
  seed: string;
};

const DESTINATIONS: Destination[] = [
  { city: "Banff", blurb: "Rockies & turquoise lakes", seed: "banff-rockies-lake" },
  { city: "Quebec City", blurb: "Cobblestone old-world charm", seed: "quebec-city-old-town" },
  { city: "Vancouver", blurb: "Ocean meets mountains", seed: "vancouver-coast-mountains" },
  { city: "Toronto", blurb: "Canada's biggest skyline", seed: "toronto-skyline-cn-tower" },
];

const Home = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"flights" | "hotels">("flights");
  const [airports, setAirports] = useState<Airport[]>([]);

  useEffect(() => {
    api
      .get<Airport[]>("/airports")
      .then(setAirports)
      .catch(() => {});
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden">
        <Image
          src={seededImage("canada-mountains-lake-hero", 1600, 900)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink/90" />

        <div className="relative mx-auto max-w-3xl px-4 pb-28 pt-20 text-center text-white sm:pt-28">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">Coast to coast, Canada</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Fly and stay, anywhere in Canada</h1>
          <p className="mt-3 text-white/80">Search real routes and real hotels across the country.</p>
        </div>
      </section>

      <section className="mx-auto -mt-20 max-w-3xl px-4">
        <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-ink/5">
          <div className="mb-4 flex gap-2 border-b border-ink/10">
            <TabButton active={tab === "flights"} onClick={() => setTab("flights")}>
              Flights
            </TabButton>
            <TabButton active={tab === "hotels"} onClick={() => setTab("hotels")}>
              Hotels
            </TabButton>
          </div>

          {tab === "flights" ? (
            <FlightSearchForm airports={airports} onSearch={(qs) => router.push(`/flights?${qs}`)} />
          ) : (
            <HotelSearchForm onSearch={(qs) => router.push(`/hotels?${qs}`)} />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-xl font-bold text-ink">Popular this month</h2>
        <p className="mt-1 text-sm text-ink-soft">Jump straight to hotels in Canada&apos;s most-booked cities.</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.city}
              href={`/hotels?${new URLSearchParams({ city: dest.city }).toString()}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl shadow-sm"
            >
              <Image
                src={seededImage(dest.seed, 500, 650)}
                alt={dest.city}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="font-semibold">{dest.city}</p>
                <p className="text-xs text-white/80">{dest.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

type TabButtonProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
};

const TabButton = ({ active, onClick, children }: TabButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
      active ? "border-route text-route" : "border-transparent text-ink-soft hover:text-ink"
    }`}
  >
    {children}
  </button>
);

type FlightSearchFormProps = {
  airports: Airport[];
  onSearch: (queryString: string) => void;
};

const FlightSearchForm = ({ airports, onSearch }: FlightSearchFormProps) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!origin || !destination || !date) return;
    onSearch(new URLSearchParams({ origin, destination, date }).toString());
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
      <AirportSelect label="From" value={origin} onChange={setOrigin} airports={airports} />
      <AirportSelect label="To" value={destination} onChange={setDestination} airports={airports} />
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-ink-soft">Date</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border border-ink/15 px-3 py-2 text-sm focus:border-route focus:outline-none focus:ring-1 focus:ring-route"
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full rounded-md bg-route px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-route-dark"
        >
          Search flights
        </button>
      </div>
    </form>
  );
};

type AirportSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  airports: Airport[];
};

const AirportSelect = ({ label, value, onChange, airports }: AirportSelectProps) => (
  <div className="flex flex-col">
    <label className="mb-1 text-xs font-medium text-ink-soft">{label}</label>
    <select
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-ink/15 px-3 py-2 text-sm focus:border-route focus:outline-none focus:ring-1 focus:ring-route"
    >
      <option value="" disabled>
        Select airport
      </option>
      {airports.map((a) => (
        <option key={a.iataCode} value={a.iataCode}>
          {a.iataCode} — {a.city}
        </option>
      ))}
    </select>
  </div>
);

type HotelSearchFormProps = {
  onSearch: (queryString: string) => void;
};

const HotelSearchForm = ({ onSearch }: HotelSearchFormProps) => {
  const [city, setCity] = useState("");
  const [minRating, setMinRating] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!city) return;
    const params = new URLSearchParams({ city });
    if (minRating) params.set("minRating", minRating);
    onSearch(params.toString());
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-ink-soft">City</label>
        <select
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-md border border-ink/15 px-3 py-2 text-sm focus:border-route focus:outline-none focus:ring-1 focus:ring-route"
        >
          <option value="" disabled>
            Select city
          </option>
          {HOTEL_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-ink-soft">Minimum rating</label>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="rounded-md border border-ink/15 px-3 py-2 text-sm focus:border-route focus:outline-none focus:ring-1 focus:ring-route"
        >
          <option value="">Any</option>
          <option value="2.5">2.5+ stars</option>
          <option value="3.5">3.5+ stars</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
        </select>
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full rounded-md bg-route px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-route-dark"
        >
          Search hotels
        </button>
      </div>
    </form>
  );
};

export default Home;

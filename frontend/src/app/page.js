"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { HOTEL_CITIES } from "@/lib/constants";

export default function Home() {
  const router = useRouter();
  const [tab, setTab] = useState("flights");
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    api
      .get("/airports")
      .then(setAirports)
      .catch(() => {});
  }, []);

  return (
    <div>
      <section className="bg-zinc-900 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Fly and stay, anywhere in Canada</h1>
          <p className="mt-3 text-zinc-300">Search real routes and real hotels across the country.</p>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-3xl px-4 pb-16">
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex gap-2 border-b border-zinc-200">
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
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-3 py-2 text-sm font-medium ${
        active ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-700"
      }`}
    >
      {children}
    </button>
  );
}

function FlightSearchForm({ airports, onSearch }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!origin || !destination || !date) return;
    onSearch(new URLSearchParams({ origin, destination, date }).toString());
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
      <AirportSelect label="From" value={origin} onChange={setOrigin} airports={airports} />
      <AirportSelect label="To" value={destination} onChange={setDestination} airports={airports} />
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-zinc-500">Date</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Search flights
        </button>
      </div>
    </form>
  );
}

function AirportSelect({ label, value, onChange, airports }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-xs font-medium text-zinc-500">{label}</label>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
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
}

function HotelSearchForm({ onSearch }) {
  const [city, setCity] = useState("");
  const [minRating, setMinRating] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!city) return;
    const params = new URLSearchParams({ city });
    if (minRating) params.set("minRating", minRating);
    onSearch(params.toString());
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-zinc-500">City</label>
        <select
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
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
        <label className="mb-1 text-xs font-medium text-zinc-500">Minimum rating</label>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
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
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Search hotels
        </button>
      </div>
    </form>
  );
}

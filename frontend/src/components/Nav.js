"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Nav() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-zinc-900">
          Waypoint
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/flights" className="text-zinc-600 hover:text-zinc-900">
            Flights
          </Link>
          <Link href="/hotels" className="text-zinc-600 hover:text-zinc-900">
            Hotels
          </Link>
          {!loading && user && (
            <>
              <Link href="/bookings" className="text-zinc-600 hover:text-zinc-900">
                My Trips
              </Link>
              <span className="text-zinc-500">Hi, {user.firstName}</span>
              <button type="button" onClick={logout} className="text-zinc-600 hover:text-zinc-900">
                Log out
              </button>
            </>
          )}
          {!loading && !user && (
            <>
              <Link href="/login" className="text-zinc-600 hover:text-zinc-900">
                Log in
              </Link>
              <Link href="/register" className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

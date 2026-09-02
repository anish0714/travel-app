"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const Nav = () => {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-route text-sm font-bold text-route">
            W
          </span>
          <span className="text-lg font-bold tracking-tight text-ink">Waypoint</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/flights" className="text-ink-soft transition-colors hover:text-ink">
            Flights
          </Link>
          <Link href="/hotels" className="text-ink-soft transition-colors hover:text-ink">
            Hotels
          </Link>
          {!loading && user && (
            <>
              <Link href="/bookings" className="text-ink-soft transition-colors hover:text-ink">
                My Trips
              </Link>
              <span className="hidden text-ink-soft sm:inline">Hi, {user.firstName}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-ink/15 px-3 py-1.5 text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
              >
                Log out
              </button>
            </>
          )}
          {!loading && !user && (
            <>
              <Link href="/login" className="text-ink-soft transition-colors hover:text-ink">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-route px-4 py-1.5 font-medium text-white shadow-sm transition-colors hover:bg-route-dark"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Nav;

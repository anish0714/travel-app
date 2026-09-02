import { Suspense } from "react";
import FlightsResults from "./FlightsResults";

export default function FlightsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-8 text-ink-soft">Loading…</div>}>
      <FlightsResults />
    </Suspense>
  );
}

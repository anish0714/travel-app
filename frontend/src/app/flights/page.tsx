import { Suspense } from "react";
import FlightsResults from "./FlightsResults";

const FlightsPage = () => (
  <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-8 text-ink-soft">Loading…</div>}>
    <FlightsResults />
  </Suspense>
);

export default FlightsPage;

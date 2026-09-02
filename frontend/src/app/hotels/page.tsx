import { Suspense } from "react";
import HotelsResults from "./HotelsResults";

const HotelsPage = () => (
  <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-8 text-ink-soft">Loading…</div>}>
    <HotelsResults />
  </Suspense>
);

export default HotelsPage;

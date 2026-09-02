import { Suspense } from "react";
import HotelsResults from "./HotelsResults";

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-8 text-ink-soft">Loading…</div>}>
      <HotelsResults />
    </Suspense>
  );
}

// Deterministic stock photography via Lorem Picsum, seeded per subject so
// the same hotel/city always gets the same image instead of a random one
// on every render.
export const seededImage = (seed: string, width = 800, height = 600): string =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;

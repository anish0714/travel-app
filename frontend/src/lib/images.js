// Deterministic stock photography via Lorem Picsum, seeded per subject so
// the same hotel/city always gets the same image instead of a random one
// on every render.
export function seededImage(seed, width = 800, height = 600) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

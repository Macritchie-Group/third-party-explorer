export function parseOwnerPrefix(storeName: string): string {
  const idx = storeName.indexOf(" - ");
  return idx !== -1 ? storeName.slice(0, idx) : storeName;
}

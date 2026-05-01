const pendingIds = new Set<number>();
const soldIds = new Set<number>();
const listeners = new Set<() => void>();
let version = 0;

function notify() {
  version += 1;
  listeners.forEach((l) => l());
}

export function subscribePendingMeetup(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPendingMeetupVersion(): number {
  return version;
}

export function isPendingMeetupReservation(itemId: number): boolean {
  return pendingIds.has(itemId);
}

export function markPendingMeetupReservation(itemId: number): void {
  if (soldIds.has(itemId)) return;
  if (pendingIds.has(itemId)) return;
  pendingIds.add(itemId);
  notify();
}

export function isItemSoldOnMarketplace(itemId: number): boolean {
  return soldIds.has(itemId);
}

export function markItemPaidSold(itemId: number): void {
  pendingIds.delete(itemId);
  if (soldIds.has(itemId)) return;
  soldIds.add(itemId);
  notify();
}

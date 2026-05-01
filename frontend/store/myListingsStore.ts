import TestData from '@/test-data.json';

export type MyListingItem = (typeof TestData.items)[number] & {
  rating?: number;
};

let items: MyListingItem[] = [...TestData.items];
const listeners = new Set<(next: MyListingItem[]) => void>();

export function getItems(): MyListingItem[] {
  return items;
}

export function setItems(next: MyListingItem[]): void {
  items = next;
  listeners.forEach((listener) => listener(next));
}

export function subscribe(listener: (next: MyListingItem[]) => void): () => void {
  listeners.add(listener);
  listener(items);
  return () => listeners.delete(listener);
}

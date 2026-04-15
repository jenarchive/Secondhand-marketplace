type TransactionOfferStore = Record<number, string>;

let offersByItem: TransactionOfferStore = {};

let acceptedItemPriceById: Record<number, number> = {};

export function getOfferForItem(itemId: number): string {
  return offersByItem[itemId] ?? '';
}

export function setOfferForItem(itemId: number, price: string): void {
  offersByItem = {
    ...offersByItem,
    [itemId]: price,
  };
}

export function setAcceptedOfferItemPrice(itemId: number, price: number): void {
  if (!Number.isFinite(price) || price <= 0) return;
  acceptedItemPriceById = { ...acceptedItemPriceById, [itemId]: price };
}

export function getAcceptedOfferItemPrice(itemId: number): number | undefined {
  return acceptedItemPriceById[itemId];
}


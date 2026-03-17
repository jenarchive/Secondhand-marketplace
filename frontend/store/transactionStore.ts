type TransactionOfferStore = Record<number, string>;

let offersByItem: TransactionOfferStore = {};

export function getOfferForItem(itemId: number): string {
  return offersByItem[itemId] ?? '';
}

export function setOfferForItem(itemId: number, price: string): void {
  offersByItem = {
    ...offersByItem,
    [itemId]: price,
  };
}


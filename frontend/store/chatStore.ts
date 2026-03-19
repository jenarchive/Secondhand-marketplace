type ChatStore = Record<number, string[]>;

let messagesByItem: ChatStore = {};

export function getMessagesForItem(itemId: number): string[] {
  return messagesByItem[itemId] ?? [];
}

export function addMessageForItem(itemId: number, text: string): void {
  const existing = messagesByItem[itemId] ?? [];
  messagesByItem = {
    ...messagesByItem,
    [itemId]: [...existing, text],
  };
}


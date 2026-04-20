export type ChatMessage = {
  text: string;
  sentAt: number;
};

type LegacyChatStore = Record<number, string[]>;
type ChatStore = Record<number, ChatMessage[]>;

let messagesByItem: ChatStore | LegacyChatStore = {};

export function getMessagesForItem(itemId: number): ChatMessage[] {
  const raw = messagesByItem[itemId] ?? [];
  return raw.map((entry) => {
    if (typeof entry === 'string') {
      return {
        text: entry,
        sentAt: Date.now(),
      };
    }
    return entry;
  });
}

export function addMessageForItem(itemId: number, text: string): ChatMessage {
  const existing = getMessagesForItem(itemId);
  const newMessage: ChatMessage = {
    text,
    sentAt: Date.now(),
  };
  messagesByItem = {
    ...messagesByItem,
    [itemId]: [...existing, newMessage],
  };
  return newMessage;
}


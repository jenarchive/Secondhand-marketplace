import { getMessagesForItem, addMessageForItem } from '../store/chatStore';

describe('chatStore', () => {
  it('returns an empty array for an item with no messages', () => {
    expect(getMessagesForItem(99901)).toEqual([]);
  });

  it('addMessageForItem returns the new message with text and sentAt', () => {
    const msg = addMessageForItem(99902, 'hello world');
    expect(msg.text).toBe('hello world');
    expect(typeof msg.sentAt).toBe('number');
  });

  it('getMessagesForItem returns all previously added messages', () => {
    addMessageForItem(99903, 'first');
    addMessageForItem(99903, 'second');
    const messages = getMessagesForItem(99903);
    expect(messages.length).toBeGreaterThanOrEqual(2);
    const texts = messages.map((m) => m.text);
    expect(texts).toContain('first');
    expect(texts).toContain('second');
  });

  it('each message has text and sentAt properties', () => {
    addMessageForItem(99904, 'test message');
    const [msg] = getMessagesForItem(99904);
    expect(msg).toHaveProperty('text', 'test message');
    expect(msg).toHaveProperty('sentAt');
  });

  it('messages for different items are stored independently', () => {
    addMessageForItem(99905, 'item-a message');
    addMessageForItem(99906, 'item-b message');
    expect(getMessagesForItem(99905)[0].text).toBe('item-a message');
    expect(getMessagesForItem(99906)[0].text).toBe('item-b message');
  });
});

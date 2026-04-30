import {
  getOfferForItem,
  setOfferForItem,
  markOfferSentForItem,
  hasSentOfferForItem,
  setAcceptedOfferItemPrice,
  getAcceptedOfferItemPrice,
} from '../store/transactionStore';

describe('transactionStore', () => {
  it('getOfferForItem returns empty string for unknown item', () => {
    expect(getOfferForItem(88801)).toBe('');
  });

  it('setOfferForItem stores a price string retrievable by getOfferForItem', () => {
    setOfferForItem(88802, '75.00');
    expect(getOfferForItem(88802)).toBe('75.00');
  });

  it('setOfferForItem overwrites the previous offer', () => {
    setOfferForItem(88803, '50');
    setOfferForItem(88803, '60');
    expect(getOfferForItem(88803)).toBe('60');
  });

  it('hasSentOfferForItem returns false by default', () => {
    expect(hasSentOfferForItem(88804)).toBe(false);
  });

  it('markOfferSentForItem makes hasSentOfferForItem return true', () => {
    markOfferSentForItem(88805);
    expect(hasSentOfferForItem(88805)).toBe(true);
  });

  it('getAcceptedOfferItemPrice returns undefined by default', () => {
    expect(getAcceptedOfferItemPrice(88806)).toBeUndefined();
  });

  it('setAcceptedOfferItemPrice stores a valid positive price', () => {
    setAcceptedOfferItemPrice(88807, 120);
    expect(getAcceptedOfferItemPrice(88807)).toBe(120);
  });

  it('setAcceptedOfferItemPrice ignores a zero price', () => {
    setAcceptedOfferItemPrice(88808, 0);
    expect(getAcceptedOfferItemPrice(88808)).toBeUndefined();
  });

  it('setAcceptedOfferItemPrice ignores a negative price', () => {
    setAcceptedOfferItemPrice(88809, -10);
    expect(getAcceptedOfferItemPrice(88809)).toBeUndefined();
  });

  it('setAcceptedOfferItemPrice ignores NaN', () => {
    setAcceptedOfferItemPrice(88810, NaN);
    expect(getAcceptedOfferItemPrice(88810)).toBeUndefined();
  });
});

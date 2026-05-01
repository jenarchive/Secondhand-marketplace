import {
  subscribePendingMeetup,
  getPendingMeetupVersion,
  isPendingMeetupReservation,
  markPendingMeetupReservation,
  isItemSoldOnMarketplace,
  markItemPaidSold,
} from '../store/pendingMeetupStore';

describe('pendingMeetupStore', () => {
  it('isPendingMeetupReservation returns false for unknown item', () => {
    expect(isPendingMeetupReservation(77701)).toBe(false);
  });

  it('isItemSoldOnMarketplace returns false for unknown item', () => {
    expect(isItemSoldOnMarketplace(77702)).toBe(false);
  });

  it('markPendingMeetupReservation marks an item as pending', () => {
    markPendingMeetupReservation(77703);
    expect(isPendingMeetupReservation(77703)).toBe(true);
  });

  it('markPendingMeetupReservation increments the version', () => {
    const before = getPendingMeetupVersion();
    markPendingMeetupReservation(77704);
    expect(getPendingMeetupVersion()).toBe(before + 1);
  });

  it('markPendingMeetupReservation does not add duplicates or increment version twice', () => {
    markPendingMeetupReservation(77705);
    const version = getPendingMeetupVersion();
    markPendingMeetupReservation(77705);
    expect(getPendingMeetupVersion()).toBe(version);
  });

  it('markItemPaidSold marks item as sold', () => {
    markItemPaidSold(77706);
    expect(isItemSoldOnMarketplace(77706)).toBe(true);
  });

  it('markItemPaidSold removes item from pending reservations', () => {
    markPendingMeetupReservation(77707);
    markItemPaidSold(77707);
    expect(isPendingMeetupReservation(77707)).toBe(false);
    expect(isItemSoldOnMarketplace(77707)).toBe(true);
  });

  it('markItemPaidSold does not increment version when already sold', () => {
    markItemPaidSold(77708);
    const version = getPendingMeetupVersion();
    markItemPaidSold(77708);
    expect(getPendingMeetupVersion()).toBe(version);
  });

  it('markPendingMeetupReservation does not mark an already-sold item', () => {
    markItemPaidSold(77709);
    markPendingMeetupReservation(77709);
    expect(isPendingMeetupReservation(77709)).toBe(false);
  });

  it('subscribePendingMeetup returns an unsubscribe function', () => {
    const listener = jest.fn();
    const unsub = subscribePendingMeetup(listener);
    expect(typeof unsub).toBe('function');
  });

  it('subscribePendingMeetup listener is called when items change', () => {
    const listener = jest.fn();
    subscribePendingMeetup(listener);
    markPendingMeetupReservation(77710);
    expect(listener).toHaveBeenCalled();
  });

  it('unsubscribed listener is not called after unsubscribing', () => {
    const listener = jest.fn();
    const unsub = subscribePendingMeetup(listener);
    unsub();
    listener.mockClear();
    markPendingMeetupReservation(77711);
    expect(listener).not.toHaveBeenCalled();
  });
});

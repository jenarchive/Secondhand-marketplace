import { getItems, setItems, subscribe } from '../store/myListingsStore';

describe('myListingsStore', () => {
  it('getItems returns an array of items', () => {
    const items = getItems();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  it('setItems replaces the store contents', () => {
    const newItems = [
      {
        id: 99001,
        title: 'Test Item',
        price: 50,
        description: 'desc',
        image: '',
        category: 'Other',
        location: 'Testville',
      },
    ];
    setItems(newItems as any);
    expect(getItems()).toEqual(newItems);
  });

  it('subscribe calls the listener immediately with current items', () => {
    const listener = jest.fn();
    subscribe(listener);
    expect(listener).toHaveBeenCalledWith(getItems());
  });

  it('subscribe calls listener when setItems is called', () => {
    const listener = jest.fn();
    subscribe(listener);
    listener.mockClear();

    const updated = [
      {
        id: 99002,
        title: 'Updated Item',
        price: 99,
        description: 'updated',
        image: '',
        category: 'Other',
        location: 'City',
      },
    ];
    setItems(updated as any);
    expect(listener).toHaveBeenCalledWith(updated);
  });

  it('subscribe returns a working unsubscribe function', () => {
    const listener = jest.fn();
    const unsub = subscribe(listener);
    expect(typeof unsub).toBe('function');

    unsub();
    listener.mockClear();

    setItems([] as any);
    expect(listener).not.toHaveBeenCalled();
  });
});

import { createOrderFromCheckout, normalizeImageSource, parseStoredArray } from './persistence';

describe('persistence helpers', () => {
  it('returns fallback arrays when stored json is invalid', () => {
    const fallback = ['one', 'two'];
    expect(parseStoredArray('not-json', fallback)).toEqual(fallback);
    expect(parseStoredArray(null, fallback)).toEqual(fallback);
  });

  it('normalizes image sources into serializable strings', () => {
    expect(normalizeImageSource('https://example.com/image.png')).toBe('https://example.com/image.png');
    expect(normalizeImageSource({ uri: 'file:///tmp/image.png' })).toBe('file:///tmp/image.png');
  });

  it('builds an order record from checkout data', () => {
    const order = createOrderFromCheckout({
      cart: [
        {
          id: 1,
          image: { uri: 'file:///tmp/product.png' },
          name: 'Sample Product',
          quantity: 2,
          priceValue: 1500,
        },
      ],
      delivery: 500,
      paymentMethod: 'Card •••• 1234',
      address: {
        name: 'Jane Doe',
        phone: '+2348000000000',
        street: '12 Test Street',
        city: 'Lagos',
        state: 'Lagos',
      },
      createdAt: new Date('2026-06-04T10:00:00.000Z'),
    });

    expect(order.id).toBe('CWR-1780567200000');
    expect(order.date).toBe('Jun 4, 2026');
    expect(order.status).toBe('Processing');
    expect(order.subtotal).toBe(3000);
    expect(order.delivery).toBe(500);
    expect(order.paymentMethod).toBe('Card •••• 1234');
    expect(order.address).toBe('12 Test Street, Lagos, Lagos');
    expect(order.items).toEqual([
      {
        image: 'file:///tmp/product.png',
        name: 'Sample Product',
        qty: 2,
        price: 1500,
      },
    ]);
  });
});

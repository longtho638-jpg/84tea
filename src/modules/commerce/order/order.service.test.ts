// src/modules/commerce/order/order.service.test.ts
import { OrderService } from './order.service';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

// Mock Supabase admin
jest.mock('@/lib/supabase/admin', () => ({
  getSupabaseAdmin: jest.fn(),
}));

describe('OrderService', () => {
  const mockSupabase = {
    from: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getSupabaseAdmin as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('generateNumericOrderCode', () => {
    it('generates a numeric code within safe integer range', () => {
      const code = OrderService.generateNumericOrderCode();
      expect(typeof code).toBe('number');
      expect(code).toBeGreaterThan(0);
      expect(code).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
    });

    it('generates unique codes', () => {
      const codes = new Set();
      const spy = jest.spyOn(Date, 'now');

      for (let i = 0; i < 100; i++) {
        spy.mockReturnValue(1700000000000 + i); // Increment timestamp
        codes.add(OrderService.generateNumericOrderCode());
      }
      expect(codes.size).toBe(100);
      spy.mockRestore();
    });
  });

  describe('validateCartItems', () => {
    const mockItems = [
      { id: 'p1', quantity: 2, price: 100000 },
      { id: 'p2', quantity: 1, price: 200000 },
    ];

    const mockProductsData = [
      { id: 'p1', name: 'Product 1', price: 100000, in_stock: true, images: ['img1.jpg'] },
      { id: 'p2', name: 'Product 2', price: 200000, in_stock: true, images: [] },
    ];

    it('validates cart items successfully when all exist and are in stock', async () => {
      const mockIn = jest.fn().mockResolvedValue({ data: mockProductsData, error: null });
      const mockSelect = jest.fn().mockReturnValue({ in: mockIn });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const result = await OrderService.validateCartItems(mockItems);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'p1',
        name: 'Product 1',
        price: 100000,
        quantity: 2,
        image: 'img1.jpg',
      });
      expect(result[1].image).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
    });

    it('throws error when database fetch fails', async () => {
      const mockIn = jest.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } });
      const mockSelect = jest.fn().mockReturnValue({ in: mockIn });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      await expect(OrderService.validateCartItems(mockItems)).rejects.toThrow(
        'Failed to fetch product data for validation.'
      );
    });

    it('throws error when a product is not found in database', async () => {
      // Return only one product even though two were requested
      const mockIn = jest.fn().mockResolvedValue({ data: [mockProductsData[0]], error: null });
      const mockSelect = jest.fn().mockReturnValue({ in: mockIn });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      await expect(OrderService.validateCartItems(mockItems)).rejects.toThrow(
        'Product with ID p2 not found.'
      );
    });

    it('throws error when a product is out of stock', async () => {
      const outOfStockData = [
        { ...mockProductsData[0], in_stock: false },
      ];
      const mockIn = jest.fn().mockResolvedValue({ data: outOfStockData, error: null });
      const mockSelect = jest.fn().mockReturnValue({ in: mockIn });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      await expect(OrderService.validateCartItems([mockItems[0]])).rejects.toThrow(
        'Product Product 1 is out of stock.'
      );
    });
  });

  describe('calculateOrderTotal', () => {
    it('calculates total correctly for multiple items', () => {
      const items = [
        { id: 'p1', name: 'P1', price: 100000, quantity: 2 },
        { id: 'p2', name: 'P2', price: 50000, quantity: 3 },
      ];
      const total = OrderService.calculateOrderTotal(items);
      expect(total).toBe(350000);
    });

    it('returns 0 for empty items array', () => {
      expect(OrderService.calculateOrderTotal([])).toBe(0);
    });
  });
});

// src/modules/commerce/order/order.service.ts
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { Database } from "@/types/database.types";

export interface ValidatedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

type Product = Database['public']['Tables']['products']['Row'];

export class OrderService {
  /**
   * Generate numeric order code for PayOS compatibility
   * Range: safe integer (max 9007199254740991)
   */
  static generateNumericOrderCode(): number {
    const timestamp = Date.now() % 1_000_000_000;
    const random = Math.floor(Math.random() * 1000);
    return timestamp * 1000 + random;
  }

  /**
   * Server-side validation of cart items against product data.
   * Ensures product existence, available stock, and correct pricing.
   * @param items - Array of items from the client cart.
   * @returns Array of validated items with correct details from the database.
   * @throws Error if any item is invalid or out of stock.
   */
  static async validateCartItems(items: { id: string; quantity: number; price: number; }[]): Promise<ValidatedItem[]> {
    const supabase = getSupabaseAdmin();
    const { data: productsData, error } = await supabase
      .from("products")
      .select("id, name, price, in_stock, images")
      .in(
        "id",
        items.map((item) => item.id)
      );

    const products = productsData as unknown as Product[];

    if (error || !products) {
      throw new Error("Failed to fetch product data for validation.");
    }

    const validatedItems: ValidatedItem[] = [];
    for (const item of items) {
      // Find the product in the returned data
      const product = products.find((p) => p.id === item.id);

      if (!product) {
        throw new Error(`Product with ID ${item.id} not found.`);
      }
      if (!product.in_stock) {
        throw new Error(`Product ${product.name} is out of stock.`);
      }

      validatedItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
      });
    }

    return validatedItems;
  }

  /**
   * Calculates the total price of an array of validated items.
   * @param items - Array of validated items.
   * @returns The total price.
   */
  static calculateOrderTotal(items: ValidatedItem[]): number {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}

export interface Product {
  id: string;
  slug: string;
  name: { vi: string; en: string } | string; // Handle both localized and simple string
  description: { vi: string; en: string } | string;
  category: string;
  price: number;
  original_price?: number;
  image_url: string; // Unified image field
  images?: string[];
  energy_level?: string;
  tags?: string[];
  is_featured: boolean;
  in_stock: boolean;
  weight?: string;
  origin?: string;
  harvest?: string;
  taste?: string;
  type?: string;
}

export interface Category {
  id: string;
  name: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", name: "Tất cả" },
  { id: "tea", name: "Trà" },
  { id: "teaware", name: "Dụng cụ" },
  { id: "gift", name: "Quà tặng" },
];

export const TEA_TYPES = [
  { id: "green", name: "Lục trà (Green)" },
  { id: "black", name: "Hồng trà (Black)" },
  { id: "white", name: "Bạch trà (White)" },
  { id: "oolong", name: "Oolong" },
  { id: "herbal", name: "Thảo mộc (Herbal)" }
];


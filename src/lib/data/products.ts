import { Database } from '@/types/database.types';

export type Product = Database['public']['Tables']['products']['Row'];

export const CATEGORIES = [
  { id: "all", name: "Tất cả" },
  { id: "tea", name: "Trà thưởng thức" },
  { id: "teaware", name: "Ấm chén & Dụng cụ" },
  { id: "gift", name: "Quà tặng" }
];

export const TEA_TYPES = [
  { id: "green", name: "Trà Xanh (Lục Trà)" },
  { id: "black", name: "Hồng Trà" },
  { id: "white", name: "Bạch Trà" },
  { id: "oolong", name: "Trà Ô Long" },
  { id: "herbal", name: "Trà Thảo Mộc" }
];


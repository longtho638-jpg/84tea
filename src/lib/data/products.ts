import { Database } from '@/types/database.types';

export type Product = Database['public']['Tables']['products']['Row'];

export const CATEGORIES = [
  { id: "all", name: "all" },
  { id: "tea", name: "tea" },
  { id: "teaware", name: "teaware" },
  { id: "gift", name: "gift" }
];

export const TEA_TYPES = [
  { id: "green", name: "green" },
  { id: "black", name: "black" },
  { id: "white", name: "white" },
  { id: "oolong", name: "oolong" },
  { id: "herbal", name: "herbal" }
];


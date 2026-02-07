/**
 * API Input Validation Schemas
 * Uses Zod for type-safe runtime validation
 */

import { z } from 'zod';

/**
 * Order creation schema
 */
export const orderSchema = z.object({
  cartItems: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number().int().min(1).max(99),
      price: z.number().positive(),
    })
  ).min(1).max(50), // Max 50 items per order
  customerInfo: z.object({
    email: z.string().email().max(255),
    name: z.string().min(2).max(100),
    phone: z.string().regex(/^[0-9]{10,11}$/, 'Invalid phone number format'),
  }),
  deliveryAddress: z.object({
    street: z.string().min(5).max(255),
    city: z.string().min(2).max(100),
    postalCode: z.string().regex(/^[0-9]{5,6}$/),
  }).optional(),
  notes: z.string().max(500).optional(),
});

/**
 * Contact form schema
 */
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().regex(/^[0-9]{10,11}$/).optional(),
  message: z.string().min(10).max(1000),
  subject: z.enum(['general', 'franchise', 'support', 'wholesale']),
});

/**
 * Franchise inquiry schema
 */
export const franchiseInquirySchema = z.object({
  personalInfo: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().max(255),
    phone: z.string().regex(/^[0-9]{10,11}$/),
  }),
  businessInfo: z.object({
    city: z.string().min(2).max(100),
    investmentBudget: z.enum(['under-500m', '500m-1b', '1b-2b', 'over-2b']),
    experience: z.enum(['none', 'some', 'extensive']),
  }),
  message: z.string().max(1000).optional(),
});

/**
 * Product creation/update schema (admin API)
 */
export const productSchema = z.object({
  name: z.string().min(2).max(200).trim(),
  name_en: z.string().max(200).trim().optional(),
  description: z.string().max(2000).trim().optional(),
  description_en: z.string().max(2000).trim().optional(),
  price: z.number().int().min(0).max(100_000_000),
  category: z.string().min(1).max(100).trim(),
  image_url: z.string().url().max(2048).optional().or(z.literal('')),
  weight: z.string().max(50).trim().optional(),
  origin: z.string().max(200).trim().optional(),
  in_stock: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type FranchiseInquiryInput = z.infer<typeof franchiseInquirySchema>;
export type ProductInput = z.infer<typeof productSchema>;

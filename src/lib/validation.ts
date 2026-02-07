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

export type OrderInput = z.infer<typeof orderSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type FranchiseInquiryInput = z.infer<typeof franchiseInquirySchema>;

/**
 * API Input Validation Schemas
 * Uses Zod for type-safe runtime validation
 */

import { z } from 'zod';

/**
 * Order creation schema (matches checkout form submission)
 */
export const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1).optional(),
      id: z.string().min(1).optional(),
      name: z.string().min(1).max(200),
      quantity: z.number().int().min(1).max(99),
      price: z.number().positive(),
      weight: z.string().max(50).optional(),
      image: z.string().max(2048).optional(),
    })
  ).min(1).max(50),
  total: z.number().positive(),
  customerInfo: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().min(10).max(15),
    email: z.string().email().max(255).optional().or(z.literal('')),
    address: z.string().min(5).max(500),
    city: z.string().min(1).max(100),
    note: z.string().max(500).optional().or(z.literal('')),
  }),
  paymentMethod: z.string().max(20).optional(),
});

/**
 * Contact form schema
 */
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().regex(/^[0-9]{10,11}$/).optional(),
  message: z.string().min(10).max(1000),
  subject: z.enum(['general', 'order', 'wholesale', 'franchise', 'partnership', 'feedback', 'support']),
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

/**
 * Payment link creation schema
 */
export const paymentLinkSchema = z.object({
  orderCode: z.number().int().positive(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).max(500),
  returnUrl: z.string().url().max(2048),
  cancelUrl: z.string().url().max(2048),
  items: z.array(
    z.object({
      id: z.string().min(1).optional(),
      productId: z.string().min(1).optional(),
      name: z.string().min(1).max(200),
      quantity: z.number().int().min(1).max(99),
      price: z.number().positive(),
    })
  ).min(1).max(50),
  buyerName: z.string().max(100).optional(),
  buyerPhone: z.string().max(15).optional(),
  buyerEmail: z.string().email().max(255).optional().or(z.literal('')),
  buyerAddress: z.string().max(500).optional(),
});

/**
 * Webhook body schema (basic structure validation before PayOS SDK verify)
 */
export const webhookSchema = z.object({
  code: z.string(),
  desc: z.string().optional(),
  data: z.object({
    orderCode: z.number(),
    amount: z.number(),
    description: z.string().optional(),
    accountNumber: z.string().optional(),
    reference: z.string().optional(),
    transactionDateTime: z.string().optional(),
    paymentLinkId: z.string().optional(),
    code: z.string().optional(),
    desc: z.string().optional(),
    counterAccountBankId: z.string().nullable().optional(),
    counterAccountBankName: z.string().nullable().optional(),
    counterAccountName: z.string().nullable().optional(),
    counterAccountNumber: z.string().nullable().optional(),
    virtualAccountName: z.string().nullable().optional(),
    virtualAccountNumber: z.string().nullable().optional(),
    currency: z.string().optional(),
  }).passthrough(),
  signature: z.string(),
  success: z.boolean().optional(),
});

export type PaymentLinkInput = z.infer<typeof paymentLinkSchema>;
export type WebhookInput = z.infer<typeof webhookSchema>;

/**
 * Franchise application schema (multi-step form)
 */
export const franchiseApplySchema = z.object({
  fullName: z.string().min(2).max(100),
  idNumber: z.string().min(9).max(12),
  birthDate: z.string().min(1),
  email: z.string().email().max(255),
  phone: z.string().regex(/^[0-9]{10,11}$/),
  currentAddress: z.string().min(5).max(500),
  fbExperience: z.string().max(50).optional(),
  managementExperience: z.string().max(50).optional(),
  availableCapital: z.string().min(1).max(50),
  currentOccupation: z.string().max(200).optional(),
  preferredLocation: z.string().max(500).optional(),
  city: z.string().min(1).max(100),
  spaceSize: z.string().max(50).optional(),
  expectedOpenDate: z.string().max(50).optional(),
  motivation: z.string().max(2000).optional(),
});

export type FranchiseApplyInput = z.infer<typeof franchiseApplySchema>;

import { z } from "zod";

/**
 * Checkout form validation schema
 * Validates customer information for order processing
 */
export const checkoutSchema = z.object({
  // Customer name (required, 2-100 characters)
  name: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được quá 100 ký tự")
    .trim(),

  // Email (required, valid email format)
  email: z
    .string()
    .email("Email không hợp lệ")
    .min(5, "Email phải có ít nhất 5 ký tự")
    .max(255, "Email không được quá 255 ký tự")
    .toLowerCase()
    .trim(),

  // Phone number (required, Vietnamese format)
  phone: z
    .string()
    .regex(
      /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
      "Số điện thoại không hợp lệ (VD: 0901234567)"
    )
    .trim(),

  // Delivery address (required, 10-500 characters)
  address: z
    .string()
    .min(10, "Địa chỉ phải có ít nhất 10 ký tự")
    .max(500, "Địa chỉ không được quá 500 ký tự")
    .trim(),

  // Optional note/special instructions
  note: z
    .string()
    .max(1000, "Ghi chú không được quá 1000 ký tự")
    .optional()
    .default(""),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

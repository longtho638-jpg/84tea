"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/types/product";

export interface ProductCardGlassProps {
  product: Product;
}

export function ProductCardGlass({ product }: ProductCardGlassProps) {
  const t = useTranslations("Products.Card");
  const { addItem } = useCart();

  // Helper for localized fields
  // Ideally this component should receive the current locale or use useLocale()
  const productName = typeof product.name === 'string' ? product.name : product.name.vi;
  const productDesc = typeof product.description === 'string' ? product.description : product.description.vi;

  const { price, slug, id, weight } = product;
  const image = product.image_url;
  const category = product.tags?.[0] || product.origin;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-xl"
    >
      {/* Glassmorphism Background */}
      <div className="glass absolute inset-0 border border-outline-variant/20 shadow-elevation-2 transition-all group-hover:shadow-elevation-4" />

      <div className="relative p-6">
        {/* Category Badge */}
        {category && (
          <div className="mb-3">
            <span className="inline-block rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container">
              {category}
            </span>
          </div>
        )}

        {/* Product Image */}
        <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-surface-variant">
          {image ? (
            <Image
              src={image}
              alt={productName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl">🍵</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3
            className="font-display text-xl font-semibold text-on-surface"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {productName}
          </h3>

          {productDesc && (
            <p className="line-clamp-2 text-sm text-on-surface-variant">
              {productDesc}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-2xl font-bold text-primary">
              {price.toLocaleString("vi-VN")}₫
            </p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  id,
                  slug,
                  name: productName,
                  price,
                  weight: weight ?? '',
                  image: image ?? '🍵'
                });
              }}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary shadow-elevation-1 transition-all hover:shadow-elevation-3"
            >
              {t("addToCart")}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(27, 94, 32, 0.1) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

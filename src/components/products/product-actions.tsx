"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/types/product";

export function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const t = useTranslations("Products.Detail.Actions");

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: typeof product.name === 'string' ? product.name : product.name.vi, // Handle localized name
      price: product.price,
      weight: product.weight || '100g',
      image: product.image_url || '🍵'
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        variant="filled"
        size="lg"
        onClick={handleAddToCart}
        className="flex-1"
      >
        <span className="material-symbols-rounded mr-2" aria-hidden="true">
          {isAdded ? "check" : "shopping_bag"}
        </span>
        {isAdded ? t("added") : t("addToCart")}
      </Button>
      <Button variant="outlined" size="lg" className="px-6" aria-label={t("addToFavorites")}>
        <span className="material-symbols-rounded" aria-hidden="true">favorite</span>
      </Button>
    </div>
  );
}

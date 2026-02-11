"use client";

import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function CartButton({ className }: { className?: string }) {
  const { itemCount, setIsOpen } = useCart();
  const t = useTranslations("Cart");

  return (
    <Button
      variant="text"
      size="icon"
      onClick={() => setIsOpen(true)}
      className={cn("relative text-on-surface hover:text-primary", className)}
      aria-label={itemCount > 0 ? t("ariaLabelWithCount", { count: itemCount }) : t("ariaLabel")}
    >
      <span className="material-symbols-rounded text-[24px]" aria-hidden="true">shopping_bag</span>
      {itemCount > 0 && (
        <span
          className="absolute top-0 right-0 h-4 w-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center"
          aria-hidden="true"
        >
          {itemCount}
        </span>
      )}
    </Button>
  );
}

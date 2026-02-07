"use client";

import { useTranslations } from "next-intl";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Link } from "@/i18n/routing";

export function MobileStickyBar() {
  const t = useTranslations("Navigation");
  const { items } = useCart();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="flex items-stretch border-t border-outline-variant bg-surface shadow-elevation-3">
        {/* Zalo Chat Button */}
        <a
          href="https://zalo.me/84988030204"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 border-r border-outline-variant py-3 min-h-[44px] text-sm font-medium text-on-surface transition-colors hover:bg-surface-variant active:bg-surface-variant/80"
        >
          <MessageCircle className="h-5 w-5 text-primary" />
          <span>Chat Zalo</span>
        </a>

        {/* Cart Button */}
        <Link
          href="/cart"
          className="relative flex flex-1 items-center justify-center gap-2 py-3 min-h-[44px] text-sm font-medium text-on-surface transition-colors hover:bg-surface-variant active:bg-surface-variant/80"
        >
          <ShoppingCart className="h-5 w-5 text-primary" />
          <span>{t("cart", { defaultValue: "Giỏ hàng" })}</span>
          {itemCount > 0 && (
            <span className="absolute right-4 top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-error px-1.5 text-xs font-bold text-on-error">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { MessageCircle, ShoppingCart, Phone } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Link } from "@/i18n/routing";

export function MobileStickyBar() {
  const t = useTranslations("Navigation");
  const { items } = useCart();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex items-stretch border-t border-outline-variant bg-surface shadow-elevation-3">
        {/* Zalo Chat Button */}
        <a
          href="https://zalo.me/84988030204"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 border-r border-outline-variant py-3 min-h-[44px] text-xs font-medium text-on-surface transition-colors hover:bg-surface-variant active:bg-surface-variant/80"
          aria-label="Chat Zalo"
        >
          <MessageCircle className="h-4 w-4 text-primary" />
          <span>Zalo</span>
        </a>

        {/* Order CTA Button - Primary action */}
        <Link
          href="/products"
          className="flex flex-[1.5] items-center justify-center gap-2 border-r border-outline-variant py-3 min-h-[44px] text-sm font-bold bg-primary text-on-primary transition-colors hover:bg-primary/90 active:bg-primary/80"
        >
          <Phone className="h-4 w-4" />
          <span>{t("orderNow", { defaultValue: "Dat Hang" })}</span>
        </Link>

        {/* Cart Button */}
        <Link
          href="/cart"
          className="relative flex flex-1 items-center justify-center gap-1.5 py-3 min-h-[44px] text-xs font-medium text-on-surface transition-colors hover:bg-surface-variant active:bg-surface-variant/80"
        >
          <ShoppingCart className="h-4 w-4 text-primary" />
          <span>{t("cart", { defaultValue: "Gio hang" })}</span>
          {itemCount > 0 && (
            <span className="absolute right-2 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-on-error">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  const navItems = [
    { href: "/", label: t("home"), icon: "home" },
    { href: "/products", label: t("products"), icon: "inventory_2" },
    { href: "/franchise", label: t("franchise"), icon: "storefront" },
    { href: "/contact", label: t("contact"), icon: "mail" },
  ];

  return (
    <nav
      aria-label={t("mainNavigation")}
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-40",
        "bg-surface-container shadow-elevation-3 border-t border-outline-variant",
        "pb-[env(safe-area-inset-bottom,0px)]"
      )}
    >
      <div className="flex items-center justify-around h-20 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl min-w-[64px]",
                "transition-all duration-200",
                isActive
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-on-surface/8"
              )}
            >
              <span
                className={cn(
                  "material-symbols-rounded text-2xl transition-all",
                  isActive && "fill-1"
                )}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

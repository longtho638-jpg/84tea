"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { TopAppBar } from "./top-app-bar";
import { BottomNavigation } from "./bottom-navigation";

const NavigationDrawer = dynamic(
  () => import("./navigation-drawer").then((mod) => mod.NavigationDrawer),
  { ssr: false }
);

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const t = useTranslations("Navigation");

  return (
    <>
      {/* Skip to main content link — WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-lg focus:shadow-elevation-3 focus:outline-none"
      >
        {t("skipToContent")}
      </a>

      {/* Top App Bar */}
      <TopAppBar onMenuClick={() => setDrawerOpen(true)} />

      {/* Navigation Drawer (Mobile) */}
      <NavigationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main Content */}
      <main id="main-content" className="min-h-screen pt-16 pb-24 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNavigation />
    </>
  );
}

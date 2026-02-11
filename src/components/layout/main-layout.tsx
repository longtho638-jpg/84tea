"use client";

import { useState } from "react";
import { TopAppBar } from "./top-app-bar";
import { NavigationDrawer } from "./navigation-drawer";
import { BottomNavigation } from "./bottom-navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
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

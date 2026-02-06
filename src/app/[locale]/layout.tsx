import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { playfairDisplay, inter } from "@/lib/fonts";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import ErrorBoundary from "@/components/react-error-boundary-wrapper";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "84tea | Trà Năng Lượng Việt - Trà Cổ Thụ Lên Men",
  description:
    "84tea - Thương hiệu trà cao cấp Việt Nam. Bộ sưu tập 84 Limited: trà lên men từ cây Shan Tuyết cổ thụ. Nơi truyền thống gặp gỡ sang trọng.",
  keywords: [
    "84tea",
    "trà Việt Nam",
    "trà lên men",
    "Shan Tuyết",
    "trà cao cấp",
    "trà cổ thụ",
    "84 Limited",
    "Trà Năng Lượng Việt",
    "trà Hà Giang",
  ],
  authors: [{ name: "84tea" }],
  openGraph: {
    title: "84tea | Trà Năng Lượng Việt",
    description:
      "Thương hiệu trà cao cấp Việt Nam với bộ sưu tập 84 Limited - trà lên men từ cây Shan Tuyết cổ thụ.",
    url: "https://84tea.com",
    siteName: "84tea",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "84tea | Trà Năng Lượng Việt",
    description: "Thương hiệu trà cao cấp Việt Nam với bộ sưu tập 84 Limited.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "",
  },
};

type Locale = (typeof routing.locales)[number];

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1b5e20" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="84tea" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        {/* Material Symbols - Optimized loading */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} antialiased bg-surface text-on-surface`}
      >
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextIntlClientProvider messages={messages}>
              <AuthProvider>
                <CartProvider>
                  {children}
                  <CartDrawer />
                </CartProvider>
              </AuthProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

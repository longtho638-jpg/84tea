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
import { MobileStickyBar } from "@/components/layout/mobile-sticky-bar";
import { FloatingContact } from "@/components/ui/floating-contact";
import { routing } from "@/i18n/routing";
import { SEO_CONFIG } from "@/lib/seo-constants";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    title: {
      default: SEO_CONFIG.siteName[locale as 'vi' | 'en'],
      template: `%s | ${SEO_CONFIG.siteName[locale as 'vi' | 'en']}`,
    },
    description:
      locale === 'vi'
        ? 'Trà Cổ Thụ Việt Nam - Năng lượng thuần khiết từ thiên nhiên'
        : 'Vietnamese Ancient Tree Tea - Pure energy from nature',
    keywords: [
      "84tea",
      locale === 'vi' ? "trà Việt Nam" : "Vietnamese tea",
      locale === 'vi' ? "trà lên men" : "fermented tea",
      "Shan Tuyết",
      locale === 'vi' ? "trà cao cấp" : "premium tea",
      locale === 'vi' ? "trà cổ thụ" : "ancient tree tea",
      "84 Limited",
      locale === 'vi' ? "Trà Năng Lượng Việt" : "Vietnamese Energy Tea",
    ],
    openGraph: {
      type: 'website',
      locale,
      url: SEO_CONFIG.siteUrl,
      siteName: SEO_CONFIG.siteName[locale as 'vi' | 'en'],
      images: [
        {
          url: SEO_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: SEO_CONFIG.siteName[locale as 'vi' | 'en'],
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: SEO_CONFIG.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

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
                  <MobileStickyBar />
                  <FloatingContact />
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

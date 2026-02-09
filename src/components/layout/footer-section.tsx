import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Typography } from "@/components/ui/typography";
import { Logo } from "@/components/ui/logo";

export function FooterSection() {
  const t = useTranslations("Footer");

  const footerLinks = {
    products: [
      { href: "/products", label: t("allProducts") },
      { href: "/products/tra-shan-6", label: t("limitedCollection") },
      { href: "/products/tra-luc-80", label: t("greenTea") },
    ],
    company: [
      { href: "/about", label: t("about") },
      { href: "/franchise", label: t("franchise") },
      { href: "/contact", label: t("contact") },
    ],
    legal: [
      { href: "/terms", label: t("terms") },
      { href: "/privacy", label: t("privacy") },
      { href: "/shipping", label: t("shipping") },
    ],
  };

  return (
    <footer className="bg-inverse-surface text-inverse-on-surface py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/">
                <Logo variant="light" />
              </Link>
            </div>
            <Typography variant="body-medium" className="text-inverse-on-surface mb-4">
              {t("brandDescription")}
            </Typography>
            <Typography
              variant="title-medium"
              className="text-secondary-container font-display"
            >
              {t("slogan")}
            </Typography>
          </div>

          {/* Products */}
          <div>
            <Typography variant="title-medium" className="text-primary-container font-semibold mb-4">
              {t("products")}
            </Typography>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-inverse-on-surface hover:text-primary-container transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <Typography variant="title-medium" className="text-primary-container font-semibold mb-4">
              {t("company")}
            </Typography>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-inverse-on-surface hover:text-primary-container transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <Typography variant="title-medium" className="text-primary-container font-semibold mb-4">
              {t("contact")}
            </Typography>
            <ul className="space-y-2 text-inverse-on-surface text-sm mb-6">
              <li>📧 hello@84tea.com</li>
              <li>📱 +84 988 030204</li>
              <li>📍 {t("businessAddress")}</li>
            </ul>

            {/* Business Info */}
            <div className="mb-6 text-inverse-on-surface/70 text-xs space-y-1">
              <p className="font-semibold text-inverse-on-surface/90">{t("businessName")}</p>
              <p>{t("businessTaxId")}</p>
              <p>{t("businessRepresentative")}</p>
            </div>

            <Typography variant="title-small" className="text-primary-container font-semibold mb-2">
              {t("legal")}
            </Typography>
            <ul className="space-y-1">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-inverse-on-surface hover:text-primary-container transition-colors text-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-outline-variant mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-inverse-on-surface text-sm">
            {t("copyright")}
          </p>
          <p className="text-inverse-on-surface text-sm">
            {t("madeWithLove")}
          </p>
        </div>
      </div>
    </footer>
  );
}

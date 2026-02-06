"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface text-on-surface">
      <h2 className="text-4xl font-display mb-4">{t("title")}</h2>
      <p className="mb-6 font-body text-body-large">{t("description")}</p>
      <Link
        href="/"
        className="px-6 py-2 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-colors"
      >
        {t("returnHome")}
      </Link>
    </div>
  );
}

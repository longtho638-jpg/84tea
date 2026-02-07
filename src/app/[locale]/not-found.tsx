"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface text-on-surface px-4">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-surface-variant flex items-center justify-center">
          <span className="material-symbols-rounded text-6xl text-on-surface-variant">
            explore_off
          </span>
        </div>
        <h2 className="text-display-small font-display mb-4 text-on-surface">404</h2>
        <p className="text-headline-small font-display mb-2 text-on-surface">{t("title")}</p>
        <p className="mb-8 font-body text-body-large text-on-surface-variant">{t("description")}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-all shadow-elevation-1 hover:shadow-elevation-2"
        >
          <span className="material-symbols-rounded text-xl">home</span>
          {t("returnHome")}
        </Link>
      </div>
    </div>
  );
}

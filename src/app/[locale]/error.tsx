"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    console.error("Locale error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="max-w-md w-full text-center animate-scale-in">
        <div className="bg-error-container rounded-[28px] p-10 shadow-elevation-3">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
            <span className="material-symbols-rounded text-5xl text-error">
              error_outline
            </span>
          </div>
          <h1 className="text-headline-medium font-display text-on-error-container mb-3">
            {t("title")}
          </h1>
          <p className="text-body-medium text-on-error-container/80 mb-2">
            {t("description")}
          </p>
          {error.digest && (
            <p className="text-label-small text-on-error-container/50 mb-8 font-mono">
              {t("errorCode", { digest: error.digest })}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button
              onClick={reset}
              variant="filled"
              className="min-w-[140px]"
            >
              <span className="material-symbols-rounded text-xl mr-2">refresh</span>
              {t("retry")}
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outlined"
              className="min-w-[140px] border-on-error-container/30 text-on-error-container hover:bg-on-error-container/8"
            >
              <span className="material-symbols-rounded text-xl mr-2">home</span>
              {t("goHome")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

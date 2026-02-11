"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

interface ProfileSetupFormProps {
  onComplete: () => void;
}

export function ProfileSetupForm({ onComplete }: ProfileSetupFormProps) {
  const t = useTranslations("Auth");
  const { profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      setError(t("errorMissingInfo"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error } = await updateProfile({
      full_name: fullName,
      phone: phone,
    });

    setIsSubmitting(false);

    if (error) {
      setError(error.message || t("errorGeneric"));
    } else {
      onComplete();
    }
  };

  return (
    <div className="grid gap-6 py-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-primary">{t("setupTitle")}</h3>
        <p className="text-sm text-on-surface-variant">
          {t("setupDesc")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="fullName" className="text-sm font-medium">
            {t("fullName")}
          </label>
          <Input
            id="fullName"
            placeholder={t("fullNamePlaceholder")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium">
            {t("phone")}
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("phonePlaceholder")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        {error && (
          <div className="text-sm text-error bg-error-container p-3 rounded-lg flex items-center gap-2">
            <span className="material-symbols-rounded text-lg" aria-hidden="true">error</span>
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="filled"
          disabled={isSubmitting || !fullName || !phone}
          className="w-full"
        >
          {isSubmitting ? (
            <span className="material-symbols-rounded animate-spin mr-2" aria-hidden="true">
              progress_activity
            </span>
          ) : (
            <span className="material-symbols-rounded mr-2" aria-hidden="true">save</span>
          )}
          {t("update")}
        </Button>
      </form>
    </div>
  );
}

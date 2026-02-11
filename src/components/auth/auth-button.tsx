"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "./auth-modal";

export function AuthButton({
  className,
  variant = "icon",
  children
}: {
  className?: string;
  variant?: "icon" | "full" | "filled" | "outlined";
  children?: React.ReactNode;
}) {
  const { user, profile, isLoading, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("Auth");

  if (isLoading) {
    if (variant === "icon") {
      return (
        <div className={`w-10 h-10 rounded-full bg-surface-container-high animate-pulse ${className}`} />
      );
    }
    return (
      <div className={`h-10 rounded-full bg-surface-container-high animate-pulse ${className} w-32`} />
    );
  }

  if (user) {
    if (variant === "full") {
      return (
        <div className={`flex flex-col gap-2 ${className}`}>
           <div className="flex items-center gap-3 px-2 mb-2">
              {profile?.avatar_url ? (
                 <Image
                   src={profile.avatar_url}
                   alt={profile.full_name || "User"}
                   width={40}
                   height={40}
                   className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                 />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
                  {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                </div>
              )}
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium truncate">{profile?.full_name || t("member")}</span>
                <span className="text-xs text-on-surface-variant truncate">{user.email}</span>
                {profile?.loyalty_points !== undefined && (
                  <div className="flex items-center gap-1 mt-0.5 text-primary">
                    <span className="material-symbols-rounded text-[10px]" aria-hidden="true">stars</span>
                    <span className="text-xs font-semibold">{profile.loyalty_points.toLocaleString()} {t("points")}</span>
                  </div>
                )}
              </div>
           </div>

           <Link href="/profile">
             <Button variant="outlined" className="w-full justify-start">
               <span className="material-symbols-rounded mr-2" aria-hidden="true">person</span>
               {t("account")}
             </Button>
           </Link>

           <Button variant="text" className="w-full justify-start text-error" onClick={() => signOut()}>
             <span className="material-symbols-rounded mr-2" aria-hidden="true">logout</span>
             {t("logout")}
           </Button>
        </div>
      );
    }

    if (variant === "filled" || variant === "outlined") {
      return (
        <Link href="/profile">
          <Button variant={variant} className={className}>
            <span className="material-symbols-rounded mr-2" aria-hidden="true">person</span>
            {children || t("profile")}
          </Button>
        </Link>
      );
    }

    return (
      <div className={`relative group ${className}`}>
        <Link href="/profile">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name || "User"}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border border-outline-variant hover:border-primary transition-colors cursor-pointer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg cursor-pointer hover:opacity-80 transition-opacity">
              {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
            </div>
          )}
        </Link>
      </div>
    );
  }

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="text"
          size="icon"
          onClick={() => setIsModalOpen(true)}
          className={`rounded-full ${className}`}
          aria-label={t("login")}
        >
          <span className="material-symbols-rounded" aria-hidden="true">person</span>
        </Button>
      ) : (
        <Button
          variant={variant === "full" ? "filled" : variant}
          onClick={() => setIsModalOpen(true)}
          className={className}
        >
          {variant !== "outlined" && variant !== "filled" && <span className="material-symbols-rounded mr-2" aria-hidden="true">login</span>}
          {children || t("login")}
        </Button>
      )}

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

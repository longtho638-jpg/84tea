"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Snackbar } from "@/components/ui/snackbar";
import { useTranslations } from "next-intl";

interface PaymentData {
  checkoutUrl?: string;
  [key: string]: unknown;
}

interface PaymentButtonProps {
  amount: number;
  description: string;
  items: { name: string; quantity: number; price: number }[];
  returnUrl: string;
  cancelUrl: string;
  onSuccess?: (data: PaymentData) => void;
  onError?: (error: Error) => void;
  className?: string;
  disabled?: boolean;
}

export function PaymentButton({
  amount,
  description,
  items,
  returnUrl,
  cancelUrl,
  onSuccess,
  onError,
  className,
  disabled,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Checkout.Payment");
  const [snackbar, setSnackbar] = useState<{
    isVisible: boolean;
    message: string;
    variant: "default" | "error";
  }>({
    isVisible: false,
    message: "",
    variant: "default",
  });

  const showSnackbar = (message: string, variant: "default" | "error" = "default") => {
    setSnackbar({ isVisible: true, message, variant });
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isVisible: false }));
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/payment/create-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          description,
          items,
          returnUrl,
          cancelUrl,
        }),
      });

      const data: PaymentData = await response.json();

      if (!response.ok) {
        throw new Error((data as { error?: string }).error || "Failed to create payment link");
      }

      if (onSuccess) {
        onSuccess(data);
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("error");
      if (onError && error instanceof Error) {
        onError(error);
      }
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handlePayment}
        disabled={loading || disabled}
        className={className}
        variant="filled"
      >
        {loading ? t("processing") : t("pay", { amount: amount.toLocaleString("vi-VN") })}
      </Button>

      <Snackbar
        isVisible={snackbar.isVisible}
        message={snackbar.message}
        variant={snackbar.variant}
        onDismiss={hideSnackbar}
      />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { ProfileSetupForm } from "./profile-setup-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = "login" | "otp-sent" | "profile-setup";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithOtp, signInWithGoogle, isLoading, user, profile } = useAuth();
  const [step, setStep] = useState<AuthStep>("login");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // If user is already logged in but missing profile info, go to profile setup
      if (user && profile && (!profile.full_name || !profile.phone)) {
        setStep("profile-setup");
      } else if (user) {
        // User logged in and profile complete, shouldn't be here usually, close modal
        onClose();
      } else {
        setStep("login");
        setError(null);
      }
    }
  }, [isOpen, user, profile, onClose]);

  // Check for profile completion when user logs in while modal is open
  useEffect(() => {
    if (user && profile && isOpen) {
      if (!profile.full_name || !profile.phone) {
        setStep("profile-setup");
      } else if (step !== "profile-setup") {
        onClose();
      }
    }
  }, [user, profile, isOpen, step, onClose]);

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await signInWithOtp(email);
      if (error) {
        setError(error.message);
      } else {
        setStep("otp-sent");
      }
    } catch {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) setError(error.message);
    } catch {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case "otp-sent":
        return (
          <div className="flex flex-col items-center justify-center py-8 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center">
              <span className="material-symbols-rounded text-4xl text-primary">mail</span>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-primary">Kiểm tra Email của bạn</h3>
              <p className="text-on-surface-variant max-w-[280px] mx-auto">
                Chúng tôi đã gửi liên kết đăng nhập đến <span className="font-semibold text-on-surface">{email}</span>
              </p>
            </div>
            <div className="w-full space-y-3">
              <Button
                variant="outlined"
                className="w-full"
                onClick={() => window.open(`mailto:`, '_blank')}
              >
                Mở ứng dụng Email
              </Button>
              <Button
                variant="text"
                className="w-full"
                onClick={() => setStep("login")}
              >
                Quay lại đăng nhập
              </Button>
            </div>
          </div>
        );

      case "profile-setup":
        return (
          <ProfileSetupForm onComplete={onClose} />
        );

      case "login":
      default:
        return (
          <div className="grid gap-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Social Login */}
            <Button
              variant="outlined"
              onClick={handleGoogleLogin}
              disabled={isSubmitting || isLoading}
              className="w-full py-6 flex items-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-surface-container-high opacity-0 group-hover:opacity-10 transition-opacity" />
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-medium">Tiếp tục với Google</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-outline-variant" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-on-surface-variant font-medium">
                  Hoặc tiếp tục với Email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleOtpLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting || isLoading}
                  required
                  className="h-12"
                />
              </div>

              {error && (
                <div className="text-sm text-error bg-error-container p-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <span className="material-symbols-rounded text-lg">error</span>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="filled"
                disabled={isSubmitting || isLoading || !email}
                className="w-full h-12 text-base font-medium shadow-elevation-1 hover:shadow-elevation-2 transition-all"
              >
                {isSubmitting ? (
                  <span className="material-symbols-rounded animate-spin mr-2">progress_activity</span>
                ) : (
                  <span className="material-symbols-rounded mr-2">mail</span>
                )}
                Gửi liên kết đăng nhập
              </Button>
            </form>

            <p className="text-center text-xs text-on-surface-variant px-4 leading-relaxed">
              Bằng cách tiếp tục, bạn đồng ý với{" "}
              <a href="/terms" className="underline hover:text-primary font-medium">
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="/privacy" className="underline hover:text-primary font-medium">
                Chính sách bảo mật
              </a>{" "}
              của chúng tôi.
            </p>
          </div>
        );
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={step === "profile-setup" ? "Cập nhật thông tin" : "Đăng nhập / Đăng ký"}
      description={step === "profile-setup" ? "Hoàn tất hồ sơ của bạn" : "Tham gia cộng đồng 84tea"}
      className="sm:max-w-[400px]"
    >
      {renderContent()}
    </Dialog>
  );
}

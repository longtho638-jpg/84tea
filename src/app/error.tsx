'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking service (Sentry, etc.) in production
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-serif text-primary mb-4">
          Đã có lỗi xảy ra
        </h1>
        <p className="text-on-surface-variant mb-2">
          Chúng tôi đã ghi nhận sự cố và sẽ khắc phục sớm nhất.
        </p>
        {error.digest && (
          <p className="text-sm text-on-surface-variant/60 mb-8 font-mono">
            Mã lỗi: {error.digest}
          </p>
        )}
        <Button
          onClick={reset}
          className="bg-primary text-on-primary px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
        >
          Thử lại
        </Button>
      </div>
    </div>
  );
}

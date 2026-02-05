'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-6">
          <div className="max-w-md w-full bg-surface-container-high rounded-[28px] p-8 shadow-elevation-3">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="text-error text-6xl">⚠️</div>
              <h2 className="text-headline-medium font-semibold text-on-surface">
                Đã xảy ra lỗi
              </h2>
              <p className="text-body-medium text-on-surface-variant">
                {this.state.error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.'}
              </p>
              <Button
                onClick={this.resetErrorBoundary}
                variant="filled"
                className="mt-4"
              >
                Thử lại
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

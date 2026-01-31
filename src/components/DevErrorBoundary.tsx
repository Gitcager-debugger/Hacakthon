"use client";

import React from 'react';

type Props = { children: React.ReactNode };

class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    try {
      // best-effort reporting to server-side dev logger
      // try the preferred route first, fall back to underscore route if needed
      fetch('/api/dev/log-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: (error as Error)?.message || String(error),
          stack: (error as Error)?.stack || null,
          info,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        }),
      }).catch(() => {
        fetch('/api/_dev/log-client', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: (error as Error)?.message || String(error),
            stack: (error as Error)?.stack || null,
            info,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          }),
        }).catch((err) => console.error('Failed to report client error', err));
      });
    } catch (err) {
      // ignore
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary reporting failed', err);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">A client error occurred. Check dev logs for details.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function DevErrorBoundary({ children }: Props) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

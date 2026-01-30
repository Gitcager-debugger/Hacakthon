'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, _hasHydrated]);

  // Show loading while hydrating
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-50 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not authenticated after hydration
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

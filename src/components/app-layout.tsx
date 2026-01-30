'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BottomNavigation } from './bottom-navigation';

interface AppLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

export function AppLayout({ children, showNavigation = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className={cn('flex-1', showNavigation ? 'pb-20 md:pb-24' : '')}>
        {children}
      </main>
      {showNavigation && <BottomNavigation />}
    </div>
  );
}

'use client';

import { AppLayout } from '@/components/app-layout';
import { DailyCheckin } from '@/components/daily-checkin';
import { ProtectedRoute } from '@/components/protected-route';

export default function Home() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <DailyCheckin />
      </AppLayout>
    </ProtectedRoute>
  );
}

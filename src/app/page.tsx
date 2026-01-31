'use client';

import { AppLayout } from '@/components/app-layout';
import { DailyCheckin } from '@/components/daily-checkin';


export default function Home() {
  return (
    <AppLayout>
      <DailyCheckin />
    </AppLayout>
  );
}

'use client';

import { BreathingExercise } from '@/components/breathing-exercise';
import { ProtectedRoute } from '@/components/protected-route';

export default function BreathingPage() {
  return (
    <ProtectedRoute>
      <BreathingExercise />
    </ProtectedRoute>
  );
}

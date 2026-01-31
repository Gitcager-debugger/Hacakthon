import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


export async function GET(request: NextRequest) {
  try {
    // Get demo user
    let user = await db.user.findUnique({
      where: { email: 'demo@mindflow.app' },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    // Get check-ins for the specified period
    const checkIns = await db.checkIn.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (checkIns.length === 0) {
      return NextResponse.json(
        {
          insights: {
            avgMood: null,
            avgEnergy: null,
            avgSleep: null,
            moodTrend: null,
            correlations: [],
            burnoutRisk: 'low',
          },
        },
        { status: 200 }
      );
    }

    // Calculate averages
    const avgMood =
      checkIns.reduce((sum, c) => sum + c.mood, 0) / checkIns.length;
    const avgEnergy =
      checkIns.reduce((sum, c) => sum + c.energyLevel, 0) / checkIns.length;
    const checkInsWithSleep = checkIns.filter((c) => c.sleepHours !== null);
    const avgSleep =
      checkInsWithSleep.length > 0
        ? checkInsWithSleep.reduce((sum, c) => sum + (c.sleepHours || 0), 0) /
          checkInsWithSleep.length
        : null;

    // Calculate mood trend
    const recentCheckIns = checkIns.slice(-Math.min(7, checkIns.length));
    const moodTrend =
      recentCheckIns.length > 1
        ? (recentCheckIns[recentCheckIns.length - 1].mood - recentCheckIns[0].mood) /
          recentCheckIns.length
        : 0;

    // Calculate correlations
    const correlations: Array<{
      type: string;
      label: string;
      strength: string;
      direction: string;
      value: number;
      description: string;
    }> = [];

    // Sleep × Mood correlation
    if (checkInsWithSleep.length >= 2) {
      const sleepMoodCorrelation = calculateCorrelation(
        checkInsWithSleep.map((c) => c.sleepHours || 0),
        checkInsWithSleep.map((c) => c.mood)
      );

      correlations.push({
        type: 'sleep-mood',
        label: 'Sleep × Mood',
        strength: Math.abs(sleepMoodCorrelation) > 0.5 ? 'Strong' : Math.abs(sleepMoodCorrelation) > 0.3 ? 'Moderate' : 'Weak',
        direction: sleepMoodCorrelation > 0 ? 'Positive' : 'Negative',
        value: sleepMoodCorrelation,
        description:
          sleepMoodCorrelation > 0.3
            ? 'More sleep = better mood days'
            : sleepMoodCorrelation < -0.3
            ? 'Less sleep = lower mood days'
            : 'No strong correlation found',
      });
    }

    // Calculate burnout risk
    const recentMoods = checkIns.slice(-7).map((c) => c.mood);
    const lowMoodDays = recentMoods.filter((m) => m <= 2).length;
    const burnoutRisk =
      lowMoodDays >= 3 ? 'high' : lowMoodDays >= 2 ? 'medium' : 'low';

    return NextResponse.json(
      {
        insights: {
          avgMood: parseFloat(avgMood.toFixed(2)),
          avgEnergy: parseFloat(avgEnergy.toFixed(2)),
          avgSleep: avgSleep ? parseFloat(avgSleep.toFixed(2)) : null,
          moodTrend: parseFloat(moodTrend.toFixed(2)),
          correlations,
          burnoutRisk,
          totalCheckIns: checkIns.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Insights error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate Pearson correlation coefficient
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

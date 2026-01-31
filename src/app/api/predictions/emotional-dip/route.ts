import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface PredictionResult {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  predictedDipDate: string | null;
  factors: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  recommendations: string[];
  aiInsight: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get demo user
    let user = await db.user.findUnique({
      where: { email: 'demo@mindflow.app' },
    });

    if (!user) {
      // Create demo user if missing so predictions can run for demo
      user = await db.user.create({
        data: {
          email: 'demo@mindflow.app',
          name: 'Demo User',
          hashedPassword: 'demo',
        },
      });
    }

    // Get recent check-ins for the user (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const checkIns = await db.checkIn.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (checkIns.length < 5) {
      // Not enough data for AI prediction
      return NextResponse.json({
        riskLevel: 'low' as const,
        confidence: 0.2,
        predictedDipDate: null,
        factors: [
          {
            factor: 'Data Availability',
            impact: 'neutral' as const,
            description: 'Continue logging daily check-ins for better predictions',
          },
        ],
        recommendations: [
          'Complete daily check-ins for at least 7 days',
          'Track sleep patterns and mood consistently',
          'Add journal notes to improve prediction accuracy',
        ],
        aiInsight: 'More data needed for accurate predictions. Keep tracking!',
      });
    }

    // Analyze patterns from check-ins
    const analysis = analyzePatterns(checkIns);

    // Use rule-based prediction instead of AI
    const prediction = generateRuleBasedPrediction(analysis);
    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Prediction error:', error);
    const body =
      process.env.NODE_ENV === 'development'
        ? { error: 'Internal server error', message: (error as Error)?.message, stack: (error as Error)?.stack }
        : { error: 'Internal server error' };
    return NextResponse.json(body, { status: 500 });
  }
}

function analyzePatterns(checkIns: any[]) {
  const moods = checkIns.map(c => c.mood);
  const avgMood = moods.reduce((a, b) => a + b, 0) / moods.length;
  const moodTrend = calculateTrend(moods);

  const sleepHours = checkIns.filter(c => c.sleepHours !== null).map(c => c.sleepHours);
  const avgSleep = sleepHours.length > 0 
    ? sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length 
    : 7;

  const energyLevels = checkIns.map(c => c.energyLevel);
  const avgEnergy = energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length;

  // Count low mood days
  const lowMoodDays = checkIns.filter(c => c.mood <= 2).length;
  const lowMoodRatio = lowMoodDays / checkIns.length;

  // Identify recent trend
  const recentCheckIns = checkIns.slice(-7);
  const recentAvgMood = recentCheckIns.map(c => c.mood).reduce((a, b) => a + b, 0) / recentCheckIns.length;

  // Find patterns by day of week
  const dayMoods: { [key: number]: number[] } = {};
  checkIns.forEach(checkIn => {
    const day = new Date(checkIn.createdAt).getDay();
    if (!dayMoods[day]) dayMoods[day] = [];
    dayMoods[day].push(checkIn.mood);
  });

  const worstDay = Object.entries(dayMoods)
    .map(([day, moods]) => ({
      day: parseInt(day),
      avgMood: moods.reduce((a, b) => a + b, 0) / moods.length,
    }))
    .sort((a, b) => a.avgMood - b.avgMood)[0];

  return {
    avgMood,
    moodTrend,
    avgSleep,
    avgEnergy,
    lowMoodRatio,
    recentAvgMood,
    totalCheckIns: checkIns.length,
    worstDay: worstDay?.day,
    worstDayAvg: worstDay?.avgMood,
  };
}

function calculateTrend(values: number[]): 'improving' | 'declining' | 'stable' {
  if (values.length < 3) return 'stable';

  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));

  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  if (secondAvg > firstAvg + 0.5) return 'improving';
  if (secondAvg < firstAvg - 0.5) return 'declining';
  return 'stable';
}

function buildAnalysisPrompt(analysis: any) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  return `Analyze this emotional wellness data and provide insights:

Key Metrics:
- Average Mood: ${analysis.avgMood.toFixed(2)}/5
- Mood Trend: ${analysis.moodTrend}
- Average Sleep: ${analysis.avgSleep.toFixed(1)} hours
- Average Energy: ${analysis.avgEnergy.toFixed(2)}/5
- Low Mood Days: ${(analysis.lowMoodRatio * 100).toFixed(0)}% of days logged
- Recent Average Mood: ${analysis.recentAvgMood.toFixed(2)}/5
- Worst Day: ${dayNames[analysis.worstDay || 0]} (avg: ${analysis.worstDayAvg?.toFixed(2)}/5)

Provide:
1. A gentle, supportive insight about their patterns
2. 2-3 personalized recommendations
3. Any patterns you notice

Keep it brief and encouraging. Do not make medical diagnoses.`;
}

function generatePrediction(analysis: any, aiInsight: string): PredictionResult {
  // Calculate risk level based on multiple factors
  let riskScore = 0;

  // Low mood ratio (high impact)
  riskScore += analysis.lowMoodRatio * 40;

  // Recent mood decline
  if (analysis.moodTrend === 'declining') riskScore += 20;
  if (analysis.recentAvgMood < analysis.avgMood - 0.5) riskScore += 15;

  // Low sleep
  if (analysis.avgSleep < 6) riskScore += 15;

  // Low energy
  if (analysis.avgEnergy < 2.5) riskScore += 10;

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high';
  if (riskScore >= 50) {
    riskLevel = 'high';
  } else if (riskScore >= 25) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  // Generate factors
  const factors: Array<{
    factor: string;
    impact: 'positive' | 'negative';
    description: string;
  }> = [];
  
  if (analysis.lowMoodRatio > 0.3) {
    factors.push({
      factor: 'Mood Patterns',
      impact: 'negative' as const,
      description: `${(analysis.lowMoodRatio * 100).toFixed(0)}% of days logged were low mood`,
    });
  }

  if (analysis.moodTrend === 'declining') {
    factors.push({
      factor: 'Mood Trend',
      impact: 'negative' as const,
      description: 'Mood has been declining recently',
    });
  } else if (analysis.moodTrend === 'improving') {
    factors.push({
      factor: 'Mood Trend',
      impact: 'positive' as const,
      description: 'Mood has been improving - great progress!',
    });
  }

  if (analysis.avgSleep < 6) {
    factors.push({
      factor: 'Sleep',
      impact: 'negative' as const,
      description: `Average sleep is ${analysis.avgSleep.toFixed(1)} hours`,
    });
  } else if (analysis.avgSleep >= 7) {
    factors.push({
      factor: 'Sleep',
      impact: 'positive' as const,
      description: 'Good sleep habits - maintain this!',
    });
  }

  if (analysis.avgEnergy < 2.5) {
    factors.push({
      factor: 'Energy Levels',
      impact: 'negative' as const,
      description: 'Energy levels have been below average',
    });
  }

  // Predict next potential dip day (worst day of week)
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const worstDay = analysis.worstDay !== undefined ? analysis.worstDay : today.getDay();
  
  let predictedDipDate: string | null = null;
  if (riskLevel !== 'low' && worstDay !== today.getDay()) {
    const daysUntil = (worstDay - today.getDay() + 7) % 7 || 7;
    const dipDate = new Date(today);
    dipDate.setDate(dipDate.getDate() + daysUntil);
    predictedDipDate = dipDate.toISOString().split('T')[0];
  }

  return {
    riskLevel,
    confidence: Math.min(0.3 + (analysis.totalCheckIns * 0.05), 0.95),
    predictedDipDate,
    factors,
    recommendations: [
      'Maintain a consistent sleep schedule',
      'Continue daily check-ins for better predictions',
      'Consider trying calm tools when feeling low',
    ],
    aiInsight,
  };
}

function generateRuleBasedPrediction(analysis: any): PredictionResult {
  const prediction = generatePrediction(analysis, 'Keep tracking your mood patterns. With more data, our AI will provide personalized insights.');
  return {
    ...prediction,
    aiInsight: prediction.aiInsight + ' AI insights will improve as you log more check-ins.',
  };
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictionData {
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

export function EmotionalDipPredictor() {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPrediction = async () => {
    try {
      // Fetch check-in data first to analyze patterns
      const checkInsResponse = await fetch('/api/checkins?days=30');
      if (!checkInsResponse.ok) {
        throw new Error('Failed to fetch check-in data');
      }
      
      const checkInsData = await checkInsResponse.json();
      const checkIns = checkInsData.checkIns;

      if (checkIns.length < 5) {
        setError('Need at least 5 check-ins for predictions');
        setLoading(false);
        return;
      }

      // Simple rule-based prediction (can be enhanced with AI later)
      const analyzePatterns = () => {
        const moods = checkIns.map((c: any) => c.mood);
        const energies = checkIns.map((c: any) => c.energyLevel);
        const sleepHours = checkIns.map((c: any) => c.sleepHours).filter(Boolean);
        
        // Calculate averages
        const avgMood = moods.reduce((a: number, b: number) => a + b, 0) / moods.length;
        const avgEnergy = energies.reduce((a: number, b: number) => a + b, 0) / energies.length;
        const avgSleep = sleepHours.length > 0 
          ? sleepHours.reduce((a: number, b: number) => a + b, 0) / sleepHours.length 
          : 0;
        
        // Calculate recent trend (last 5 vs previous 5)
        const recentMoods = moods.slice(0, Math.min(5, moods.length));
        const olderMoods = moods.slice(Math.min(5, moods.length), Math.min(10, moods.length));
        const moodTrend = recentMoods.length > 0 && olderMoods.length > 0
          ? (recentMoods.reduce((a: number, b: number) => a + b, 0) / recentMoods.length) - 
            (olderMoods.reduce((a: number, b: number) => a + b, 0) / olderMoods.length)
          : 0;
        
        // Risk calculation
        let riskScore = 0;
        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        
        // Low mood factor (40% weight)
        if (avgMood < 2.5) riskScore += 40;
        else if (avgMood < 3.5) riskScore += 20;
        
        // Mood trend factor (20% weight)
        if (moodTrend < -0.5) riskScore += 20;
        else if (moodTrend < 0) riskScore += 10;
        
        // Sleep factor (15% weight)
        if (avgSleep < 6) riskScore += 15;
        else if (avgSleep < 7) riskScore += 7;
        
        // Energy factor (10% weight)
        if (avgEnergy < 2.5) riskScore += 10;
        else if (avgEnergy < 3.5) riskScore += 5;
        
        // Determine risk level
        if (riskScore >= 50) riskLevel = 'high';
        else if (riskScore >= 25) riskLevel = 'medium';
        
        // Simple prediction of next challenging day
        const dayOfWeekPatterns: Record<number, number> = {};
        checkIns.forEach((checkIn: any) => {
          const day = new Date(checkIn.createdAt).getDay();
          if (!dayOfWeekPatterns[day]) dayOfWeekPatterns[day] = 0;
          if (checkIn.mood <= 2) dayOfWeekPatterns[day] += 1;
        });
        
        let predictedDipDate: string | null = null;
        if (riskLevel !== 'low' && Object.keys(dayOfWeekPatterns).length > 0) {
          const worstDay = Object.entries(dayOfWeekPatterns)
            .sort(([,a], [,b]) => b - a)[0][0];
          const nextWorstDay = new Date();
          const currentDay = nextWorstDay.getDay();
          const daysUntil = (parseInt(worstDay) + 7 - currentDay) % 7 || 7;
          nextWorstDay.setDate(nextWorstDay.getDate() + daysUntil);
          predictedDipDate = nextWorstDay.toISOString().split('T')[0];
        }
        
        // Generate simple AI-like insights
        const generateInsight = () => {
          if (riskLevel === 'high') {
            return "You've been experiencing some challenging days recently. Remember that difficult periods are temporary and you're taking positive steps by tracking your wellbeing. Consider reaching out to someone you trust or trying some calming activities.";
          } else if (riskLevel === 'medium') {
            return "Your mood patterns show some ups and downs, which is completely normal. You're doing well to stay aware of your emotional state. Keep up the daily check-ins to maintain this self-awareness.";
          } else {
            return "Great job maintaining your emotional wellbeing! Your consistent check-ins show strong self-awareness. Keep up the positive habits that are working well for you.";
          }
        };
        
        const data = {
          riskLevel,
          confidence: Math.min(0.3 + (checkIns.length * 0.05), 0.95),
          predictedDipDate,
          factors: [
            {
              factor: 'Mood Patterns',
              impact: moodTrend < 0 ? 'negative' : 'positive',
              description: `Average mood: ${avgMood.toFixed(1)}/5`
            },
            {
              factor: 'Sleep Quality',
              impact: avgSleep < 6 ? 'negative' : 'positive',
              description: `Average sleep: ${avgSleep.toFixed(1)} hours`
            }
          ],
          recommendations: [
            'Continue daily check-ins for better insights',
            'Maintain consistent sleep schedule',
            'Try calm tools when feeling stressed',
            'Reach out to friends when needed'
          ],
          aiInsight: generateInsight()
        };
        
        return data;
      };

      const predictionData = analyzePatterns();
      setPrediction(predictionData as PredictionData);
      setError(null);
    } catch (err) {
      console.error('Prediction analysis error:', err);
      setError('Unable to analyze your data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPrediction();
  };

  const getRiskConfig = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: AlertTriangle,
          label: 'High Risk',
          description: 'Pay extra attention to your wellbeing this week',
        };
      case 'medium':
        return {
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          icon: AlertCircle,
          label: 'Medium Risk',
          description: 'Consider taking some time for yourself',
        };
      default:
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle2,
          label: 'Low Risk',
          description: 'You\'re doing great! Keep it up',
        };
    }
  };

  if (loading) {
    return (
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Emotional Dip Predictor
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Emotional Dip Predictor
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) return null;

  const riskConfig = getRiskConfig(prediction.riskLevel);
  const RiskIcon = riskConfig.icon;

  return (
    <Card className="border-2 shadow-sm overflow-hidden">
      <CardHeader className={cn('border-b', riskConfig.bgColor)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Emotional Dip Predictor
            <Sparkles className="w-4 h-4 text-purple-500" />
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {Math.round(prediction.confidence * 100)}% confidence
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Risk Level Indicator */}
        <div className={cn('border-2 rounded-xl p-4', riskConfig.borderColor, riskConfig.bgColor)}>
          <div className="flex items-start gap-3">
            <div className={cn('p-2 rounded-lg bg-white shadow-sm', riskConfig.color)}>
              <RiskIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={cn('font-semibold', riskConfig.color)}>
                  {riskConfig.label}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {riskConfig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Predicted Dip Date */}
        {prediction.predictedDipDate && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Potential challenging day</p>
              <p className="font-medium text-foreground">
                {new Date(prediction.predictedDipDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}

        {/* AI Insight */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-purple-900 mb-1">AI Insight</h4>
              <p className="text-sm text-purple-800 leading-relaxed">
                {prediction.aiInsight}
              </p>
            </div>
          </div>
        </div>

        {/* Factors */}
        {prediction.factors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              Contributing Factors
            </h4>
            <div className="space-y-2">
              {prediction.factors.map((factor, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border',
                    factor.impact === 'positive' && 'bg-green-50 border-green-200',
                    factor.impact === 'negative' && 'bg-red-50 border-red-200',
                    factor.impact === 'neutral' && 'bg-gray-50 border-gray-200'
                  )}
                >
                  {factor.impact === 'positive' ? (
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : factor.impact === 'negative' ? (
                    <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {factor.factor}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {factor.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {prediction.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              Personalized Recommendations
            </h4>
            <div className="space-y-2">
              {prediction.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => (window.location.href = '/calm')}
          >
            Try Calm Tools
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => (window.location.href = '/')}
          >
            Log Check-in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

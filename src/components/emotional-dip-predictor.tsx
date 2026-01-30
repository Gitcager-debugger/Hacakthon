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
      const token = localStorage.getItem('mindflow-auth-storage');
      const authData = token ? JSON.parse(token) : null;
      const authToken = authData?.state?.token;

      if (!authToken) {
        setError('Please log in to see predictions');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/predictions/emotional-dip', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      setPrediction(data);
      setError(null);
    } catch (err) {
      console.error('Prediction fetch error:', err);
      setError('Unable to load prediction. Please try again.');
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

'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart } from '@/components/mood-trend-chart';
import { EmotionalDipPredictor } from '@/components/emotional-dip-predictor';
import { TrendingUp, TrendingDown, Moon, Zap, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProtectedRoute } from '@/components/protected-route';

const timePeriods = [
  { value: '7D', label: '7 Days' },
  { value: '30D', label: '30 Days' },
  { value: '90D', label: '90 Days' },
];

export default function InsightsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7D');

  return (
    <ProtectedRoute>
      <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white pb-6">
        {/* Header */}
        <div className="bg-white border-b border-border p-6">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              Your Insights
            </h1>
            <div className="flex gap-2">
              {timePeriods.map((period) => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.value)}
                  className={cn(
                    'flex-1',
                    selectedPeriod === period.value
                      ? 'bg-primary text-primary-foreground'
                      : ''
                  )}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 space-y-4 mt-4">
          {/* Mood Trend Chart */}
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Mood Trend</CardTitle>
                <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">Trending up</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <LineChart />
            </CardContent>
          </Card>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon="😊"
              value="4.2"
              label="Avg Mood"
              trend="+0.3"
              trendUp
            />
            <StatCard
              icon={<Moon className="w-4 h-4 text-blue-500" />}
              value="6.8h"
              label="Avg Sleep"
              trend="+0.5h"
              trendUp
            />
            <StatCard
              icon={<Zap className="w-4 h-4 text-energy-high" />}
              value="3.5"
              label="Avg Energy"
              trend="+0.2"
              trendUp
            />
          </div>

          {/* AI Emotional Dip Predictor */}
          <EmotionalDipPredictor />

          {/* Correlations Section */}
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">What Affects Your Mood?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CorrelationCard
                label="Sleep × Mood"
                strength="Strong Positive"
                description="More sleep = better mood days"
                color="green"
              />
              <CorrelationCard
                label="Social Battery × Energy"
                strength="Moderate"
                description="Balanced social time maintains energy"
                color="blue"
              />
              <CorrelationCard
                label="Journal × Mood"
                strength="Weak"
                description="Journaling may help track patterns"
                color="amber"
              />
            </CardContent>
          </Card>

          {/* Burnout Risk Indicator */}
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-battery-medium" />
                Burnout Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-500"
                    style={{ width: '35%' }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="text-sm font-medium text-foreground">
                      Medium Risk
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">35%</span>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-900">
                    💡 Consider taking some time for yourself this week. Your mood has been slightly lower recently.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                This Week's Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <HighlightItem
                type="success"
                icon={CheckCircle2}
                title="Best Day"
                description="Friday with a Great mood rating"
              />
              <HighlightItem
                type="insight"
                icon={TrendingUp}
                title="Pattern Found"
                description="You tend to feel better on days with 7+ hours of sleep"
              />
              <HighlightItem
                type="suggestion"
                icon={Moon}
                title="Recommendation"
                description="Try to maintain a consistent sleep schedule"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
    </ProtectedRoute>
  );
}

interface StatCardProps {
  icon: string | React.ReactNode;
  value: string;
  label: string;
  trend: string;
  trendUp: boolean;
}

function StatCard({ icon, value, label, trend, trendUp }: StatCardProps) {
  return (
    <Card className="border-2 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          {typeof icon === 'string' ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            <div className="p-2 bg-muted rounded-lg">{icon}</div>
          )}
        </div>
        <div className="text-xl font-bold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
        <div
          className={cn(
            'text-xs font-medium mt-1 flex items-center gap-1',
            trendUp ? 'text-green-600' : 'text-red-600'
          )}
        >
          {trendUp ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}

interface CorrelationCardProps {
  label: string;
  strength: string;
  description: string;
  color: 'green' | 'blue' | 'amber';
}

function CorrelationCard({ label, strength, description, color }: CorrelationCardProps) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
  };

  const strengthColor = {
    green: 'text-green-700',
    blue: 'text-blue-700',
    amber: 'text-amber-700',
  };

  return (
    <div className={cn('border-2 rounded-lg p-4', colorClasses[color])}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-foreground">{label}</h3>
        <span className={cn('text-xs font-medium', strengthColor[color])}>
          {strength}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

interface HighlightItemProps {
  type: 'success' | 'insight' | 'suggestion';
  icon: React.ElementType;
  title: string;
  description: string;
}

function HighlightItem({ type, icon: Icon, title, description }: HighlightItemProps) {
  const typeConfig = {
    success: { bg: 'bg-green-50', icon: 'text-green-600' },
    insight: { bg: 'bg-blue-50', icon: 'text-blue-600' },
    suggestion: { bg: 'bg-amber-50', icon: 'text-amber-600' },
  };

  const config = typeConfig[type];

  return (
    <div className={cn('flex items-start gap-3 p-3 rounded-lg border', config.bg)}>
      <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', config.icon)} />
      <div>
        <h4 className="font-medium text-foreground text-sm">{title}</h4>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Wind, PenTool, Heart, Clock } from 'lucide-react';
import { ProtectedRoute } from '@/components/protected-route';

const calmTools = [
  {
    name: 'Breathing Exercise',
    description: '4-7-8 technique to calm your mind',
    icon: Wind,
    href: '/calm/breathing',
    featured: true,
  },
  {
    name: '5-4-3-2-1 Grounding',
    description: 'Quick technique to reduce anxiety',
    icon: Sparkles,
    href: '/calm/grounding',
    featured: false,
  },
  {
    name: 'Quick Journal',
    description: 'Express your thoughts',
    icon: PenTool,
    href: '/calm/journal',
    featured: false,
  },
  {
    name: 'Affirmations',
    description: 'Positive reminders',
    icon: Heart,
    href: '/calm/affirmations',
    featured: false,
  },
];

const recentTools = [
  { name: 'Breathing', time: '2 hours ago', icon: Wind },
  { name: 'Grounding', time: 'Yesterday', icon: Sparkles },
  { name: 'Journal', time: '2 days ago', icon: PenTool },
];

export default function CalmPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white pb-6">
        {/* Header */}
        <div className="bg-white border-b border-border p-6">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-semibold text-foreground">
              Find Your Calm
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Feeling overwhelmed? Try these tools
            </p>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 space-y-4 mt-4">
          {/* Featured Tool */}
          <Card className="border-2 shadow-md overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Wind className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    Breathing Exercise
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    4-7-8 technique • 3 minutes
                  </p>
                  <Button
                    onClick={() => (window.location.href = '/calm/breathing')}
                    className="w-full h-12 shadow-md shadow-primary/20"
                  >
                    Start Exercise
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tool Grid */}
          <div className="grid grid-cols-2 gap-3">
            {calmTools.slice(1).map((tool) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.href}
                  className="border-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => (window.location.href = tool.href)}
                >
                  <CardContent className="p-4">
                    <div className="p-3 bg-muted rounded-xl mb-3 w-fit">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent History */}
          <Card className="border-2 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Recent Tools
              </h2>
              <div className="space-y-3">
                {recentTools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                          {tool.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{tool.time}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
    </ProtectedRoute>
  );
}

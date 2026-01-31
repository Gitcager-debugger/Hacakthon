'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AffirmationsPage() {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const { toast } = useToast();

  const affirmations = [
    "I am worthy of love and respect exactly as I am",
    "I have the strength to handle whatever comes my way",
    "I choose peace over worry in this moment",
    "I am enough, just as I am right now",
    "My feelings are valid and important",
    "I deserve to take care of myself today",
    "I am growing and learning every single day",
    "I can trust myself to make good decisions",
    "I am safe in this present moment",
    "I am allowed to rest and recharge"
  ];

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
  };

  const speakAffirmation = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(affirmations[currentAffirmation]);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: 'Speech not supported',
        description: 'Your browser doesn\'t support text-to-speech',
        variant: 'destructive',
      });
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white pb-6">
        {/* Header */}
        <div className="bg-white border-b border-border p-6">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Positive Affirmations
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gentle reminders to boost your wellbeing
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 space-y-4 mt-4">
          {/* Main Affirmation Card */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">
                Daily Affirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-muted/50 rounded-2xl p-6 min-h-[120px] flex items-center justify-center">
                <p className="text-lg font-medium text-foreground text-center">
                  "{affirmations[currentAffirmation]}"
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={speakAffirmation}
                  variant="outline"
                  className="flex-1 h-12"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  Speak
                </Button>
                <Button 
                  onClick={nextAffirmation}
                  className="flex-1 h-12"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Affirmation List */}
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">All Affirmations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {affirmations.map((affirmation, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    index === currentAffirmation 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setCurrentAffirmation(index)}
                >
                  <p className="text-sm text-foreground">"{affirmation}"</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">How Affirmations Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Reduce negative self-talk</span> - Replace critical thoughts with positive ones
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Build self-confidence</span> - Reinforce your worth and capabilities
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Improve mood</span> - Shift focus from problems to positive possibilities
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Tips for Best Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Say affirmations out loud for maximum impact</p>
              <p>• Choose affirmations that feel authentic to you</p>
              <p>• Repeat daily, especially during difficult moments</p>
              <p>• Believe in what you're saying, even if it feels uncomfortable at first</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
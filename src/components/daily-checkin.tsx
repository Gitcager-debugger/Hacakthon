'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Flame, Battery, Zap, Moon, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const moodOptions = [
  { value: 5, emoji: '😊', label: 'Great', color: 'bg-mood-great' },
  { value: 4, emoji: '🙂', label: 'Good', color: 'bg-mood-good' },
  { value: 3, emoji: '😐', label: 'Okay', color: 'bg-mood-okay' },
  { value: 2, emoji: '😔', label: 'Low', color: 'bg-mood-low' },
  { value: 1, emoji: '😢', label: 'Very Low', color: 'bg-mood-veryLow' },
];

const energyLabels = ['Drained', 'Low', 'Medium', 'High', 'Energized'];

const socialBatteryLevels = [
  { value: 'full', icon: Battery, label: 'Full', color: 'text-battery-full' },
  { value: 'half', icon: Battery, label: 'Half', color: 'text-battery-half' },
  { value: 'empty', icon: Battery, label: 'Empty', color: 'text-battery-empty' },
];

export function DailyCheckin() {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [sleepExpanded, setSleepExpanded] = useState(false);
  const [socialBattery, setSocialBattery] = useState<string | null>(null);
  const [journalNote, setJournalNote] = useState('');
  const [journalExpanded, setJournalExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: 'Please select your mood',
        description: 'How are you feeling today?',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          energyLevel,
          sleepHours,
          socialBattery,
          journalNote,
        }),
      });

      if (!response.ok) throw new Error('Failed to save check-in');

      toast({
        title: 'Check-in logged! 🎉',
        description: 'See you tomorrow!',
        variant: 'default',
      });

      // Reset form
      setSelectedMood(null);
      setEnergyLevel(3);
      setSleepHours(7);
      setSocialBattery(null);
      setJournalNote('');
      setSleepExpanded(false);
      setJournalExpanded(false);
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white pb-6">
      {/* Header */}
      <div className="bg-white border-b border-border p-6 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {getGreeting()} 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{today}</p>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-orange-600">7 day streak</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-2 space-y-4">
        {/* Mood Selector */}
        <Card className="border-2 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">How are you feeling?</h2>
            <div className="flex justify-between gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 flex-1',
                    selectedMood === mood.value
                      ? 'bg-primary/10 scale-110 ring-2 ring-primary ring-offset-2'
                      : 'hover:bg-muted'
                  )}
                >
                  <span
                    className={cn(
                      'text-3xl transition-transform duration-200',
                      selectedMood === mood.value ? 'scale-125' : ''
                    )}
                  >
                    {mood.emoji}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      selectedMood === mood.value ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Energy Level */}
        <Card className="border-2 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-energy-high" />
              <h2 className="text-lg font-medium">Energy Level</h2>
            </div>
            <div className="space-y-4">
              <Slider
                value={[energyLevel]}
                onValueChange={(value) => setEnergyLevel(value[0])}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-sm font-medium text-primary">
                  {energyLabels[energyLevel - 1]}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Section */}
        <Card className="border-2 shadow-sm">
          <button
            onClick={() => setSleepExpanded(!sleepExpanded)}
            className="w-full p-6 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-500" />
              <div>
                <h2 className="text-lg font-medium">Sleep</h2>
                <p className="text-sm text-muted-foreground">
                  {sleepHours} hours last night
                </p>
              </div>
            </div>
            {sleepExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {sleepExpanded && (
            <CardContent className="px-6 pb-6 pt-0">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Hours slept
                  </label>
                  <Slider
                    value={[sleepHours]}
                    onValueChange={(value) => setSleepHours(value[0])}
                    min={0}
                    max={12}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="text-center mt-2">
                    <span className="text-2xl font-bold text-primary">{sleepHours}h</span>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Social Battery */}
        <Card className="border-2 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">Social Battery</h2>
            <div className="flex justify-between gap-2">
              {socialBatteryLevels.map((level) => {
                const Icon = level.icon;
                return (
                  <button
                    key={level.value}
                    onClick={() => setSocialBattery(level.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 flex-1 border-2',
                      socialBattery === level.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-6 h-6 transition-all duration-200',
                        level.color,
                        socialBattery === level.value ? 'scale-110' : ''
                      )}
                    />
                    <span className="text-xs font-medium text-foreground">
                      {level.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Micro Journal */}
        <Card className="border-2 shadow-sm">
          <button
            onClick={() => setJournalExpanded(!journalExpanded)}
            className="w-full p-6 flex items-center justify-between text-left"
          >
            <div>
              <h2 className="text-lg font-medium">Quick Journal</h2>
              <p className="text-sm text-muted-foreground">
                {journalNote ? `${journalNote.length}/140 chars` : 'Optional - skip if you want'}
              </p>
            </div>
            {journalExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {journalExpanded && (
            <CardContent className="px-6 pb-6 pt-0">
              <Textarea
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value.slice(0, 140))}
                placeholder="What's on your mind?"
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {journalNote.length}/140
              </p>
            </CardContent>
          )}
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!selectedMood || isSubmitting}
          className="w-full h-14 text-base font-semibold shadow-lg shadow-primary/25"
          size="lg"
        >
          {isSubmitting ? 'Saving...' : 'Log Today\'s Check-in'}
        </Button>

        {/* Calm Tools Shortcut */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Need a moment of calm?
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = '/calm')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Try Calm Tools
          </Button>
        </div>
      </div>
    </div>
  );
}

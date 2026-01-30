'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, X, Smile, Meh, Frown } from 'lucide-react';
import { cn } from '@/lib/utils';

type Phase = 'inhale' | 'hold' | 'exhale';
type Duration = 1 | 3 | 5;

const phaseConfig = {
  inhale: { duration: 4000, label: 'Breathe In', color: 'bg-emerald-500' },
  hold: { duration: 7000, label: 'Hold', color: 'bg-teal-500' },
  exhale: { duration: 8000, label: 'Breathe Out', color: 'bg-blue-500' },
};

const durationOptions: { value: Duration; label: string }[] = [
  { value: 1, label: '1 min' },
  { value: 3, label: '3 min' },
  { value: 5, label: '5 min' },
];

export function BreathingExercise() {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [timeInPhase, setTimeInPhase] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<Duration>(3);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  const phaseDuration = phaseConfig[phase].duration;

  // Breathing animation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !completed) {
      interval = setInterval(() => {
        setTimeInPhase((prev) => {
          const newTime = prev + 100;

          if (newTime >= phaseDuration) {
            // Move to next phase
            setPhase((currentPhase) => {
              switch (currentPhase) {
                case 'inhale':
                  return 'hold';
                case 'hold':
                  return 'exhale';
                case 'exhale':
                  return 'inhale';
                default:
                  return 'inhale';
              }
            });
            return 0;
          }

          return newTime;
        });

        setElapsedTime((prev) => {
          const newTime = prev + 100;
          const totalTime = selectedDuration * 60 * 1000;

          if (newTime >= totalTime) {
            setIsRunning(false);
            setCompleted(true);
            return totalTime;
          }

          return newTime;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, completed, phaseDuration, selectedDuration]);

  const getCircleScale = useCallback(() => {
    const progress = timeInPhase / phaseDuration;

    if (phase === 'inhale') {
      // Expand from 0.6 to 1.2
      return 0.6 + progress * 0.6;
    } else if (phase === 'hold') {
      // Stay at 1.2
      return 1.2;
    } else {
      // Contract from 1.2 to 0.6
      return 1.2 - progress * 0.6;
    }
  }, [phase, timeInPhase, phaseDuration]);

  const getCircleColor = useCallback(() => {
    return phaseConfig[phase].color;
  }, [phase]);

  const handleStart = () => {
    setIsRunning(true);
    setCompleted(false);
    setRating(null);
    setElapsedTime(0);
    setTimeInPhase(0);
    setPhase('inhale');
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCompleted(false);
    setRating(null);
    setElapsedTime(0);
    setTimeInPhase(0);
    setPhase('inhale');
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = elapsedTime / (selectedDuration * 60 * 1000);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Breathing Exercise</h2>
            <p className="text-sm text-muted-foreground mt-1">4-7-8 Technique</p>
          </div>
          {!completed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.href = '/calm'}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {!completed ? (
          <>
            {/* Duration Selector */}
            {!isRunning && elapsedTime === 0 && (
              <Card className="border-2 shadow-sm mb-6">
                <div className="p-4">
                  <p className="text-sm font-medium text-foreground mb-3">
                    Choose duration:
                  </p>
                  <div className="flex gap-2">
                    {durationOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={selectedDuration === option.value ? 'default' : 'outline'}
                        onClick={() => setSelectedDuration(option.value)}
                        className="flex-1"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">
                  {formatTime(elapsedTime)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {selectedDuration}:00
                </span>
              </div>
            </div>

            {/* Breathing Circle */}
            <div className="flex justify-center items-center mb-8 min-h-[350px]">
              <div className="relative">
                {/* Outer glow */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-full opacity-20 blur-xl transition-all duration-1000 ease-in-out',
                    getCircleColor()
                  )}
                  style={{
                    transform: `scale(${getCircleScale() * 1.2})`,
                  }}
                />
                {/* Main circle */}
                <div
                  className={cn(
                    'rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out shadow-lg',
                    getCircleColor()
                  )}
                  style={{
                    width: `${getCircleScale() * 250}px`,
                    height: `${getCircleScale() * 250}px`,
                  }}
                >
                  <div className="text-center text-white">
                    <p className="text-2xl font-bold mb-1">
                      {phaseConfig[phase].label}
                    </p>
                    <p className="text-sm opacity-90">
                      {Math.ceil((phaseDuration - timeInPhase) / 1000)}s
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <Card className="border-2 shadow-sm mb-6">
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {phase === 'inhale' && 'Breathe in slowly through your nose...'}
                  {phase === 'hold' && 'Hold your breath gently...'}
                  {phase === 'exhale' && 'Exhale completely through your mouth...'}
                </p>
              </div>
            </Card>

            {/* Controls */}
            <div className="flex justify-center gap-3">
              {!isRunning && elapsedTime === 0 ? (
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="w-full h-14 text-base font-semibold shadow-lg shadow-primary/25"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </Button>
              ) : !isRunning ? (
                <>
                  <Button
                    onClick={handleStart}
                    size="lg"
                    className="flex-1 h-14"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Resume
                  </Button>
                  <Button
                    onClick={handleReset}
                    size="lg"
                    variant="outline"
                    className="flex-1 h-14"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handlePause}
                  size="lg"
                  variant="outline"
                  className="w-full h-14"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
            </div>
          </>
        ) : (
          /* Completion Screen */
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="text-6xl">✨</span>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Great job!
              </h2>
              <p className="text-muted-foreground">
                You completed {selectedDuration} minute{selectedDuration > 1 ? 's' : ''} of breathing
              </p>
            </div>

            <Card className="border-2 shadow-sm">
              <div className="p-6">
                <p className="text-sm font-medium text-foreground mb-4">
                  How do you feel now?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setRating(3)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2',
                      rating === 3
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Smile className="w-8 h-8 text-mood-great" />
                    <span className="text-sm">Better</span>
                  </button>
                  <button
                    onClick={() => setRating(2)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2',
                      rating === 2
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Meh className="w-8 h-8 text-mood-okay" />
                    <span className="text-sm">Same</span>
                  </button>
                  <button
                    onClick={() => setRating(1)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2',
                      rating === 1
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Frown className="w-8 h-8 text-mood-low" />
                    <span className="text-sm">Worse</span>
                  </button>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={() => window.location.href = '/calm'}
                size="lg"
                className="w-full h-14"
                variant="outline"
              >
                Done
              </Button>
              <Button
                onClick={handleReset}
                size="lg"
                className="w-full h-14"
                variant="ghost"
              >
                Another Round
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

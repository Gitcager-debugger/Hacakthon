'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function GroundingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPracticing, setIsPracticing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      number: 5,
      title: "Name 5 things you can see",
      instruction: "Look around and slowly name 5 things you can see. Really focus on noticing details - colors, shapes, textures.",
      examples: ["The blue pen on my desk", "A green plant in the corner", "The white coffee mug", "A bookshelf with books", "The window with sunlight"]
    },
    {
      number: 4,
      title: "Name 4 things you can touch",
      instruction: "Notice 4 things you can feel. Touch different textures and really pay attention to how they feel.",
      examples: ["The smooth surface of my phone", "The soft fabric of my shirt", "The cool metal of my watch", "The warm mug in my hands"]
    },
    {
      number: 3,
      title: "Name 3 things you can hear",
      instruction: "Listen carefully to 3 sounds around you. Even small sounds like breathing or distant traffic count.",
      examples: ["The hum of the computer fan", "Birds chirping outside", "My own breathing"]
    },
    {
      number: 2,
      title: "Name 2 things you can smell",
      instruction: "Notice 2 scents around you. This might include your perfume, food cooking, or fresh air.",
      examples: ["The coffee aroma in the room", "My lavender hand lotion"]
    },
    {
      number: 1,
      title: "Name 1 thing you can taste",
      instruction: "Focus on 1 taste in your mouth. This could be from your last meal, drink, or even just the natural taste in your mouth.",
      examples: ["The lingering taste of coffee", "The mint from my toothpaste"]
    }
  ];

  const startPractice = () => {
    setIsPracticing(true);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      setCompletedSteps([...completedSteps, currentStep]);
      // Practice complete
      setTimeout(() => {
        setIsPracticing(false);
        setCurrentStep(0);
        setCompletedSteps([]);
      }, 2000);
    }
  };

  const resetPractice = () => {
    setIsPracticing(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white pb-6">
        {/* Header */}
        <div className="bg-white border-b border-border p-6">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  5-4-3-2-1 Grounding
                </h1>
                <p className="text-sm text-muted-foreground">
                  Quick technique to reduce anxiety and stay present
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 space-y-4 mt-4">
          {!isPracticing ? (
            <>
              {/* Introduction Card */}
              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The 5-4-3-2-1 technique helps you reconnect with your surroundings and bring your attention to the present moment. It's especially helpful when you're feeling overwhelmed, anxious, or dissociated.
                  </p>
                  
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2">Steps:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">5</span>
                        Name 5 things you can see
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">4</span>
                        Name 4 things you can touch
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">3</span>
                        Name 3 things you can hear
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
                        Name 2 things you can smell
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
                        Name 1 thing you can taste
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Card */}
              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <div className="text-green-700 font-medium">Reduces Anxiety</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                      <div className="text-blue-700 font-medium">Improves Focus</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                      <div className="text-purple-700 font-medium">Grounds You</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                      <div className="text-amber-700 font-medium">Quick & Simple</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Start Button */}
              <Button 
                onClick={startPractice}
                className="w-full h-14 text-lg font-semibold shadow-md shadow-primary/20"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Grounding Practice
              </Button>
            </>
          ) : (
            <>
              {/* Progress Bar */}
              <Card className="border-2 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetPractice}
                      className="text-muted-foreground"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Current Step Card */}
              <Card className="border-2 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">{steps[currentStep].number}</span>
                  </div>
                  <CardTitle className="text-xl">
                    {steps[currentStep].title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-center">
                    {steps[currentStep].instruction}
                  </p>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Examples:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {steps[currentStep].examples.map((example, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    onClick={nextStep}
                    className="w-full h-12 text-base font-semibold"
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Complete Practice
                      </>
                    ) : (
                      'Next Step'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Completed Steps */}
              {completedSteps.length > 0 && (
                <Card className="border-2 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      Completed Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {completedSteps.map((stepIndex) => (
                        <div key={stepIndex} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm text-green-800">
                            {steps[stepIndex].title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Tips Card */}
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Helpful Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Take your time with each step - there's no rush</p>
              <p>• Really focus on the sensations and details</p>
              <p>• You can repeat this technique as many times as needed</p>
              <p>• Practice makes perfect - the more you do it, the more natural it becomes</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
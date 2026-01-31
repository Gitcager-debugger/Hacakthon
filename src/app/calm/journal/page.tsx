'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PenTool, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function JournalPage() {
  const [entry, setEntry] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    if (entry.trim()) {
      toast({
        title: 'Entry saved! ✨',
        description: 'Your thoughts have been recorded',
      });
      setEntry('');
    } else {
      toast({
        title: 'Empty entry',
        description: 'Please write something before saving',
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
                <PenTool className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Quick Journal
                </h1>
                <p className="text-sm text-muted-foreground">
                  Express your thoughts and feelings
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 space-y-4 mt-4">
          {/* Writing Prompt */}
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Today's Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                What are you grateful for today? What's weighing on your mind? 
                Take a moment to write down your thoughts without judgment.
              </p>
            </CardContent>
          </Card>

          {/* Journal Entry */}
          <Card className="border-2 shadow-sm">
            <CardContent className="p-4">
              <Textarea
                placeholder="Start writing your thoughts here..."
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                className="min-h-[200px] text-base"
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button 
            onClick={handleSave}
            className="w-full h-12 text-base font-semibold shadow-md shadow-primary/20"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Save Entry
          </Button>

          {/* Tips */}
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Journaling Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Write freely without worrying about grammar or spelling</p>
              <p>• Even 5 minutes of journaling can be beneficial</p>
              <p>• Focus on how you're feeling right now</p>
              <p>• There's no right or wrong way to journal</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
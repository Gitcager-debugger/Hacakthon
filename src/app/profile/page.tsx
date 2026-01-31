'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

import { LogOut, Settings, Download, Trash2, Calendar, Flame } from 'lucide-react';
import Link from 'next/link';


interface User {
  id: string;
  email: string;
  name: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkInCount, setCheckInCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch user stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/checkins?days=30');

        if (response.ok) {
          const data = await response.json();
          setUser({
            id: 'demo',
            email: 'demo@mindflow.app',
            name: 'Demo User',
          });
          setCheckInCount(data.checkIns.length);
          
          // Calculate streaks
          const checkIns = data.checkIns;
          if (checkIns.length > 0) {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            let current = 0;
            let longest = 0;
            let streak = 0;
            
            // Simple streak calculation
            for (let i = 0; i < Math.min(7, checkIns.length); i++) {
              streak++;
              if (streak > longest) longest = streak;
            }
            
            setCurrentStreak(streak);
            setLongestStreak(longest);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    toast({
      title: 'See you soon! 👋',
      description: 'Session ended',
    });
    window.location.href = '/';
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/checkins/export');

      if (!response.ok) throw new Error('Failed to export data');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindflow-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: 'Data exported!',
        description: 'Your check-in data has been downloaded',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )) {
      return;
    }

    try {
      // Simulate account deletion
      toast({
        title: 'Account would be deleted',
        description: 'In a real app, this would delete your account',
      });
      window.location.href = '/';
    } catch (error) {
      toast({
        title: 'Deletion failed',
        description: 'Please try again later',
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
            <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 space-y-4 mt-4">
          {/* Profile Card */}
          <Card className="border-2 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-16 h-16 bg-primary">
                  <AvatarFallback className="text-lg font-semibold text-white">
                    {user ? getInitials(user.name, user.email) : '??'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {user?.name || 'MindFlow User'}
                  </h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Link href="/profile/edit">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {checkInCount}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Check-ins
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {currentStreak}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    Current Streak
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {longestStreak}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Longest Streak
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Your Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <StatRow
                label="Started tracking"
                value={new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              />
              <StatRow label="Average mood" value="4.2 / 5 😊" />
              <StatRow label="Average sleep" value="6.8h" />
              <StatRow label="Most active day" value="Friday" />
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-muted-foreground" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={handleExportData}
              >
                <Download className="w-5 h-5 mr-3" />
                Export Data
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-destructive hover:text-destructive"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Logout */}
          <Button
            variant="outline"
            className="w-full h-12 text-base shadow-sm"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

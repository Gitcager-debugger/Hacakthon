'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { cn } from '@/lib/utils';

interface MoodTrendChartProps {
  data?: any[];
  className?: string;
}

export function LineChart({ data = [], className }: MoodTrendChartProps) {
  // Transform check-in data to chart format
  const chartData = data.length > 0 
    ? data
        .slice()
        .reverse() // Show chronological order
        .map((checkIn, index) => ({
          day: new Date(checkIn.createdAt).toLocaleDateString('en-US', { 
            weekday: 'short' 
          }),
          mood: checkIn.mood,
          date: new Date(checkIn.createdAt).toLocaleDateString()
        }))
        .slice(-7) // Last 7 entries
    : [
        { day: 'Mon', mood: 3.5 },
        { day: 'Tue', mood: 4.0 },
        { day: 'Wed', mood: 3.8 },
        { day: 'Thu', mood: 4.2 },
        { day: 'Fri', mood: 5.0 },
        { day: 'Sat', mood: 4.5 },
        { day: 'Sun', mood: 4.3 },
      ];

  const moodLabels = ['😢', '😔', '😐', '🙂', '😊'];
  return (
    <div className={cn('w-full h-[200px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#78716C' }}
          />
          <YAxis
            domain={[1, 5]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#78716C' }}
            tickCount={5}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const dataPoint = payload[0].payload;
                const moodValue = dataPoint.mood as number;
                return (
                  <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-sm font-medium text-foreground">
                      {moodLabels[moodValue - 1]} {moodValue}/5
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {dataPoint.date}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="mood"
            stroke="#10B981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#moodGradient)"
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

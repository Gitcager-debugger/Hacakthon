import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get demo user
    let user = await db.user.findUnique({
      where: { email: 'demo@mindflow.app' },
    });

    if (!user) {
      // Create demo user if missing to keep behavior consistent with other routes
      user = await db.user.create({
        data: {
          email: 'demo@mindflow.app',
          name: 'Demo User',
          hashedPassword: 'demo',
        },
      });
    }

    // Get all check-ins for this user
    const checkIns = await db.checkIn.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert to CSV format
    const headers = ['Date', 'Mood', 'Energy Level', 'Sleep Hours', 'Social Battery', 'Journal Note'];
    const csvRows = [
      headers.join(','),
      ...checkIns.map(checkIn => [
        `"${new Date(checkIn.createdAt).toISOString()}"`,
        checkIn.mood,
        checkIn.energyLevel,
        checkIn.sleepHours || '',
        checkIn.socialBattery || '',
        `"${checkIn.journalNote || ''}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');

    // Create response with CSV headers
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="mindflow-data-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Export error:', error);
    const body =
      process.env.NODE_ENV === 'development'
        ? { error: 'Failed to export data', message: (error as Error)?.message, stack: (error as Error)?.stack }
        : { error: 'Failed to export data' };
    return NextResponse.json(body, { status: 500 });
  }
}
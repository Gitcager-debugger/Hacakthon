import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { devLog } from '@/lib/dev-logger';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    devLog(`POST /api/checkins body=${JSON.stringify(body)}`);
    const { mood, energyLevel, sleepHours, socialBattery, journalNote } = body;

    if (!mood || !energyLevel) {
      return NextResponse.json(
        { error: 'Mood and energy level are required' },
        { status: 400 }
      );
    }

    // Validate mood range
    if (mood < 1 || mood > 5) {
      return NextResponse.json(
        { error: 'Mood must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate energy level range
    if (energyLevel < 1 || energyLevel > 5) {
      return NextResponse.json(
        { error: 'Energy level must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Get or create demo user
    let user = await db.user.findUnique({
      where: { email: 'demo@mindflow.app' },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: 'demo@mindflow.app',
          name: 'Demo User',
          hashedPassword: 'demo', // Not used but required
        },
      });
    }

    // Create check-in
    const checkIn = await db.checkIn.create({
      data: {
        userId: user.id,
        mood,
        energyLevel,
        sleepHours: sleepHours || null,
        socialBattery: socialBattery || null,
        journalNote: journalNote || null,
      },
    });

    return NextResponse.json({ checkIn }, { status: 201 });
  } catch (error) {
    console.error('Check-in error:', error);
    devLog(`ERROR POST /api/checkins ${(error as Error)?.message} ${(error as Error)?.stack}`);
    const body =
      process.env.NODE_ENV === 'development'
        ? { error: 'Internal server error', message: (error as Error)?.message, stack: (error as Error)?.stack }
        : { error: 'Internal server error' };
    return NextResponse.json(body, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    devLog(`GET /api/checkins url=${request.url}`);
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    // Get or create demo user
    let user = await db.user.findUnique({
      where: { email: 'demo@mindflow.app' },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: 'demo@mindflow.app',
          name: 'Demo User',
          hashedPassword: 'demo', // Not used but required
        },
      });
    }

    // Get check-ins for the specified period
    const checkIns = await db.checkIn.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ checkIns }, { status: 200 });
  } catch (error) {
    console.error('Get check-ins error:', error);
    devLog(`ERROR GET /api/checkins ${(error as Error)?.message} ${(error as Error)?.stack}`);
    const body =
      process.env.NODE_ENV === 'development'
        ? { error: 'Internal server error', message: (error as Error)?.message, stack: (error as Error)?.stack }
        : { error: 'Internal server error' };
    return NextResponse.json(body, { status: 500 });
  }
}

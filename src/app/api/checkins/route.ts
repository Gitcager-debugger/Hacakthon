import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken, extractTokenFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
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

    // Create check-in
    const checkIn = await db.checkIn.create({
      data: {
        userId: payload.userId,
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    // Get check-ins for the specified period
    const checkIns = await db.checkIn.findMany({
      where: {
        userId: payload.userId,
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

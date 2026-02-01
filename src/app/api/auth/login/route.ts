import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { devLog } from '@/lib/dev-logger'

export async function POST(request: NextRequest) {
  try {
    devLog(`POST /api/auth/login url=${request.url}`)
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    let user = await db.user.findUnique({
      where: { email }
    })

    // If user doesn't exist, create demo user
    if (!user) {
      user = await db.user.create({
        data: {
          name: email.split('@')[0] || 'User',
          email,
          hashedPassword: password
        }
      })
      devLog(`Demo user created: ${user.id} ${user.email}`)
    }

    // In demo mode, accept any password
    // In real app, verify hashed password

    devLog(`User logged in: ${user.id} ${user.email}`)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    devLog(`ERROR POST /api/auth/login ${(error as Error)?.message} ${(error as Error)?.stack}`)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
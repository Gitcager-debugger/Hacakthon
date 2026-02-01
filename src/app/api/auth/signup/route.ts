import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { devLog } from '@/lib/dev-logger'

export async function POST(request: NextRequest) {
  try {
    devLog(`POST /api/auth/signup url=${request.url}`)
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user (demo - no password hashing)
    const user = await db.user.create({
      data: {
        name,
        email,
        hashedPassword: password // In real app, hash this
      }
    })

    devLog(`User created: ${user.id} ${user.email}`)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    devLog(`ERROR POST /api/auth/signup ${(error as Error)?.message} ${(error as Error)?.stack}`)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
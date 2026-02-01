import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { devLog } from '@/lib/dev-logger'

export async function GET(request: NextRequest) {
  try {
    devLog(`GET /api/auth/me url=${request.url}`)
    
    // In demo mode, return a default user
    // In real app, verify session/token
    
    const user = await db.user.findFirst()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    devLog(`ERROR GET /api/auth/me ${(error as Error)?.message} ${(error as Error)?.stack}`)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
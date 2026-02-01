import { NextRequest, NextResponse } from 'next/server'
import { devLog } from '@/lib/dev-logger'

export async function POST(request: NextRequest) {
  try {
    devLog(`POST /api/auth/logout url=${request.url}`)
    
    // In demo mode, just return success
    // In real app, destroy session/token
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

  } catch (error) {
    devLog(`ERROR POST /api/auth/logout ${(error as Error)?.message} ${(error as Error)?.stack}`)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
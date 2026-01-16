import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Simple token generation (in production, use a more secure method)
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const adminPassword = process.env.ADMIN_CHESS_PASSWORD

    if (!adminPassword) {
      console.error('ADMIN_CHESS_PASSWORD environment variable is not set')
      return NextResponse.json(
        { error: 'Admin authentication not configured' },
        { status: 500 }
      )
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Generate a session token
    const token = generateToken()

    // Store token hash (in production, store in database/Redis with expiration)
    // For now, we'll just return the token and validate it matches on each request
    // In a production system, you'd want to store this in Redis/database with expiration

    return NextResponse.json({
      token,
      success: true
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to authenticate', message: error.message },
      { status: 500 }
    )
  }
}

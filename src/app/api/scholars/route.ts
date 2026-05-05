import { NextRequest, NextResponse } from 'next/server'
import { mockScholars } from '@/lib/mockData'

export async function GET() {
  return NextResponse.json(mockScholars)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newScholar = {
      id: String(Math.max(0, ...mockScholars.map(s => parseInt(s.id) || 0)) + 1),
      ...body,
    }
    mockScholars.push(newScholar)
    return NextResponse.json(newScholar, { status: 201 })
  } catch (error) {
    console.error('Create scholar error:', error)
    return NextResponse.json({ error: 'Failed to create scholar' }, { status: 500 })
  }
}
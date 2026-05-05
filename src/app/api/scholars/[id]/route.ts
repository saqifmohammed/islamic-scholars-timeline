import { NextRequest, NextResponse } from 'next/server'
import { mockScholars } from '@/lib/mockData'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const scholar = mockScholars.find(s => s.id === id)
  
  if (!scholar) {
    return NextResponse.json({ error: 'Scholar not found' }, { status: 404 })
  }
  
  return NextResponse.json(scholar)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const body = await request.json()
    const index = mockScholars.findIndex(s => s.id === id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Scholar not found' }, { status: 404 })
    }
    
    mockScholars[index] = { ...mockScholars[index], ...body }
    return NextResponse.json(mockScholars[index])
  } catch (error) {
    console.error('Update scholar error:', error)
    return NextResponse.json({ error: 'Failed to update scholar' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const index = mockScholars.findIndex(s => s.id === id)
  
  if (index === -1) {
    return NextResponse.json({ error: 'Scholar not found' }, { status: 404 })
  }
  
  mockScholars.splice(index, 1)
  return NextResponse.json({ success: true })
}
import { NextRequest, NextResponse } from 'next/server'
import { mockRelationships } from '@/lib/mockData'


export async function GET() {
  return NextResponse.json(mockRelationships)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newRelationship = {
      id: 'r' + (Math.max(0, ...mockRelationships.map(r => parseInt(r.id.replace('r', '')) || 0)) + 1),
      ...body,
    }
    mockRelationships.push(newRelationship)
    return NextResponse.json(newRelationship, { status: 201 })
  } catch (error) {
    console.error('Create relationship error:', error)
    return NextResponse.json({ error: 'Failed to create relationship' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'Relationship ID required' }, { status: 400 })
  }
  
  const index = mockRelationships.findIndex(r => r.id === id)
  
  if (index === -1) {
    return NextResponse.json({ error: 'Relationship not found' }, { status: 404 })
  }
  
  mockRelationships.splice(index, 1)
  return NextResponse.json({ success: true })
}
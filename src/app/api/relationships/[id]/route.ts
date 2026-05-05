import { NextRequest, NextResponse } from 'next/server'
import { mockRelationships } from '@/lib/mockData'


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const index = mockRelationships.findIndex(r => r.id === id)
  
  if (index === -1) {
    return NextResponse.json({ error: 'Relationship not found' }, { status: 404 })
  }
  
  mockRelationships.splice(index, 1)
  return NextResponse.json({ success: true })
}
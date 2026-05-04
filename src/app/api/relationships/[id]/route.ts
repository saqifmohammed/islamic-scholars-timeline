import { NextRequest, NextResponse } from 'next/server'

let mockRelationships = [
  { id: 'r1', teacher_id: '2', student_id: '3', type: 'teacher' },
  { id: 'r2', teacher_id: '3', student_id: '4', type: 'teacher' },
]

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
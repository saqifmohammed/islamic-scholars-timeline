import { NextRequest, NextResponse } from 'next/server'

let mockRelationships = [
  // Rasoolullah to Sahaba
  { id: 'r1', teacher_id: '1', student_id: '2', type: 'teacher' },
  { id: 'r2', teacher_id: '1', student_id: '3', type: 'teacher' },
  { id: 'r3', teacher_id: '1', student_id: '4', type: 'teacher' },
  // Classical transmission
  { id: 'r4', teacher_id: '8', student_id: '9', type: 'teacher' },
  { id: 'r5', teacher_id: '9', student_id: '10', type: 'teacher' },
  { id: 'r6', teacher_id: '10', student_id: '11', type: 'teacher' },
  { id: 'r7', teacher_id: '11', student_id: '12', type: 'teacher' },
  // 20th century chain
  { id: 'r8', teacher_id: '13', student_id: '15', type: 'teacher' },
  { id: 'r9', teacher_id: '13', student_id: '19', type: 'teacher' },
  { id: 'r10', teacher_id: '13', student_id: '23', type: 'teacher' },
  { id: 'r11', teacher_id: '14', student_id: '17', type: 'teacher' },
  { id: 'r12', teacher_id: '15', student_id: '16', type: 'teacher' },
  { id: 'r13', teacher_id: '15', student_id: '17', type: 'teacher' },
  { id: 'r14', teacher_id: '15', student_id: '18', type: 'teacher' },
  { id: 'r15', teacher_id: '15', student_id: '20', type: 'teacher' },
  { id: 'r16', teacher_id: '15', student_id: '21', type: 'teacher' },
  { id: 'r17', teacher_id: '15', student_id: '22', type: 'teacher' },
  { id: 'r18', teacher_id: '15', student_id: '23', type: 'teacher' },
  { id: 'r19', teacher_id: '16', student_id: '20', type: 'teacher' },
  { id: 'r20', teacher_id: '16', student_id: '21', type: 'teacher' },
]

export async function GET() {
  return NextResponse.json(mockRelationships)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newRelationship = {
      id: 'r' + (mockRelationships.length + 1),
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
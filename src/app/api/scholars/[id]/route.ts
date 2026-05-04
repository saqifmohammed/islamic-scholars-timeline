import { NextRequest, NextResponse } from 'next/server'

let mockScholars = [
  { id: '1', name: 'Abu Hanifa', birth_year: 699, death_year: 767, generation: 'imams', madhhab: 'hanafi', region: 'Kufa', notes: null },
  { id: '2', name: 'Malik ibn Anas', birth_year: 711, death_year: 795, generation: 'imams', madhhab: 'maliki', region: 'Medina', notes: null },
  { id: '3', name: 'Al-Shafi\'i', birth_year: 767, death_year: 820, generation: 'imams', madhhab: 'shafii', region: 'Baghdad', notes: null },
  { id: '4', name: 'Ahmad ibn Hanbal', birth_year: 780, death_year: 855, generation: 'imams', madhhab: 'hanbali', region: 'Baghdad', notes: null },
]

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
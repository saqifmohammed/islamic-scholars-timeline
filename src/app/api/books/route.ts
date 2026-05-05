import { NextRequest, NextResponse } from 'next/server'
import { mockBooks } from '@/lib/mockData'

export async function GET() {
  return NextResponse.json(mockBooks)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newBook = {
      id: 'b' + (Math.max(0, ...mockBooks.map(b => parseInt(b.id.replace('b', '')) || 0)) + 1),
      title: body.title,
      author_id: body.author_id,
      notes: body.notes || null,
    }
    mockBooks.push(newBook)
    return NextResponse.json(newBook, { status: 201 })
  } catch (error) {
    console.error('Create book error:', error)
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
  }
}

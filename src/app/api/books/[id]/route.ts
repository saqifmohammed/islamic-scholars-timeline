import { NextRequest, NextResponse } from 'next/server'
import { mockBooks } from '@/lib/mockData'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const book = mockBooks.find(b => b.id === id)
  if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  return NextResponse.json(book)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const index = mockBooks.findIndex(b => b.id === id)
    if (index === -1) return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    mockBooks[index] = { ...mockBooks[index], ...body }
    return NextResponse.json(mockBooks[index])
  } catch (error) {
    console.error('Update book error:', error)
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const index = mockBooks.findIndex(b => b.id === id)
  if (index === -1) return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  mockBooks.splice(index, 1)
  return NextResponse.json({ success: true })
}

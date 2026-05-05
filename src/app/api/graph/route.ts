import { NextRequest, NextResponse } from 'next/server'
import { mockScholars, mockRelationships, mockBooks } from '@/lib/mockData'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const generation = searchParams.get('generation') || undefined
  const madhhab = searchParams.get('madhhab') || undefined
  const creed = searchParams.get('creed') || undefined

  let scholars = [...mockScholars]

  if (generation) {
    scholars = scholars.filter(s => s.generation === generation)
  }
  if (madhhab) {
    scholars = scholars.filter(s => s.madhhab === madhhab)
  }
  if (creed) {
    scholars = scholars.filter(s => s.creed === creed)
  }

  const scholarIds = scholars.map(s => s.id)
  const relationships = mockRelationships.filter(r => 
    scholarIds.includes(r.teacher_id) && scholarIds.includes(r.student_id)
  )

  const nodes = scholars.map(s => ({
    id: s.id,
    label: s.name,
    data: {
      generation: s.generation,
      madhhab: s.madhhab,
      creed: s.creed,
      birthYear: s.birth_year,
      deathYear: s.death_year,
      books: mockBooks
        .filter(b => b.author_id === s.id)
        .map(b => ({ id: b.id, title: b.title })),
    },
  }))

  const edges = relationships.map(r => ({
    id: r.id,
    source: r.teacher_id,
    target: r.student_id,
    type: r.type,
  }))

  return NextResponse.json({ nodes, edges })
}
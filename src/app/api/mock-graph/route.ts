import { NextRequest, NextResponse } from 'next/server'

const mockScholars = [
  { id: '1', name: 'Abu Hanifa', birth_year: 699, death_year: 767, generation: 'imams', madhhab: 'hanafi', region: 'Kufa', notes: null },
  { id: '2', name: 'Malik ibn Anas', birth_year: 711, death_year: 795, generation: 'imams', madhhab: 'maliki', region: 'Medina', notes: null },
  { id: '3', name: 'Al-Shafi\'i', birth_year: 767, death_year: 820, generation: 'imams', madhhab: 'shafii', region: 'Baghdad', notes: null },
  { id: '4', name: 'Ahmad ibn Hanbal', birth_year: 780, death_year: 855, generation: 'imams', madhhab: 'hanbali', region: 'Baghdad', notes: null },
]

const mockRelationships = [
  { id: 'r1', teacher_id: '2', student_id: '3', type: 'teacher' },
  { id: 'r2', teacher_id: '3', student_id: '4', type: 'teacher' },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const generation = searchParams.get('generation') || undefined
  const madhhab = searchParams.get('madhhab') || undefined
  const minYear = searchParams.get('minYear') ? parseInt(searchParams.get('minYear')!) : undefined
  const maxYear = searchParams.get('maxYear') ? parseInt(searchParams.get('maxYear')!) : undefined

  let scholars = [...mockScholars]

  if (generation) {
    scholars = scholars.filter(s => s.generation === generation)
  }
  if (madhhab) {
    scholars = scholars.filter(s => s.madhhab === madhhab)
  }
  if (minYear) {
    scholars = scholars.filter(s => s.birth_year && s.birth_year >= minYear)
  }
  if (maxYear) {
    scholars = scholars.filter(s => s.birth_year && s.birth_year <= maxYear)
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
      birthYear: s.birth_year,
      deathYear: s.death_year,
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
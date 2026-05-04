export interface Scholar {
  id: string
  name: string
  birth_year: number | null
  death_year: number | null
  generation: Generation
  madhhab: Madhhab | null
  creed: Creed | null
  region: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type Generation = 
  | 'sahaba'
  | 'tabiun'
  | 'atba_al_tabiin'
  | 'imams'
  | 'scholars'

export type Madhhab = 
  | 'hanafi'
  | 'maliki'
  | 'shafii'
  | 'hanbali'
  | 'zahiri'
  | 'hadith'
  | null

export type Creed = 
  | 'athari'
  | 'ashari'
  | 'maturidi'
  | 'zahiri'
  | null

export interface Relationship {
  id: string
  teacher_id: string
  student_id: string
  type: 'teacher' | 'influence'
  created_at: string
}

export interface GraphNode {
  id: string
  label: string
  data: {
    generation: Generation
    madhhab: string | null
    creed: string | null
    birthYear: number | null
    deathYear: number | null
  }
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type?: string
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export const GENERATION_COLORS: Record<Generation, string> = {
  sahaba: '#6B7280',
  tabiun: '#6B7280',
  atba_al_tabiin: '#6B7280',
  imams: '#6B7280',
  scholars: '#6B7280',
}

export const GENERATION_LABELS: Record<Generation, string> = {
  sahaba: 'Sahaba',
  tabiun: "Tabi'un",
  atba_al_tabiin: "Atba' al-Tabi'in",
  imams: 'Imams',
  scholars: 'Scholars',
}
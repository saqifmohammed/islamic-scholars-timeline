'use client'

import { GraphNode, GENERATION_LABELS } from '@/types'

interface ScholarDetailProps {
  scholar: GraphNode | null
  onClose?: () => void
  onTeacherClick?: (teacherId: string) => void
  onStudentClick?: (studentId: string) => void
}

export default function ScholarDetail({ 
  scholar,
  onClose,
}: ScholarDetailProps) {
  if (!scholar) {
    return (
      <div 
        className="w-[320px] h-full border-l p-4"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div 
          className="flex items-center justify-center h-full"
          style={{ color: 'var(--text-secondary)' }}
        >
          Select a scholar to view details
        </div>
      </div>
    )
  }

  const birthYear = scholar.data.birthYear
  const deathYear = scholar.data.deathYear

  return (
    <div 
      className="w-[320px] h-full border-l p-4 overflow-y-auto"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-lg"
          style={{ 
            backgroundColor: 'var(--surface-hover)', 
            color: 'var(--text-secondary)' 
          }}
        >
          ✕
        </button>
      )}
      
      <div className="space-y-4">
        {/* Generation badge */}
        <div>
          <span 
            className="text-xs px-2 py-1 rounded"
            style={{ 
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            {GENERATION_LABELS[scholar.data.generation as keyof typeof GENERATION_LABELS]}
          </span>
        </div>

        {/* Name */}
        <h2 className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>
          {scholar.label}
        </h2>

        {/* Years */}
        {(birthYear || deathYear) && (
          <div style={{ color: 'var(--text-secondary)' }}>
            {birthYear && <span>{birthYear}</span>}
            {birthYear && deathYear && <span> — </span>}
            {deathYear && <span>{deathYear}</span>}
            <span className="ml-2">(AH)</span>
          </div>
        )}

        {/* Lifespan */}
        {birthYear && deathYear && (
          <span 
            className="text-xs px-2 py-1 rounded"
            style={{ 
              backgroundColor: 'var(--accent)', 
              color: 'var(--surface)' 
            }}
          >
            {deathYear - birthYear} years
          </span>
        )}

        {/* Madhhab and Creed */}
        <div className="flex gap-2 flex-wrap">
          {scholar.data.madhhab && (
            <span 
              className="text-xs px-2 py-1 rounded"
              style={{ 
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-primary)',
              }}
            >
              {scholar.data.madhhab}
            </span>
          )}
          {scholar.data.creed && (
            <span 
              className="text-xs px-2 py-1 rounded"
              style={{ 
                backgroundColor: 'var(--accent)',
                color: 'var(--surface)',
              }}
            >
              {scholar.data.creed}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
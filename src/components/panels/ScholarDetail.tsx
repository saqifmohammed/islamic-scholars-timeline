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
      <aside 
        className="w-[320px] h-full border-l p-5 flex items-center justify-center shrink-0"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Select a scholar to view details
        </p>
      </aside>
    )
  }

  const birthYear = scholar.data.birthYear
  const deathYear = scholar.data.deathYear
  const lifespan = birthYear && deathYear ? deathYear - birthYear : null

  return (
    <aside 
      className="w-[320px] h-full border-l p-5 overflow-y-auto shrink-0"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg transition-all"
          style={{ 
            backgroundColor: 'var(--surface-hover)', 
            color: 'var(--text-secondary)' 
          }}
          aria-label="Close panel"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      <div className="space-y-5">
        {/* Generation badge */}
        <div>
          <span 
            className="text-xs font-medium px-2.5 py-1 rounded-lg inline-block"
            style={{ 
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            {GENERATION_LABELS[scholar.data.generation as keyof typeof GENERATION_LABELS]}
          </span>
        </div>

        {/* Name */}
        <h2 
          className="text-xl font-semibold"
          style={{ 
            color: 'var(--text-primary)', 
            fontFamily: 'Limelight, serif',
            fontWeight: 600 
          }}
        >
          {scholar.label}
        </h2>

        {/* Years */}
        {(birthYear || deathYear) && (
          <div style={{ color: 'var(--text-secondary)', fontSize: '16px', fontFamily: 'JetBrains Mono, monospace' }}>
            {birthYear && <span>{birthYear}</span>}
            {birthYear && deathYear && <span> — </span>}
            {deathYear && <span>{deathYear}</span>}
            <span className="ml-2 text-sm">(AH)</span>
          </div>
        )}

        {/* Lifespan badge */}
        {lifespan && (
          <span 
            className="text-xs font-semibold px-2.5 py-1 rounded-lg inline-block"
            style={{ 
              backgroundColor: 'var(--accent)', 
              color: 'var(--surface)',
            }}
          >
            {lifespan} years
          </span>
        )}

        {/* Divider */}
        <hr style={{ borderColor: 'var(--border)' }} />

        {/* Madhhab */}
        {scholar.data.madhhab && (
          <div>
            <span 
              className="text-xs uppercase tracking-wider font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Madhhab
            </span>
            <p 
              className="text-sm font-medium mt-1 capitalize"
              style={{ color: 'var(--text-primary)' }}
            >
              {scholar.data.madhhab}
            </p>
          </div>
        )}

        {/* Creed */}
        {scholar.data.creed && (
          <div>
            <span 
              className="text-xs uppercase tracking-wider font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Theological School
            </span>
            <p 
              className="text-sm font-medium mt-1 capitalize"
              style={{ color: 'var(--text-primary)' }}
            >
              {scholar.data.creed}
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
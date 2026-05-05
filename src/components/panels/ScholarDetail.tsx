'use client'

import { Scholar, GENERATION_LABELS } from '@/types'

interface ScholarDetailProps {
  scholar: Scholar | null
}

export default function ScholarDetail({ scholar }: ScholarDetailProps) {
  if (!scholar) {
    return (
      <div 
        className="w-[280px] h-full border-l p-4"
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

  return (
    <div 
      className="w-[280px] h-full border-l p-4 overflow-y-auto"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="space-y-3">
        {/* Generation badge */}
        <div>
          <span 
            className="text-xs px-2 py-1 rounded"
            style={{ 
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            {GENERATION_LABELS[scholar.generation as keyof typeof GENERATION_LABELS]}
          </span>
        </div>

        {/* Name */}
        <h2 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
          {scholar.name}
        </h2>

        {/* Years */}
        {(scholar.birth_year || scholar.death_year) && (
          <div style={{ color: 'var(--text-secondary)' }}>
            {scholar.birth_year && <span>{scholar.birth_year}</span>}
            {scholar.birth_year && scholar.death_year && <span> — </span>}
            {scholar.death_year && <span>{scholar.death_year}</span>}
            <span className="ml-2">(AH)</span>
          </div>
        )}

        {/* Madhhab and Creed */}
        <div className="flex gap-2">
          {scholar.madhhab && (
            <span 
              className="text-xs px-2 py-1 rounded"
              style={{ 
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-secondary)',
              }}
            >
              Madhhab: {scholar.madhhab}
            </span>
          )}
          {scholar.creed && (
            <span 
              className="text-xs px-2 py-1 rounded"
              style={{ 
                backgroundColor: 'var(--accent)',
                color: 'var(--surface)',
              }}
            >
              {scholar.creed}
            </span>
          )}
        </div>

        {/* Region */}
        {scholar.region && (
          <div style={{ color: 'var(--text-secondary)' }}>
            <span className="text-xs uppercase tracking-wider">Region</span>
            <div className="text-sm">{scholar.region}</div>
          </div>
        )}

        {/* Notes */}
        {scholar.notes && (
          <div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {scholar.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
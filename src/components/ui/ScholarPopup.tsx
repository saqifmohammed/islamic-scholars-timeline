'use client'

import { Scholar, GENERATION_LABELS } from '@/types'

interface ScholarPopupProps {
  scholar: Scholar
  onClose: () => void
}

export default function ScholarPopup({ scholar, onClose }: ScholarPopupProps) {
  const lifespan = scholar.birth_year && scholar.death_year 
    ? scholar.death_year - scholar.birth_year 
    : null

  return (
    <div 
      className="fixed left-4 top-20 w-80 max-h-[70vh] rounded-xl border shadow-2xl z-50 overflow-hidden"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span 
            className="text-[10px] px-2 py-1 rounded"
            style={{ 
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            {GENERATION_LABELS[scholar.generation as keyof typeof GENERATION_LABELS]}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:opacity-80 transition-opacity"
          style={{ 
            backgroundColor: 'var(--surface-hover)', 
            color: 'var(--text-secondary)' 
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(70vh-80px)]">
        {/* Name */}
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {scholar.name}
        </h2>

        {/* Years & Age */}
        {(scholar.birth_year || scholar.death_year) && (
          <div className="flex items-center gap-3">
            <div className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
              {scholar.birth_year && <span>{scholar.birth_year}</span>}
              {scholar.birth_year && scholar.death_year && <span> — </span>}
              {scholar.death_year && <span>{scholar.death_year}</span>}
            </div>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>(AH)</span>
            {lifespan && (
              <span 
                className="text-xs px-2 py-1 rounded"
                style={{ 
                  backgroundColor: 'var(--accent)', 
                  color: 'var(--surface)' 
                }}
              >
                {lifespan} years
              </span>
            )}
          </div>
        )}

        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          {scholar.madhhab && (
            <span 
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ 
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-primary)',
              }}
            >
              {scholar.madhhab.charAt(0).toUpperCase() + scholar.madhhab.slice(1)}
            </span>
          )}
          {scholar.creed && (
            <span 
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ 
                backgroundColor: 'var(--accent)', 
                color: 'var(--surface)' 
              }}
            >
              {scholar.creed.charAt(0).toUpperCase() + scholar.creed.slice(1)}
            </span>
          )}
        </div>

        {/* Region */}
        {scholar.region && (
          <div>
            <div className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-secondary)' }}>
              Region
            </div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
              {scholar.region}
            </div>
          </div>
        )}

        {/* Notes */}
        {scholar.notes && (
          <div>
            <div className="text-[10px] uppercase tracking-wider font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              About
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {scholar.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
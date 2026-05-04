'use client'

import { Scholar, GENERATION_LABELS } from '@/types'

interface ScholarPopupProps {
  scholar: Scholar
  onClose: () => void
}

export default function ScholarPopup({ scholar, onClose }: ScholarPopupProps) {
  return (
    <div 
      className="absolute left-3 top-3 w-56 rounded-lg border shadow-xl z-50"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <span 
          className="text-[9px] px-1.5 py-0.5 rounded"
          style={{ 
            backgroundColor: 'var(--surface-hover)',
            color: 'var(--text-secondary)',
          }}
        >
          {GENERATION_LABELS[scholar.generation as keyof typeof GENERATION_LABELS]}
        </span>
        <button
          onClick={onClose}
          className="p-0.5 rounded hover:bg-red-500 hover:text-white transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        {/* Name */}
        <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {scholar.name}
        </h3>

        {/* Years */}
        {(scholar.birth_year || scholar.death_year) && (
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {scholar.birth_year && <span>{scholar.birth_year}</span>}
            {scholar.birth_year && scholar.death_year && <span> — </span>}
            {scholar.death_year && <span>{scholar.death_year}</span>}
            <span className="ml-1">(AH)</span>
          </div>
        )}

        {/* Badges */}
        <div className="flex gap-1">
          {scholar.madhhab && (
            <span 
              className="text-[9px] px-1.5 py-0.5 rounded"
              style={{ 
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-secondary)',
              }}
            >
              {scholar.madhhab}
            </span>
          )}
          {scholar.creed && (
            <span 
              className="text-[9px] px-1.5 py-0.5 rounded"
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
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {scholar.region}
          </div>
        )}

        {/* Notes */}
        {scholar.notes && (
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {scholar.notes}
          </p>
        )}
      </div>
    </div>
  )
}
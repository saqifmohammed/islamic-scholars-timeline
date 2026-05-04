'use client'

import { useState } from 'react'
import { Generation, Madhhab, GENERATION_LABELS } from '@/types'

interface FilterMenuProps {
  filters: {
    generation: Generation | null
    madhhab: Madhhab | null
    minYear: number | null
    maxYear: number | null
  }
  onFilterChange: (filters: FilterMenuProps['filters']) => void
}

const generations: Generation[] = ['sahaba', 'tabiun', 'atba_al_tabiin', 'imams', 'scholars']
const madhhabs: (Madhhab | null)[] = ['hanafi', 'maliki', 'shafii', 'hanbali', 'hadith', null]

export default function FilterMenu({ filters, onFilterChange }: FilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hasActiveFilters = filters.generation || filters.madhhab || filters.minYear || filters.maxYear

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors"
        style={{
          backgroundColor: hasActiveFilters ? 'var(--accent)' : 'var(--surface-hover)',
          color: hasActiveFilters ? 'var(--surface)' : 'var(--text-secondary)',
        }}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span>Filter</span>
        {hasActiveFilters && (
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown menu */}
          <div 
            className="absolute top-full left-0 mt-1 w-48 rounded-lg border shadow-lg z-50 p-3"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="space-y-3">
              {/* Generation */}
              <div>
                <label className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Generation
                </label>
                <div className="flex flex-wrap gap-1 mt-1">
                  <button
                    onClick={() => onFilterChange({ ...filters, generation: null })}
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: !filters.generation ? 'var(--accent)' : 'var(--surface-hover)',
                      color: !filters.generation ? 'var(--surface)' : 'var(--text-secondary)',
                    }}
                  >
                    All
                  </button>
                  {generations.map(gen => (
                    <button
                      key={gen}
                      onClick={() => onFilterChange({ ...filters, generation: gen })}
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: filters.generation === gen ? 'var(--accent)' : 'var(--surface-hover)',
                        color: filters.generation === gen ? 'var(--surface)' : 'var(--text-secondary)',
                      }}
                    >
                      {GENERATION_LABELS[gen]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Madhhab */}
              <div>
                <label className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Madhhab
                </label>
                <div className="flex flex-wrap gap-1 mt-1">
                  <button
                    onClick={() => onFilterChange({ ...filters, madhhab: null })}
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: !filters.madhhab ? 'var(--accent)' : 'var(--surface-hover)',
                      color: !filters.madhhab ? 'var(--surface)' : 'var(--text-secondary)',
                    }}
                  >
                    All
                  </button>
                  {madhhabs.filter(Boolean).map(m => (
                    <button
                      key={m!}
                      onClick={() => onFilterChange({ ...filters, madhhab: m })}
                      className="text-[10px] px-1.5 py-0.5 rounded capitalize"
                      style={{
                        backgroundColor: filters.madhhab === m ? 'var(--accent)' : 'var(--surface-hover)',
                        color: filters.madhhab === m ? 'var(--surface)' : 'var(--text-secondary)',
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              <button
                onClick={() => onFilterChange({
                  generation: null,
                  madhhab: null,
                  minYear: null,
                  maxYear: null,
                })}
                className="w-full py-1 rounded text-[10px]"
                style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)' }}
              >
                Clear All
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
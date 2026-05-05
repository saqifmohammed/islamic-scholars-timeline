'use client'

import { Generation, Madhhab, Creed, GENERATION_LABELS } from '@/types'

interface FilterSidebarProps {
  filters: {
    generation: Generation | null
    madhhab: Madhhab | null
    minYear: number | null
    maxYear: number | null
  }
  onFilterChange: (filters: FilterSidebarProps['filters']) => void
}

const generations: Generation[] = ['sahaba', 'tabiun', 'atba_al_tabiin', 'imams', 'scholars']
const madhhabs: (Madhhab | null)[] = ['hanafi', 'maliki', 'shafii', 'hanbali', 'zahiri', 'hadith', null]
const creeds: (Creed | null)[] = ['athari', 'ashari', 'maturidi', 'zahiri', null]

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  return (
    <div 
      className="w-[280px] h-full border-r p-4 overflow-y-auto"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
        Filters
      </h2>
      
      <div className="space-y-5">
        {/* Generation Filter */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Generation
          </label>
          <div className="space-y-1">
            <button
              onClick={() => onFilterChange({ ...filters, generation: null })}
              className="w-full text-left px-2 py-1.5 rounded text-xs transition-colors"
              style={{
                backgroundColor: !filters.generation ? 'var(--accent)' : 'transparent',
                color: !filters.generation ? 'var(--surface)' : 'var(--text-secondary)',
              }}
            >
              All
            </button>
            {generations.map(gen => (
              <button
                key={gen}
                onClick={() => onFilterChange({ ...filters, generation: gen })}
                className="w-full text-left px-2 py-1.5 rounded text-xs transition-colors"
                style={{
                  backgroundColor: filters.generation === gen ? 'var(--surface-hover)' : 'transparent',
                  color: filters.generation === gen ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {GENERATION_LABELS[gen]}
              </button>
            ))}
          </div>
        </div>

        {/* Madhhab Filter */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Madhhab (Fiqh)
          </label>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => onFilterChange({ ...filters, madhhab: null })}
              className="text-xs px-2 py-1 rounded"
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
                className="text-xs px-2 py-1 rounded"
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

        {/* Year Range */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Year Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="From"
              value={filters.minYear || ''}
              onChange={(e) => onFilterChange({ 
                ...filters, 
                minYear: e.target.value ? parseInt(e.target.value) : null 
              })}
              className="w-full px-2 py-1.5 rounded text-xs"
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
            <input
              type="number"
              placeholder="To"
              value={filters.maxYear || ''}
              onChange={(e) => onFilterChange({ 
                ...filters, 
                maxYear: e.target.value ? parseInt(e.target.value) : null 
              })}
              className="w-full px-2 py-1.5 rounded text-xs"
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => onFilterChange({
            generation: null,
            madhhab: null,
            minYear: null,
            maxYear: null,
          })}
          className="w-full py-1.5 rounded text-xs"
          style={{ 
            backgroundColor: 'var(--surface-hover)',
            color: 'var(--text-secondary)',
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
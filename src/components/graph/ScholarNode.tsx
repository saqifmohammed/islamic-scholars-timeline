'use client'

import { memo, useCallback } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'

interface ScholarData {
  label: string
  generation?: string
  madhhab?: string
  birthYear?: number
  deathYear?: number
  isSelected?: boolean
}

function ScholarNode({ data, selected }: NodeProps<ScholarData>) {
  const generationColors: Record<string, string> = {
    sahaba: 'var(--sahaba)',
    tabiun: 'var(--tabiun)',
    atba_al_tabiin: 'var(--atba-al-tabiin)',
    imams: 'var(--imams)',
    scholars: 'var(--scholars)',
  }

  const madhhabColors: Record<string, string> = {
    hanafi: 'var(--hanafi)',
    maliki: 'var(--maliki)',
    shafii: 'var(--shafii)',
    hanbali: 'var(--hanbali)',
    zahiri: 'var(--zahiri)',
  }

  const genColor = generationColors[data.generation || 'scholars']
  const madhhabColor = madhhabColors[data.madhhab || '']

  const birthYear = data.birthYear
  const deathYear = data.deathYear
  const years = birthYear 
    ? `${birthYear}${deathYear ? ' - ' + deathYear : ''}`
    : ''

  return (
    <div
      className="px-4 py-3 rounded-lg min-w-[200px] transition-all duration-200"
      style={{
        backgroundColor: 'var(--surface)',
        border: `2px solid ${selected ? 'var(--accent)' : genColor}`,
        boxShadow: selected ? '0 0 20px var(--accent)' : 'none',
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: genColor }} 
      />
      
      <div className="space-y-2">
        <div 
          className="text-sm font-semibold truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {data.label}
        </div>
        
        {years && (
          <div 
            className="text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            {years} (AH)
          </div>
        )}
        
        <div className="flex gap-1 flex-wrap">
          {data.madhhab && (
            <span
              className="text-[10px] px-2 py-0.5 rounded"
              style={{
                backgroundColor: madhhabColor + '20',
                color: madhhabColor,
              }}
            >
              {data.madhhab}
            </span>
          )}
          {data.generation && (
            <span
              className="text-[10px] px-2 py-0.5 rounded"
              style={{
                backgroundColor: genColor + '20',
                color: genColor,
              }}
            >
              {data.generation.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: genColor }} 
      />
    </div>
  )
}

export default memo(ScholarNode)
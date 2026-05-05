'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { GraphNode } from '@/types'

interface ScholarData {
  label: string
  generation?: string
  madhhab?: string
  birthYear?: number
  deathYear?: number
  isSelected?: boolean
}

function ScholarNode({ data, selected }: NodeProps<ScholarData>) {
  // Generation color tokens
  const generationColors: Record<string, string> = {
    sahaba: 'var(--sahaba)',
    tabiun: 'var(--tabiun)',
    atba_al_tabiin: 'var(--atba-al-tabiin)',
    imams: 'var(--imams)',
    scholars: 'var(--scholars)',
  }

  // Madhhab color tokens
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

  return (
    <div
      className="px-4 py-3 rounded-xl min-w-[220px] transition-all duration-200"
      style={{
        backgroundColor: 'var(--surface)',
        border: `2px solid ${selected ? data.isSelected ? 'var(--accent)' : genColor : 'var(--border)'}`,
        boxShadow: selected 
          ? '0 0 24px rgba(59, 130, 246, 0.4), 0 8px 32px rgba(0, 0, 0, 0.1)' 
          : '0 2px 8px rgba(0, 0, 0, 0.06)',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: genColor,
          width: 10,
          height: 10,
          border: '2px solid var(--surface)'
        }} 
      />
      
      <div className="space-y-2">
        {/* Name - Primary text */}
        <div 
          className="text-sm font-semibold truncate"
          style={{ 
            color: 'var(--text-primary)',
            fontFamily: 'Limelight, serif',
            fontWeight: 600
          }}
        >
          {data.label}
        </div>
        
        {/* Years - Secondary text */}
        {birthYear && (
          <div 
            className="text-xs font-mono"
            style={{ color: 'var(--text-secondary)' }}
          >
            {birthYear} – {deathYear || '?'} AH
            {birthYear && deathYear && (
              <span 
                className="ml-2 px-1.5 py-0.5 rounded text-[10px]"
                style={{ 
                  backgroundColor: 'var(--accent)', 
                  color: 'var(--surface)',
                  fontWeight: 600
                }}
              >
                {deathYear - birthYear}y
              </span>
            )}
          </div>
        )}
        
        {/* Badges */}
        <div className="flex gap-1.5 flex-wrap">
          {data.madhhab && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded"
              style={{
                backgroundColor: madhhabColor + '15',
                color: madhhabColor,
              }}
            >
              {data.madhhab}
            </span>
          )}
          {data.generation && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded"
              style={{
                backgroundColor: genColor + '15',
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
        style={{ 
          background: genColor,
          width: 10,
          height: 10,
          border: '2px solid var(--surface)'
        }} 
      />
    </div>
  )
}

export default memo(ScholarNode)
'use client'

import { memo, useState } from 'react'
import { Handle, Position } from '@xyflow/react'

interface ScholarNodeData {
  generation: string
  madhhab: string | null
  creed: string | null
  birthYear: number | null
  deathYear: number | null
  label?: string
  lifespan?: number
  pixelsPerYear?: number
}

interface Props {
  data: ScholarNodeData
  selected?: boolean
}

function ScholarNode({ data, selected }: Props) {
  const [expanded, setExpanded] = useState(false)
  
  const years = data.birthYear 
    ? `${data.birthYear}${data.deathYear ? ' - ' + data.deathYear : ''}`
    : ''
  
  const lifespan = data.lifespan || 30
  const pixelsPerYear = data.pixelsPerYear || 4
  
  // Calculate card height based on lifespan (min 30px, max 200px)
  const cardHeight = Math.max(30, Math.min(200, lifespan * pixelsPerYear))

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-border" />
      <div
        className="rounded-lg border transition-all cursor-pointer"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: selected ? 'var(--accent)' : 'var(--border)',
          minHeight: cardHeight,
          width: 160,
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Header */}
        <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
            {data.label || 'Scholar'}
          </div>
          {years && (
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {years}
            </div>
          )}
        </div>
        
        {/* Body - expand for important info */}
        {expanded && (
          <div className="px-3 py-2 space-y-1">
            <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              Lifespan: {lifespan} years
            </div>
            {data.madhhab && (
              <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                Madhhab: {data.madhhab}
              </div>
            )}
            {data.creed && (
              <div className="text-[10px]" style={{ color: 'var(--accent)' }}>
                Creed: {data.creed}
              </div>
            )}
          </div>
        )}
        
        {/* Footer badges - always visible */}
        {!expanded && (
          <div className="px-3 py-1.5 flex gap-1">
            {data.madhhab && (
              <span 
                className="text-[8px] px-1.5 py-0.5 rounded"
                style={{ 
                  backgroundColor: 'var(--surface-hover)',
                  color: 'var(--text-secondary)',
                }}
              >
                {data.madhhab}
              </span>
            )}
            {data.creed && (
              <span 
                className="text-[8px] px-1.5 py-0.5 rounded"
                style={{ 
                  backgroundColor: 'var(--accent)',
                  color: 'var(--surface)',
                }}
              >
                {data.creed}
              </span>
            )}
          </div>
        )}
        
        {/* Click hint */}
        {expanded && (
          <div className="px-3 py-1 text-[10px] text-center border-t" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
            Click to collapse
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-border" />
    </>
  )
}

export default memo(ScholarNode)
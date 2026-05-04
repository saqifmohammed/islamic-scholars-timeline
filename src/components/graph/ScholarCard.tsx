'use client'

import { useState, memo } from 'react'
import { GraphNode } from '@/types'

interface ScholarCardProps {
  x: number
  y: number
  width: number
  height: number
  data: GraphNode
  onClick?: () => void
}

function ScholarCard({ x, y, width, height, data, onClick }: ScholarCardProps) {
  const [expanded, setExpanded] = useState(false)
  
  const birthYear = data.data.birthYear
  const deathYear = data.data.deathYear
  const lifespan = deathYear && birthYear ? deathYear - birthYear : null
  const years = birthYear 
    ? `${birthYear}${deathYear ? ' - ' + deathYear : ''}`
    : ''

  return (
    <g 
      transform={`translate(${x}, ${y})`}
      onClick={(e) => {
        e.stopPropagation()
        setExpanded(!expanded)
        onClick?.()
      }}
      style={{ cursor: 'pointer' }}
    >
      {/* Card background */}
      <rect
        width={width}
        height={height}
        rx="8"
        ry="8"
        fill="var(--surface)"
        stroke="var(--border)"
        strokeWidth="1"
      />
      
      {/* Header - name */}
      <foreignObject x="0" y="0" width={width} height={expanded ? 60 : 50}>
        <div className="p-3 h-full overflow-hidden" style={{ borderBottom: expanded ? '1px solid var(--border)' : 'none' }}>
          <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {data.label}
          </div>
          {years && (
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {years}
            </div>
          )}
        </div>
      </foreignObject>

      {/* Expanded content */}
      {expanded && (
        <>
          {/* Lifespan */}
          {lifespan && (
            <foreignObject x="0" y="50" width={width} height="25">
              <div className="px-3 py-1">
                <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                  Age: {lifespan} years
                </div>
              </div>
            </foreignObject>
          )}

          {/* Madhhab */}
          {data.data.madhhab && (
            <foreignObject x="0" y={lifespan ? 75 : 50} width={width} height="25">
              <div className="px-3 py-1">
                <span 
                  className="text-[8px] px-2 py-0.5 rounded"
                  style={{ 
                    backgroundColor: 'var(--surface-hover)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {data.data.madhhab}
                </span>
              </div>
            </foreignObject>
          )}

          {/* Creed */}
          {data.data.creed && (
            <foreignObject 
              x="0" 
              y={lifespan ? (data.data.madhhab ? 100 : 75) : (data.data.madhhab ? 75 : 50)} 
              width={width} 
              height="25"
            >
              <div className="px-3 py-1">
                <span 
                  className="text-[8px] px-2 py-0.5 rounded"
                  style={{ 
                    backgroundColor: 'var(--accent)',
                    color: 'var(--surface)',
                  }}
                >
                  {data.data.creed}
                </span>
              </div>
            </foreignObject>
          )}

          {/* Click hint */}
          <foreignObject x="0" y={height - 25} width={width} height="25">
            <div 
              className="px-3 py-1 text-center text-[10px]"
              style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}
            >
              Click to collapse
            </div>
          </foreignObject>
        </>
      )}

      {/* Collapsed badges */}
      {!expanded && (
        <>
          {data.data.madhhab && (
            <foreignObject 
              x="8" 
              y={height - 28} 
              width={width - 16} 
              height="20"
            >
              <span 
                className="text-[8px] px-1.5 py-0.5 rounded"
                style={{ 
                  backgroundColor: 'var(--surface-hover)',
                  color: 'var(--text-secondary)',
                }}
              >
                {data.data.madhhab}
              </span>
            </foreignObject>
          )}
          {data.data.creed && !data.data.madhhab && (
            <foreignObject 
              x="8" 
              y={height - 28} 
              width={width - 16} 
              height="20"
            >
              <span 
                className="text-[8px] px-1.5 py-0.5 rounded"
                style={{ 
                  backgroundColor: 'var(--accent)',
                  color: 'var(--surface)',
                }}
              >
                {data.data.creed}
              </span>
            </foreignObject>
          )}
        </>
      )}
    </g>
  )
}

export default memo(ScholarCard)
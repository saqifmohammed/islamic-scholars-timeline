'use client'

import { useState, memo, useCallback } from 'react'
import { GraphNode } from '@/types'

interface ScholarCardProps {
  x: number
  y: number
  width: number
  height: number
  data: GraphNode
  onClick?: () => void
  isSelected?: boolean
  pixelsPerYear: number
}

function ScholarCard({ 
  x, 
  y, 
  width, 
  height, 
  data, 
  onClick,
  isSelected = false,
  pixelsPerYear
}: ScholarCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const birthYear = data.data.birthYear
  const deathYear = data.data.deathYear
  const lifespan = deathYear && birthYear ? deathYear - birthYear : 0
  const years = birthYear 
    ? `${birthYear}${deathYear ? ' - ' + deathYear : ''}`
    : ''

  // Calculate positions for internal markers
  const birthMarkerY = 0
  const deathMarkerY = height

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.()
  }, [onClick])

  return (
    <g 
      transform={`translate(${x}, ${y})`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        cursor: 'pointer',
        opacity: isSelected ? 1 : isHovered ? 0.9 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Card background with shadow when selected */}
      <rect
        width={width}
        height={height}
        rx="6"
        ry="6"
        fill="var(--surface)"
        stroke={isSelected ? 'var(--accent)' : isHovered ? 'var(--text-secondary)' : 'var(--border)'}
        strokeWidth={isSelected ? 2 : 1}
        style={{
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
          filter: isSelected ? 'drop-shadow(0 0 8px var(--accent))' : 'none',
        }}
      />

      {/* LEFT EDGE LIFELINE - Visual lifespan indicator */}
      <rect
        x="4"
        y="8"
        width="3"
        height={height - 16}
        rx="1.5"
        fill="var(--accent)"
        opacity="0.8"
      />

      {/* Birth year marker (top triangle) */}
      <polygon
        points={`8,8 12,14 4,14`}
        fill="var(--text-primary)"
      />

      {/* Death year marker (bottom triangle) */}
      <polygon
        points={`8,${height - 8} 12,${height - 14} 4,${height - 14}`}
        fill="var(--text-secondary)"
      />

      {/* Internal year ticks for tall cards */}
      {lifespan > 20 && pixelsPerYear >= 2 && (
        <>
          {Array.from({ length: Math.floor(lifespan / 10) }, (_, i) => {
            const tickY = 20 + (i * 10 * pixelsPerYear)
            if (tickY > 20 && tickY < height - 20) {
              return (
                <line
                  key={i}
                  x1="10"
                  y1={tickY}
                  x2="20"
                  y2={tickY}
                  stroke="var(--border)"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              )
            }
            return null
          })}
        </>
      )}

      {/* Header - Name and Years */}
      <foreignObject x="16" y="6" width={width - 24} height="36">
        <div className="h-full overflow-hidden">
          <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {data.label}
          </div>
          {years && (
            <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              {years}
              {lifespan > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[9px]" 
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--surface)' }}>
                  {lifespan}y
                </span>
              )}
            </div>
          )}
        </div>
      </foreignObject>

      {/* Footer - Madhhab and Creed badges */}
      <foreignObject x="16" y={height - 32} width={width - 24} height="28">
        <div className="h-full flex items-center gap-1.5 flex-wrap">
          {data.data.madhhab && (
            <span 
              className="text-[9px] px-2 py-0.5 rounded"
              style={{ 
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-secondary)',
              }}
            >
              {data.data.madhhab}
            </span>
          )}
          {data.data.creed && (
            <span 
              className="text-[9px] px-2 py-0.5 rounded"
              style={{ 
                backgroundColor: 'var(--accent)',
                color: 'var(--surface)',
              }}
            >
              {data.data.creed}
            </span>
          )}
        </div>
      </foreignObject>

      {/* Selected indicator glow */}
      {isSelected && (
        <rect
          width={width}
          height={height}
          rx="6"
          ry="6"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          opacity="0.5"
        >
          <animate
            attributeName="opacity"
            values="0.5;0.2;0.5"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>
      )}
    </g>
  )
}

export default memo(ScholarCard)
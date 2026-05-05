'use client'

import { useState, memo, useCallback } from 'react'
import { GraphNode, GraphEdge } from '@/types'

interface ScholarCardProps {
  x: number
  y: number
  width: number
  height: number
  data: GraphNode
  nodes?: GraphNode[]
  edges?: GraphEdge[]
  onNavigate?: (nodeId: string) => void
  onClick?: () => void
  isSelected?: boolean
  isDimmed?: boolean
  isConnected?: boolean
  pixelsPerYear: number
}

function ScholarCard({ 
  x, 
  y, 
  width, 
  height, 
  data,
  nodes = [],
  edges = [],
  onNavigate,
  onClick,
  isSelected = false,
  isDimmed = false,
  isConnected = false,
  pixelsPerYear
}: ScholarCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const birthYear = data.data.birthYear
  const deathYear = data.data.deathYear
  const lifespan = deathYear && birthYear ? deathYear - birthYear : 0
  const years = birthYear 
    ? `${birthYear}${deathYear ? ' - ' + deathYear : ''}`
    : ''

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.()
  }, [onClick])

  const handleTeacherClick = useCallback((e: React.MouseEvent, teacherId: string) => {
    e.stopPropagation()
    onNavigate?.(teacherId)
  }, [onNavigate])

  const handleStudentClick = useCallback((e: React.MouseEvent, studentId: string) => {
    e.stopPropagation()
    onNavigate?.(studentId)
  }, [onNavigate])

  const teachers = edges.filter(e => e.target === data.id).map(e => e.source)
  const students = edges.filter(e => e.source === data.id).map(e => e.target)
  const books = data.data.books || []

  const nodeMap = new Map(nodes.map(n => [n.id, n.label]))

  const getLabel = (id: string) => nodeMap.get(id) || id

  const booksHeight = isSelected && books.length > 0 ? 20 + Math.min(books.length, 5) * 16 : 0
  const expandedHeight = isSelected ? Math.max(height, 220 + booksHeight) : height

  if (isDimmed && !isSelected && !isConnected) {
    return (
      <g 
        transform={`translate(${x}, ${y})`}
        onClick={handleClick}
        style={{ 
          cursor: 'pointer',
          opacity: 0.15,
          filter: 'blur(2px)',
          transition: 'opacity 0.3s ease, filter 0.3s ease',
        }}
      >
        <rect
          width={width}
          height={Math.max(60, lifespan * pixelsPerYear)}
          rx="6"
          ry="6"
          fill="var(--surface)"
          stroke="var(--border)"
          strokeWidth="1"
        />
      </g>
    )
  }

  if (isConnected && !isSelected) {
    const connectedHeight = Math.max(height, 60)
    return (
      <g
        transform={`translate(${x}, ${y})`}
        onClick={handleClick}
        style={{ cursor: 'pointer', transition: 'opacity 0.3s ease' }}
      >
        <rect
          width={width}
          height={connectedHeight}
          rx="6"
          ry="6"
          fill="var(--surface)"
          stroke="var(--accent)"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 8px var(--accent))' }}
        />
        {/* Accent lifeline */}
        <rect x="4" y="8" width="3" height={connectedHeight - 16} rx="1.5" fill="var(--accent)" opacity="0.8" />
        {/* Name */}
        <foreignObject x="16" y="6" width={width - 24} height="36">
          <div className="h-full overflow-hidden">
            <div className="text-sm font-semibold truncate" style={{ color: 'var(--accent)' }}>
              {data.label}
            </div>
            {years && (
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {years}
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    )
  }

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
        height={expandedHeight}
        rx="6"
        ry="6"
        fill="var(--surface)"
        stroke={isSelected ? 'var(--accent)' : isHovered ? 'var(--text-secondary)' : 'var(--border)'}
        strokeWidth={isSelected ? 2 : 1}
        style={{
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
          filter: isSelected ? 'drop-shadow(0 0 12px var(--accent))' : 'none',
        }}
      />

      {/* LEFT EDGE LIFELINE - Visual lifespan indicator */}
      <rect
        x="4"
        y="8"
        width="3"
        height={expandedHeight - 16}
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
        points={`8,${expandedHeight - 8} 12,${expandedHeight - 14} 4,${expandedHeight - 14}`}
        fill="var(--text-secondary)"
      />

      {/* Internal year ticks for tall cards */}
      {lifespan > 20 && pixelsPerYear >= 2 && (
        <>
          {Array.from({ length: Math.floor(lifespan / 10) }, (_, i) => {
            const tickY = 20 + (i * 10 * pixelsPerYear)
            if (tickY > 20 && tickY < expandedHeight - 20) {
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
      <foreignObject x="16" y={expandedHeight - 32} width={width - 24} height="28">
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

      {/* Expanded content - Teachers */}
      {isSelected && teachers.length > 0 && (
        <foreignObject x="16" y={48} width={width - 24} height="24">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>Teachers:</span>
            {teachers.slice(0, 3).map(teacherId => (
              <button
                key={teacherId}
                onClick={(e) => handleTeacherClick(e, teacherId)}
                className="text-[9px] px-1.5 py-0.5 rounded hover:opacity-80 transition-opacity"
                style={{ 
                  backgroundColor: 'var(--surface-hover)', 
                  color: 'var(--accent)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {getLabel(teacherId)}
              </button>
            ))}
            {teachers.length > 3 && (
              <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                +{teachers.length - 3}
              </span>
            )}
          </div>
        </foreignObject>
      )}

      {/* Expanded content - Students */}
      {isSelected && students.length > 0 && (
        <foreignObject x="16" y={76} width={width - 24} height="24">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>Students:</span>
            {students.slice(0, 3).map(studentId => (
              <button
                key={studentId}
                onClick={(e) => handleStudentClick(e, studentId)}
                className="text-[9px] px-1.5 py-0.5 rounded hover:opacity-80 transition-opacity"
                style={{ 
                  backgroundColor: 'var(--surface-hover)', 
                  color: 'var(--accent)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {getLabel(studentId)}
              </button>
            ))}
            {students.length > 3 && (
              <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                +{students.length - 3}
              </span>
            )}
          </div>
        </foreignObject>
      )}

      {/* Expanded content - Region */}
      {isSelected && (
        <foreignObject x="16" y={isSelected && (teachers.length > 0 || students.length > 0) ? 108 : 48} width={width - 24} height="20">
          <div className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>
            {data.data.generation && <span className="capitalize">{data.data.generation}</span>}
          </div>
        </foreignObject>
      )}

      {/* Expanded content - Books */}
      {isSelected && books.length > 0 && (() => {
        const booksY = (teachers.length > 0 || students.length > 0) ? 132 : 72
        return (
          <foreignObject x="16" y={booksY} width={width - 24} height={booksHeight}>
            <div style={{ color: 'var(--text-secondary)' }}>
              <div className="text-[9px] font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Books:
              </div>
              {books.slice(0, 5).map(book => (
                <div
                  key={book.id}
                  className="text-[9px] truncate py-0.5 px-1.5 rounded mb-0.5"
                  style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-primary)' }}
                  title={book.title}
                >
                  📖 {book.title}
                </div>
              ))}
              {books.length > 5 && (
                <div className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                  +{books.length - 5} more
                </div>
              )}
            </div>
          </foreignObject>
        )
      })()}

      {/* Selected indicator glow */}
      {isSelected && (
        <rect
          width={width}
          height={expandedHeight}
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
'use client'

import { useMemo, useCallback } from 'react'
import { GraphNode, GraphEdge } from '@/types'
import { 
  calculateLayout, 
  calculateConnectionLines, 
  getVisibleAssignments,
  LaneAssignment,
  ConnectionLine,
  LayoutConfig 
} from '@/lib/timeline-layout'
import ScholarCard from './ScholarCard'

interface TimelineCanvasProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeClick?: (nodeId: string) => void
  scrollY?: number
  pixelsPerYear?: number
  startYear?: number
  viewportHeight?: number
}

const DEFAULT_CONFIG = {
  startYear: 570,
  pixelsPerYear: 4,
  laneWidth: 280,
  laneGap: 40,
  minCardHeight: 80,
  minSpacing: 5,
}

export default function TimelineCanvas({ 
  nodes, 
  edges, 
  onNodeClick,
  scrollY = 0,
  pixelsPerYear = 4,
  startYear = 570,
  viewportHeight = 600
}: TimelineCanvasProps) {
  const config: LayoutConfig = useMemo(() => ({
    ...DEFAULT_CONFIG,
    pixelsPerYear,
    startYear,
  }), [pixelsPerYear, startYear])

  // Calculate layout with lane detection
  const { assignments, config: layoutConfig } = useMemo(() => 
    calculateLayout(nodes, config), 
    [nodes, config]
  )

  // Get visible nodes only (virtual rendering)
  const visibleAssignments = useMemo(() => 
    getVisibleAssignments(assignments, scrollY, viewportHeight),
    [assignments, scrollY, viewportHeight]
  )

  // Calculate connection lines
  const connectionLines = useMemo(() => 
    calculateConnectionLines(assignments, edges, nodes, layoutConfig),
    [assignments, edges, nodes, layoutConfig]
  )

  // Create map for quick lookup
  const assignmentMap = useMemo(() => 
    new Map(assignments.map(a => [a.id, a])),
    [assignments]
  )

  const handleCardClick = useCallback((nodeId: string) => {
    onNodeClick?.(nodeId)
  }, [onNodeClick])

  // Calculate total dimensions
  const totalHeight = useMemo(() => {
    if (assignments.length === 0) return 0
    const maxY = Math.max(...assignments.map(a => a.y + a.height))
    return maxY + 500 // buffer
  }, [assignments])

  const totalWidth = useMemo(() => {
    const maxLane = Math.max(...assignments.map(a => a.lane), 0)
    return (maxLane + 1) * (layoutConfig.laneWidth + layoutConfig.laneGap) + 100
  }, [assignments, layoutConfig])

  return (
    <div 
      className="w-full h-full overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* SVG canvas with transform for scrolling */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${totalWidth} ${viewportHeight}`}
        style={{
          transform: `translateY(${-scrollY}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Background grid lines */}
        <defs>
          <pattern id="grid" width="100" height={pixelsPerYear * 10} patternUnits="userSpaceOnUse">
            <line 
              x1="0" 
              y1={pixelsPerYear * 10 - 1} 
              x2="100%" 
              y2={pixelsPerYear * 10 - 1} 
              stroke="var(--border)" 
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height={totalHeight} fill="url(#grid)" />

        {/* Connection lines (behind cards) */}
        {connectionLines.map((line: ConnectionLine) => (
          <path
            key={line.id}
            d={line.path}
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth="1.5"
            opacity="0.4"
            strokeDasharray="4,2"
          />
        ))}

        {/* Scholar cards */}
        {visibleAssignments.map((assignment: LaneAssignment) => {
          const node = nodes.find(n => n.id === assignment.id)
          if (!node) return null
          
          const x = assignment.lane * (layoutConfig.laneWidth + layoutConfig.laneGap)
          
          return (
            <ScholarCard
              key={assignment.id}
              x={x}
              y={assignment.y}
              width={layoutConfig.laneWidth}
              height={assignment.height}
              data={node}
              onClick={() => handleCardClick(node.id)}
            />
          )
        })}
      </svg>

      {/* Scroll container for interaction */}
      <div 
        className="absolute inset-0 overflow-y-scroll"
        style={{ 
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <div style={{ height: totalHeight }} />
      </div>
    </div>
  )
}
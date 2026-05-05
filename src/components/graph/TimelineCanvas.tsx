'use client'

import { useMemo, useCallback, useEffect, useRef, useState } from 'react'
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
  onNodeClick?: (nodeId: string, x: number, y: number) => void
  scrollY?: number
  pixelsPerYear?: number
  startYear?: number
  viewportHeight?: number
  selectedNodeId?: string | null
}

const DEFAULT_CONFIG: LayoutConfig = {
  startYear: 570,
  pixelsPerYear: 4,
  laneWidth: 320,
  laneGap: 60,
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
  viewportHeight = 600,
  selectedNodeId = null
}: TimelineCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [containerWidth, setContainerWidth] = useState(800)

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

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

  // Calculate total dimensions
  const totalHeight = useMemo(() => {
    if (assignments.length === 0) return viewportHeight + 500
    const maxY = Math.max(...assignments.map(a => a.y + a.height))
    return maxY + 500
  }, [assignments, viewportHeight])

  const totalWidth = useMemo(() => {
    const maxLane = Math.max(...assignments.map(a => a.lane), 0)
    return (maxLane + 1) * (layoutConfig.laneWidth + layoutConfig.laneGap) + 100
  }, [assignments, layoutConfig])

  // Calculate visible nodes (virtual rendering)
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
    const assignment = assignmentMap.get(nodeId)
    if (assignment && containerRef.current) {
      const cardX = assignment.lane * (layoutConfig.laneWidth + layoutConfig.laneGap)
      const cardY = assignment.y
      onNodeClick?.(nodeId, cardX, cardY)
    }
  }, [assignmentMap, layoutConfig, onNodeClick])

  // Separate selected and non-selected for render order (selected last)
  const nonSelected = useMemo(() => 
    visibleAssignments.filter(a => a.id !== selectedNodeId),
    [visibleAssignments, selectedNodeId]
  )
  
  const selectedAssignment = useMemo(() => 
    visibleAssignments.find(a => a.id === selectedNodeId),
    [visibleAssignments, selectedNodeId]
  )

  const xOffset = 0

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-hidden relative"
      style={{ 
        backgroundColor: 'var(--background)',
      }}
      onClick={() => onNodeClick?.('', -1, -1)}
    >
      <svg
        ref={svgRef}
        width={containerWidth}
        height={totalHeight}
        viewBox={`0 0 ${containerWidth} ${totalHeight}`}
        style={{
          display: 'block',
        }}
      >
        {/* Background */}
        <rect 
          width={containerWidth} 
          height={totalHeight} 
          fill="var(--background)" 
        />
        
        {/* Scrollable content group - apply transform here */}
        <g transform={`translate(0, ${-scrollY})`}>
          {/* Grid pattern */}
          <defs>
            <pattern 
              id="timeline-grid" 
              width={containerWidth} 
              height={pixelsPerYear * 10} 
              patternUnits="userSpaceOnUse"
            >
              <line 
                x1="0" 
                y1={pixelsPerYear * 10 - 1} 
                x2={containerWidth} 
                y2={pixelsPerYear * 10 - 1} 
                stroke="var(--border)" 
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect 
            width={containerWidth} 
            height={totalHeight} 
            fill="url(#timeline-grid)" 
          />

          {/* Connection lines */}
          {connectionLines.map((line: ConnectionLine) => {
            const sourceAssignment = assignmentMap.get(line.sourceId)
            const targetAssignment = assignmentMap.get(line.targetId)
            if (!sourceAssignment || !targetAssignment) return null
            
            const sourceX = xOffset + sourceAssignment.lane * (layoutConfig.laneWidth + layoutConfig.laneGap) + layoutConfig.laneWidth
            const sourceY = sourceAssignment.y + sourceAssignment.height
            const targetX = xOffset + targetAssignment.lane * (layoutConfig.laneWidth + layoutConfig.laneGap) + layoutConfig.laneWidth / 2
            const targetY = targetAssignment.y
            
            const isHighlighted = selectedNodeId === line.sourceId || selectedNodeId === line.targetId
            const midY = (sourceY + targetY) / 2
            
            return (
              <path
                key={line.id}
                d={`M ${sourceX} ${sourceY} C ${sourceX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`}
                fill="none"
                stroke={isHighlighted ? 'var(--accent)' : 'var(--text-secondary)'}
                strokeWidth={isHighlighted ? 2 : 1}
                opacity={isHighlighted ? 1 : 0.3}
                strokeDasharray={isHighlighted ? 'none' : '4,2'}
                style={{
                  transition: 'stroke 0.2s ease, opacity 0.2s ease',
                }}
              />
            )
          })}

          {/* Non-selected cards first */}
          {nonSelected.map((assignment) => {
            const node = nodes.find(n => n.id === assignment.id)
            if (!node) return null
            
            const x = xOffset + assignment.lane * (layoutConfig.laneWidth + layoutConfig.laneGap)
            
            return (
              <ScholarCard
                key={assignment.id}
                x={x}
                y={assignment.y}
                width={layoutConfig.laneWidth}
                height={assignment.height}
                data={node}
                nodes={nodes}
                edges={edges}
                onNavigate={handleCardClick}
                onClick={() => handleCardClick(node.id)}
                isSelected={false}
                pixelsPerYear={pixelsPerYear}
                isDimmed={!!selectedNodeId}
              />
            )
          })}

          {/* Selected card last (rendered on top) */}
          {selectedAssignment && (() => {
            const node = nodes.find(n => n.id === selectedAssignment.id)
            if (!node) return null
            
            const x = xOffset + selectedAssignment.lane * (layoutConfig.laneWidth + layoutConfig.laneGap)
            
            return (
              <ScholarCard
                key={selectedAssignment.id}
                x={x}
                y={selectedAssignment.y}
                width={layoutConfig.laneWidth}
                height={selectedAssignment.height}
                data={node}
                nodes={nodes}
                edges={edges}
                onNavigate={handleCardClick}
                onClick={() => handleCardClick(node.id)}
                isSelected={true}
                pixelsPerYear={pixelsPerYear}
                isDimmed={false}
              />
            )
          })()}
        </g>
      </svg>
    </div>
  )
}
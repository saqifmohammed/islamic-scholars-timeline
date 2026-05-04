import { GraphNode, GraphEdge } from '@/types'

export interface LayoutConfig {
  startYear: number
  pixelsPerYear: number
  laneWidth: number
  laneGap: number
  minCardHeight: number
  minSpacing: number // years between cards in same lane
}

export interface LaneAssignment {
  id: string
  lane: number
  y: number
  height: number
  birthYear: number
  deathYear: number | null
}

export interface ConnectionLine {
  id: string
  sourceId: string
  targetId: string
  path: string // SVG path d attribute
}

const DEFAULT_CONFIG: LayoutConfig = {
  startYear: 570,
  pixelsPerYear: 4,
  laneWidth: 280,
  laneGap: 40,
  minCardHeight: 80,
  minSpacing: 5, // minimum 5 years gap between scholar end and next scholar start in same lane
}

export function calculateLayout(
  nodes: GraphNode[],
  config: Partial<LayoutConfig> = {}
): { assignments: LaneAssignment[]; config: LayoutConfig } {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  
  // Sort scholars by birth year
  const sortedNodes = [...nodes].sort((a, b) => {
    const aBirth = a.data.birthYear || 1900
    const bBirth = b.data.birthYear || 1900
    return aBirth - bBirth
  })

  // Assign lanes using collision detection
  const lanes: LaneAssignment[][] = []
  const assignments: LaneAssignment[] = []

  for (const node of sortedNodes) {
    const birthYear = node.data.birthYear || 1900
    const deathYear = node.data.deathYear || null
    const lifespan = deathYear && birthYear ? deathYear - birthYear : 30
    
    // Calculate card height
    const height = Math.max(cfg.minCardHeight, lifespan * cfg.pixelsPerYear)
    
    // Y position from start of timeline
    const y = (birthYear - cfg.startYear) * cfg.pixelsPerYear
    
    // Find first available lane
    let assignedLane = 0
    
    for (let laneIndex = 0; ; laneIndex++) {
      // Get the last scholar in this lane
      const lane = lanes[laneIndex]
      
      if (!lane || lane.length === 0) {
        // Empty lane - use this one
        assignedLane = laneIndex
        lanes[laneIndex] = [{ id: node.id, lane: laneIndex, y, height, birthYear, deathYear }]
        break
      }
      
      // Check collision with last scholar in lane
      const lastInLane = lane[lane.length - 1]
      const lastEndYear = lastInLane.deathYear || lastInLane.birthYear + 30
      
      // If no collision (current birth is after last death + gap), use this lane
      if (birthYear > lastEndYear + cfg.minSpacing) {
        assignedLane = laneIndex
        lane.push({ id: node.id, lane: laneIndex, y, height, birthYear, deathYear })
        break
      }
      // Otherwise continue to next lane
    }
    
    assignments.push({
      id: node.id,
      lane: assignedLane,
      y,
      height,
      birthYear,
      deathYear,
    })
  }

  return { assignments, config: cfg }
}

export function calculateConnectionLines(
  assignments: LaneAssignment[],
  edges: GraphEdge[],
  nodes: GraphNode[],
  config: LayoutConfig
): ConnectionLine[] {
  const nodeMap = new Map(nodes.map(n => [n.id, n]))
  const assignedMap = new Map(assignments.map(a => [a.id, a]))
  
  const CARD_WIDTH = config.laneWidth
  const LANE_GAP = config.laneGap
  
  return edges.map(edge => {
    const sourceAssignment = assignedMap.get(edge.source)
    const targetAssignment = assignedMap.get(edge.target)
    
    if (!sourceAssignment || !targetAssignment) return null
    
    const sourceLane = sourceAssignment.lane
    const targetLane = targetAssignment.lane
    
    // Calculate edge positions
    const sourceX = sourceLane * (CARD_WIDTH + LANE_GAP) + CARD_WIDTH
    const sourceY = sourceAssignment.y + sourceAssignment.height // bottom of source card
    
    const targetX = targetLane * (CARD_WIDTH + LANE_GAP) + CARD_WIDTH / 2
    const targetY = targetAssignment.y // top of target card
    
    // Create bezier curve path
    const midY = (sourceY + targetY) / 2
    const path = `M ${sourceX} ${sourceY} 
                C ${sourceX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`
    
    return {
      id: edge.id,
      sourceId: edge.source,
      targetId: edge.target,
      path,
    }
  }).filter(Boolean) as ConnectionLine[]
}

export function calculateViewport(
  assignments: LaneAssignment[],
  config: LayoutConfig,
  viewportHeight: number
) {
  if (assignments.length === 0) return { minY: 0, maxY: viewportHeight, lanes: 0 }
  
  const maxY = Math.max(...assignments.map(a => a.y + a.height))
  const maxLane = Math.max(...assignments.map(a => a.lane))
  
  return {
    minY: 0,
    maxY: maxY,
    lanes: maxLane + 1,
  }
}

export function getVisibleAssignments(
  assignments: LaneAssignment[],
  scrollY: number,
  viewportHeight: number,
  buffer: number = 200
): LaneAssignment[] {
  const visibleMin = scrollY - buffer
  const visibleMax = scrollY + viewportHeight + buffer
  
  return assignments.filter(a => {
    const cardTop = a.y
    const cardBottom = a.y + a.height
    return cardBottom >= visibleMin && cardTop <= visibleMax
  })
}
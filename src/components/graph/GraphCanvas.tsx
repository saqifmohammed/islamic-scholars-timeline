'use client'

import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { GraphNode, GraphEdge } from '@/types'
import ScholarNode from './ScholarNode'

interface GraphCanvasProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeClick?: (nodeId: string) => void
  scrollY?: number
  pixelsPerYear?: number
  startYear?: number
  zoom?: number
}

const nodeTypes = {
  scholar: ScholarNode as any,
}

const START_YEAR = 570

export default function GraphCanvas({ 
  nodes, 
  edges, 
  onNodeClick,
  scrollY = 0,
  pixelsPerYear = 4,
  startYear = START_YEAR,
  zoom = 1
}: GraphCanvasProps) {
  // Position nodes - timeline based with lifespan height
  const positionedNodes: Node[] = useMemo(() => {
    if (nodes.length === 0) return []

    const genOrder = ['sahaba', 'tabiun', 'atba_al_tabiin', 'imams', 'scholars']
    
    return nodes.map((node) => {
      const birthYear = node.data.birthYear || 1900
      const deathYear = node.data.deathYear
      const lifespan = deathYear && birthYear ? deathYear - birthYear : 30
      const gen = node.data.generation || 'scholars'
      
      // X: based on generation
      const genIndex = genOrder.indexOf(gen)
      const xBase = 100 + (genIndex * 220)
      
      // Y: based on birth year (timeline position)
      const yPos = (birthYear - startYear) * pixelsPerYear - scrollY
      
      return {
        id: node.id,
        type: 'scholar',
        position: { x: xBase, y: yPos },
        data: {
          ...node.data,
          label: node.label,
          lifespan: lifespan,
          pixelsPerYear: pixelsPerYear,
        },
      }
    })
  }, [nodes, scrollY, pixelsPerYear, startYear])

  const edgeList: Edge[] = useMemo(() => {
    return edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: true,
      style: { 
        stroke: 'var(--text-secondary)', 
        strokeWidth: 1.5,
        opacity: 0.4
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'var(--text-secondary)',
      },
    }))
  }, [edges])

  const [flowNodes, setNodes, onNodesChange] = useNodesState(positionedNodes)
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edgeList)

  const onNodeClick_ = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeClick?.(node.id)
    },
    [onNodeClick]
  )

  // Calculate default zoom based on zoom level
  const defaultZoom = zoom < 1 ? 0.3 : zoom < 1.5 ? 0.4 : 0.5

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick_}
        nodeTypes={nodeTypes}
        fitView={false}
        nodesDraggable={false}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 50, zoom: defaultZoom }}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          variant={BackgroundVariant.Lines} 
          color="var(--border)" 
          gap={20}
          style={{ opacity: 0.15 }}
        />
      </ReactFlow>
    </div>
  )
}
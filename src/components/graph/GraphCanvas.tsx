'use client'

import { useCallback, useMemo, useEffect, useState, useRef } from 'react'
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState, 
  useEdgesState,
  Node,
  Edge,
  Connection,
  addEdge,
  NodeTypes,
  MarkerType
} from 'reactflow'
import 'reactflow/dist/style.css'
import { GraphNode, GraphEdge } from '@/types'
import ScholarNode from './ScholarNode'

interface GraphCanvasProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeClick?: (nodeId: string) => void
  selectedNodeId?: string | null
}

const nodeTypes: NodeTypes = {
  scholar: ScholarNode,
}

export default function GraphCanvas({ 
  nodes: graphNodes, 
  edges: graphEdges, 
  onNodeClick,
  selectedNodeId 
}: GraphCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Measure container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Convert graph nodes to React Flow nodes
  useEffect(() => {
    if (!graphNodes.length || containerSize.width === 0) return

    // Calculate positions in a grid/layout
    const centerX = containerSize.width / 2
    const centerY = containerSize.height / 2
    
    // Group by generation for vertical layering
    const generationGroups: Record<string, GraphNode[]> = {}
    graphNodes.forEach(node => {
      const gen = node.data.generation || 'scholars'
      if (!generationGroups[gen]) generationGroups[gen] = []
      generationGroups[gen].push(node)
    })

    const generationOrder = ['sahaba', 'tabiun', 'atba_al_tabiin', 'imams', 'scholars']
    const ySpacing = 200
    const xSpacing = 280

    const flowNodes: Node[] = []
    let yOffset = -((generationOrder.length - 1) * ySpacing) / 2

    generationOrder.forEach((gen, genIndex) => {
      const genNodes = generationGroups[gen] || []
      if (!genNodes.length) return

      const xOffset = -(genNodes.length - 1) * xSpacing / 2

      genNodes.forEach((node, nodeIndex) => {
        const birthYear = node.data.birthYear || 700
        const deathYear = node.data.deathYear || 800
        
        flowNodes.push({
          id: node.id,
          type: 'scholar',
          position: { 
            x: centerX + xOffset + nodeIndex * xSpacing, 
            y: centerY + yOffset + genIndex * ySpacing 
          },
          data: { 
            label: node.label,
            scholar: node.data,
            isSelected: node.id === selectedNodeId
          },
        })
      })
    })

    const flowEdges: Edge[] = graphEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: false,
      style: { stroke: 'var(--text-secondary)', strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--text-secondary)' },
    }))

    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [graphNodes, graphEdges, containerSize, selectedNodeId])

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    onNodeClick?.(node.id)
  }, [onNodeClick])

  return (
    <div ref={containerRef} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.25}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background 
          color="var(--border)" 
          gap={50} 
          style={{ backgroundColor: 'var(--background)' }} 
        />
        <Controls 
          style={{ 
            backgroundColor: 'var(--surface)', 
            borderColor: 'var(--border)',
            borderRadius: '8px'
          }} 
        />
        <MiniMap 
          nodeColor={(node) => {
            const gen = node.data?.scholar?.generation
            const colors: Record<string, string> = {
              sahaba: 'var(--sahaba)',
              tabiun: 'var(--tabiun)',
              atba_al_tabiin: 'var(--atba-al-tabiin)',
              imams: 'var(--imams)',
              scholars: 'var(--scholars)'
            }
            return colors[gen || 'scholars'] || 'var(--accent)'
          }}
          maskColor="rgba(0,0,0,0.5)"
          style={{ 
            backgroundColor: 'var(--surface)', 
            border: '1px solid var(--border)',
            borderRadius: '8px'
          }}
        />
      </ReactFlow>
    </div>
  )
}
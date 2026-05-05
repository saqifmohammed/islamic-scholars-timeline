'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/ui/Navbar'
import ScholarDetail from '@/components/panels/ScholarDetail'
import FilterSidebar from '@/components/panels/FilterSidebar'
import { GraphNode, GraphEdge, Generation, Madhhab } from '@/types'

const ReactFlowGraph = dynamic(() => import('@/components/graph/GraphCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading timeline...</span>
    </div>
  ),
})

export default function Home() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedScholarId, setSelectedScholarId] = useState<string | null>(null)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [filters, setFilters] = useState({
    generation: null as Generation | null,
    madhhab: null as Madhhab | null,
    minYear: null as number | null,
    maxYear: null as number | null,
  })

  // Measure viewport
  useEffect(() => {
    const updateDimensions = () => {
      const mainEl = document.querySelector('main')
      if (mainEl) {
        setViewportWidth(mainEl.clientWidth)
        setViewportHeight(mainEl.clientHeight)
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Fetch data
  useEffect(() => {
    const timer = setTimeout(() => fetchGraphData(), 200)
    return () => clearTimeout(timer)
  }, [filters])

  const fetchGraphData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.generation) params.set('generation', filters.generation)
      if (filters.madhhab) params.set('madhhab', filters.madhhab)
      if (filters.minYear) params.set('minYear', filters.minYear.toString())
      if (filters.maxYear) params.set('maxYear', filters.maxYear.toString())

      const res = await fetch(`/api/graph?${params.toString()}`)
      const data = await res.json()
      setNodes(data.nodes || [])
      setEdges(data.edges || [])
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const selectedScholar = useMemo(() => 
    nodes.find(n => n.id === selectedScholarId) || null,
    [nodes, selectedScholarId]
  )

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedScholarId(nodeId)
  }, [])

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedScholarId(null)
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar 
        onSearch={(query) => console.log('Search:', query)}
        searchPlaceholder="Search scholars..."
        filters={filters}
        onFilterChange={handleFilterChange}
        zoom={1}
        onZoomChange={() => {}}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Filter Sidebar - 280px as per SPEC */}
        <FilterSidebar 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        
        {/* Main Graph Canvas - flex-1 */}
        <main 
          ref={containerRef}
          className="flex-1 relative" 
          style={{ backgroundColor: 'var(--background)' }}
        >
          {loading && nodes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading...</span>
            </div>
          ) : (
            <ReactFlowGraph
              nodes={nodes}
              edges={edges}
              onNodeClick={handleNodeClick}
              selectedNodeId={selectedScholarId}
            />
          )}
        </main>
        
        {/* Scholar Detail Panel - 320px as per SPEC */}
        {selectedScholar && (
          <ScholarDetail 
            scholar={selectedScholar}
            onClose={handleCloseDetail}
          />
        )}
      </div>
    </div>
  )
}
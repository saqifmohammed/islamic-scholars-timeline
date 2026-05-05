'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/ui/Navbar'
import TimelineRuler from '@/components/ui/TimelineRuler'
import { GraphNode, GraphEdge, Generation, Madhhab } from '@/types'

const BASE_PIXELS_PER_YEAR = 3

const TimelineCanvas = dynamic(() => import('@/components/graph/TimelineCanvas'), {
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
  const [scrollY, setScrollY] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [viewportHeight, setViewportHeight] = useState(600)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [filters, setFilters] = useState({
    generation: null as Generation | null,
    madhhab: null as Madhhab | null,
    minYear: null as number | null,
    maxYear: null as number | null,
  })

  // Calculate dynamic timeline range based on data
  const timelineRange = useMemo(() => {
    if (nodes.length === 0) return { startYear: 570, endYear: 2030 }
    
    const years = nodes
      .flatMap(n => [n.data.birthYear, n.data.deathYear].filter(Boolean) as number[])
      .filter(y => y > 0)
    
    if (years.length === 0) return { startYear: 570, endYear: 2030 }
    
    const minYear = Math.min(...years) - 10
    const maxYear = Math.max(...years, 2030) + 10
    
    return { startYear: Math.max(570, minYear), endYear: maxYear }
  }, [nodes])

  // Get viewport height
  useEffect(() => {
    const updateHeight = () => {
      const mainEl = document.querySelector('main')
      if (mainEl) {
        setViewportHeight(mainEl.clientHeight)
      }
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Calculate pixels per year based on zoom
  const pixelsPerYear = BASE_PIXELS_PER_YEAR * zoom

  // Calculate visible year range
  const visibleStartYear = timelineRange.startYear + Math.floor(scrollY / pixelsPerYear)
  const visibleEndYear = visibleStartYear + Math.floor(viewportHeight / pixelsPerYear)

  // Fetch with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGraphData()
    }, 200)
    return () => clearTimeout(timer)
  }, [scrollY, filters, timelineRange])

  const fetchGraphData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.generation) params.set('generation', filters.generation)
      if (filters.madhhab) params.set('madhhab', filters.madhhab)
      
      // Filter by expanded range around viewport
      params.set('minYear', (timelineRange.startYear - 20).toString())
      params.set('maxYear', (timelineRange.endYear + 20).toString())

      const res = await fetch(`/api/graph?${params.toString()}`)
      const data = await res.json()
      setNodes(data.nodes || [])
      setEdges(data.edges || [])
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, timelineRange])

  const handleNodeClick = useCallback((nodeId: string, cardX: number, cardY: number) => {
    if (!nodeId) {
      setSelectedNodeId(null)
      return
    }
    setSelectedNodeId(nodeId)
    
    // Calculate scroll position to center the selected card
    const targetScrollY = cardY - viewportHeight / 2
    const maxScroll = (timelineRange.endYear - timelineRange.startYear) * pixelsPerYear - viewportHeight
    setScrollY(Math.max(0, Math.min(targetScrollY, maxScroll)))
  }, [viewportHeight, pixelsPerYear, timelineRange])

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
  }, [])

  const handleZoomChange = useCallback((newZoom: number) => {
    // Maintain focus point during zoom
    const currentYearAtCenter = timelineRange.startYear + (scrollY + viewportHeight / 2) / pixelsPerYear
    setZoom(newZoom)
    
    // Recalculate scroll to keep same year at center
    const newPixelsPerYear = BASE_PIXELS_PER_YEAR * newZoom
    const newScrollY = (currentYearAtCenter - timelineRange.startYear) * newPixelsPerYear - viewportHeight / 2
    setScrollY(Math.max(0, newScrollY))
  }, [scrollY, pixelsPerYear, viewportHeight, timelineRange])

  const handleTimelineScroll = useCallback((newScrollY: number) => {
    setScrollY(newScrollY)
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar 
        onSearch={(query) => console.log('Search:', query)}
        searchPlaceholder="Search scholars..."
        filters={filters}
        onFilterChange={handleFilterChange}
        zoom={zoom}
        onZoomChange={handleZoomChange}
      />
      
      <div className="flex-1 flex overflow-hidden relative mr-[60px]" ref={containerRef}>
        {/* Main timeline canvas */}
        <main className="flex-1 relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
          {loading && nodes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading...</span>
            </div>
          ) : (
            <TimelineCanvas
              nodes={nodes}
              edges={edges}
              onNodeClick={handleNodeClick}
              scrollY={scrollY}
              pixelsPerYear={pixelsPerYear}
              startYear={timelineRange.startYear}
              viewportHeight={viewportHeight}
              selectedNodeId={selectedNodeId}
            />
          )}
        </main>
        
        {/* Timeline ruler on right */}
        <TimelineRuler
          scrollY={scrollY}
          pixelsPerYear={pixelsPerYear}
          startYear={timelineRange.startYear}
          endYear={timelineRange.endYear}
          viewportHeight={viewportHeight}
          onScroll={handleTimelineScroll}
          visibleStartYear={visibleStartYear}
          visibleEndYear={visibleEndYear}
        />
      </div>
    </div>
  )
}
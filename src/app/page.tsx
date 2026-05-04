'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Navbar from '@/components/ui/Navbar'
import ScholarPopup from '@/components/ui/ScholarPopup'
import TimelineCanvas from '@/components/graph/TimelineCanvas'
import { GraphNode, GraphEdge, Scholar, Generation, Madhhab } from '@/types'

const START_YEAR = 570
const BASE_PIXELS_PER_YEAR = 4

export default function Home() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null)
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [showPopup, setShowPopup] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(600)
  const containerRef = useRef<HTMLDivElement>(null)
  const [filters, setFilters] = useState({
    generation: null as Generation | null,
    madhhab: null as Madhhab | null,
    minYear: null as number | null,
    maxYear: null as number | null,
  })

  // Get viewport height
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setViewportHeight(containerRef.current.clientHeight)
      }
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Calculate pixels per year based on zoom
  const pixelsPerYear = BASE_PIXELS_PER_YEAR * zoom

  // Calculate visible year range
  const visibleStartYear = START_YEAR + Math.floor(scrollY / pixelsPerYear)
  const visibleEndYear = visibleStartYear + Math.floor(viewportHeight / pixelsPerYear)

  // Fetch with debounce for smooth scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGraphData()
    }, 150)
    return () => clearTimeout(timer)
  }, [scrollY, filters])

  const fetchGraphData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.generation) params.set('generation', filters.generation)
      if (filters.madhhab) params.set('madhhab', filters.madhhab)
      
      // Filter by visible year range
      params.set('minYear', (visibleStartYear - 50).toString())
      params.set('maxYear', (visibleEndYear + 50).toString())

      const res = await fetch(`/api/graph?${params.toString()}`)
      const data = await res.json()
      setNodes(data.nodes || [])
      setEdges(data.edges || [])
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, visibleStartYear, visibleEndYear])

  const fetchScholar = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/scholars/${id}`)
      if (res.ok) {
        const data = await res.json()
        setSelectedScholar(data)
        setShowPopup(true)
      }
    } catch (error) {
      console.error('Failed to fetch:', error)
    }
  }, [])

  const handleNodeClick = useCallback((nodeId: string) => {
    fetchScholar(nodeId)
  }, [fetchScholar])

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
  }, [])

  const handleTimelineScroll = useCallback((newScrollY: number) => {
    setScrollY(newScrollY)
  }, [])

  const handleZoomChange = useCallback((newZoom: number) => {
    // Adjust scroll to maintain same year in view
    const currentYear = START_YEAR + Math.floor(scrollY / (BASE_PIXELS_PER_YEAR * newZoom))
    setZoom(newZoom)
    setScrollY((currentYear - START_YEAR) * BASE_PIXELS_PER_YEAR * newZoom)
  }, [scrollY])

  const closePopup = useCallback(() => {
    setShowPopup(false)
    setSelectedScholar(null)
  }, [])

  // Handle timeline scroll via mouse/drag
  const handleTimelineDrag = useCallback((deltaY: number) => {
    const maxScroll = (2030 - START_YEAR) * BASE_PIXELS_PER_YEAR * zoom
    setScrollY(s => Math.max(0, Math.min(s + deltaY, maxScroll)))
  }, [zoom])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar 
        onSearch={(query) => console.log('Search:', query)}
        searchPlaceholder="Search..."
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <div className="flex-1 flex overflow-hidden relative" ref={containerRef}>
        {/* Main timeline canvas */}
        <main 
          className="flex-1 relative" 
          style={{ backgroundColor: 'var(--background)' }}
        >
          {loading && nodes.length === 0 ? (
            <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--text-secondary)' }}>
              Loading...
            </div>
          ) : (
            <TimelineCanvas
              nodes={nodes}
              edges={edges}
              onNodeClick={handleNodeClick}
              scrollY={scrollY}
              pixelsPerYear={pixelsPerYear}
              startYear={START_YEAR}
              viewportHeight={viewportHeight}
            />
          )}
        </main>
        
        {/* Timeline ruler on right */}
        <div 
          className="fixed right-0 top-12 bottom-0 w-14 flex flex-col items-center border-l select-none"
          style={{ 
            backgroundColor: 'var(--surface)', 
            borderColor: 'var(--border)',
            width: 56,
          }}
        >
          {/* Top year */}
          <div 
            className="w-full py-1 text-[9px] text-center font-medium border-b"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--surface)' }}
          >
            {visibleStartYear}
          </div>

          {/* Draggable area */}
          <div 
            className="flex-1 w-full overflow-hidden relative cursor-grab"
            onMouseDown={(e) => {
              const startY = e.clientY
              const startScrollY = scrollY
              const onMove = (moveEvent: MouseEvent) => {
                const delta = (startY - moveEvent.clientY) * 1.5
                handleTimelineDrag(delta)
              }
              const onUp = () => {
                window.removeEventListener('mousemove', onMove)
                window.removeEventListener('mouseup', onUp)
              }
              window.addEventListener('mousemove', onMove)
              window.addEventListener('mouseup', onUp)
            }}
            onWheel={(e) => {
              e.preventDefault()
              handleTimelineDrag(e.deltaY > 0 ? 80 : -80)
            }}
          >
            {/* Year markers */}
            {Array.from({ length: 15 }).map((_, i) => {
              const year = START_YEAR + (i * 100)
              const y = (year - START_YEAR) * pixelsPerYear - scrollY
              if (y < -50 || y > viewportHeight + 50) return null
              return (
                <div
                  key={year}
                  className="absolute w-full flex items-center"
                  style={{ 
                    top: y,
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span className="pl-1 text-[7px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {year}
                  </span>
                </div>
              )
            })}

            {/* Minor 50-year markers */}
            {Array.from({ length: 30 }).map((_, i) => {
              const year = START_YEAR + (i * 50)
              if (year % 100 === 0) return null
              const y = (year - START_YEAR) * pixelsPerYear - scrollY
              if (y < -50 || y > viewportHeight + 50) return null
              return (
                <div
                  key={`m${year}`}
                  className="absolute w-full"
                  style={{ 
                    top: y,
                    borderBottom: '1px solid var(--border)',
                    opacity: 0.3,
                    height: '1px',
                  }}
                />
              )
            })}
          </div>

          {/* Bottom year */}
          <div 
            className="w-full py-1 text-[9px] text-center border-t"
            style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)' }}
          >
            {visibleEndYear}
          </div>

          {/* Zoom controls */}
          <div className="w-full p-2 border-t flex flex-col gap-1" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => handleZoomChange(Math.min(3, zoom + 0.25))}
              className="p-1 rounded text-xs"
              style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)' }}
            >
              +
            </button>
            <button
              onClick={() => handleZoomChange(Math.max(0.5, zoom - 0.25))}
              className="p-1 rounded text-xs"
              style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)' }}
            >
              −
            </button>
            <div className="text-[8px] text-center" style={{ color: 'var(--text-secondary)' }}>
              {zoom.toFixed(1)}x
            </div>
          </div>
        </div>
        
        {/* Scholar popup on left */}
        {showPopup && selectedScholar && (
          <ScholarPopup scholar={selectedScholar} onClose={closePopup} />
        )}
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Navbar from '@/components/ui/Navbar'
import ScholarDetail from '@/components/panels/ScholarDetail'
import TimelineCanvas from '@/components/graph/TimelineCanvas'
import TimelineRuler from '@/components/ui/TimelineRuler'
import { GraphNode, GraphEdge, Generation, Madhhab } from '@/types'

const START_YEAR = 0    // AH (Prophet's Hijra)
const END_YEAR = 1500 // AH
const DEFAULT_PIXELS_PER_YEAR = 2

export default function Home() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedScholarId, setSelectedScholarId] = useState<string | null>(null)
  
  // Scroll and zoom state
  const [scrollY, setScrollY] = useState(0)
  const [pixelsPerYear, setPixelsPerYear] = useState(DEFAULT_PIXELS_PER_YEAR)
  const [viewportHeight, setViewportHeight] = useState(600)
  
  // UI state
  const [showFilters, setShowFilters] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [filters, setFilters] = useState({
    generation: null as Generation | null,
    madhhab: null as Madhhab | null,
    minYear: null as number | null,
    maxYear: null as number | null,
  })

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Measure viewport
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setViewportHeight(containerRef.current.clientHeight)
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
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

  const handleNodeClick = useCallback((nodeId: string, x: number, y: number) => {
    if (!nodeId) {
      setSelectedScholarId(null)
      return
    }
    setSelectedScholarId(nodeId)
    if (isMobile) {
      setShowDetail(true)
    }
  }, [isMobile])

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedScholarId(null)
    setShowDetail(false)
  }, [])

  const handleCloseFilters = useCallback(() => {
    setShowFilters(false)
  }, [])

  const handleScroll = useCallback((newScrollY: number) => {
    setScrollY(newScrollY)
  }, [])

  const handleZoomChange = useCallback((newZoom: number) => {
    const newPpy = newZoom * DEFAULT_PIXELS_PER_YEAR
    setPixelsPerYear(Math.max(0.5, Math.min(8, newPpy)))
  }, [])

  const handleFilterToggle = useCallback(() => {
    setShowFilters(!showFilters)
  }, [showFilters])

  // Calculate visible year range
  const visibleStartYear = useMemo(() => 
    Math.floor(scrollY / pixelsPerYear),
    [scrollY, pixelsPerYear]
  )
  const visibleEndYear = useMemo(() => 
    Math.floor((scrollY + viewportHeight) / pixelsPerYear),
    [scrollY, pixelsPerYear, viewportHeight]
  )

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar 
        onSearch={(query) => console.log('Search:', query)}
        searchPlaceholder="Search scholars..."
        filters={filters}
        onFilterChange={handleFilterChange}
        zoom={pixelsPerYear / DEFAULT_PIXELS_PER_YEAR}
        onZoomChange={handleZoomChange}
        onToggleFilters={handleFilterToggle}
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile: Filter Overlay */}
        {isMobile && showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={handleCloseFilters}
            />
            <aside 
              className="absolute left-0 top-0 bottom-0 w-[280px] max-w-[85vw] p-4 overflow-y-auto animate-slideIn"
              style={{ backgroundColor: 'var(--surface)' }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Filters</h2>
                <button 
                  onClick={handleCloseFilters}
                  className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)' }}
                >
                  ✕
                </button>
              </div>
              <FilterSidebarContent filters={filters} onFilterChange={handleFilterChange} />
            </aside>
          </div>
        )}
        
        {/* Main Canvas Area */}
        <main 
          ref={containerRef}
          className="flex-1 relative overflow-y-auto" 
          style={{ backgroundColor: 'var(--background)' }}
          onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
        >
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
              startYear={START_YEAR}
              viewportHeight={viewportHeight}
              selectedNodeId={selectedScholarId}
            />
          )}
        </main>
        
        {/* Timeline Ruler (Right Side - Fixed) */}
        <div className="hidden lg:block fixed right-[320px] top-16 bottom-0 w-[60px] z-30">
          <TimelineRuler
            scrollY={scrollY}
            pixelsPerYear={pixelsPerYear}
            startYear={START_YEAR}
            endYear={END_YEAR}
            viewportHeight={viewportHeight}
            onScroll={handleScroll}
            visibleStartYear={visibleStartYear}
            visibleEndYear={visibleEndYear}
          />
        </div>
        
        {/* Desktop: Detail Panel */}
        <aside 
          className="hidden lg:block w-[320px] h-full border-l p-5 overflow-y-auto shrink-0"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          {selectedScholar ? (
            <ScholarDetailContent scholar={selectedScholar} onClose={handleCloseDetail} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Select a scholar to view details
              </p>
            </div>
          )}
        </aside>

        {/* Mobile: Detail Overlay */}
        {isMobile && showDetail && selectedScholar && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={handleCloseDetail}
            />
            <aside 
              className="absolute right-0 top-0 bottom-0 w-[320px] max-w-[85vw] p-5 overflow-y-auto animate-slideIn"
              style={{ backgroundColor: 'var(--surface)' }}
            >
              <ScholarDetailContent scholar={selectedScholar} onClose={handleCloseDetail} />
            </aside>
          </div>
        )}
      </div>
      
      {/* Floating Filter Panel (Bottom-Left on Desktop) */}
      {!isMobile && (
        <div className="hidden lg:flex fixed bottom-md left-md z-50 flex-col gap-sm">
          <FloatingFilterPanel filters={filters} onFilterChange={handleFilterChange} onClose={() => {}} />
        </div>
      )}
      
      {/* Era Navigation FABs (Bottom-Right) */}
      <div className="hidden lg:flex fixed bottom-md right-xl z-50 items-center gap-base">
        <EraNavigation 
          scrollY={scrollY} 
          onScroll={handleScroll} 
          pixelsPerYear={pixelsPerYear}
          viewportHeight={viewportHeight}
        />
      </div>
    </div>
  )
}

function FloatingFilterPanel({ 
  filters, 
  onFilterChange,
  onClose
}: { 
  filters: { generation: Generation | null; madhhab: Madhhab | null; minYear: number | null; maxYear: number | null }
  onFilterChange: (filters: any) => void
  onClose: () => void
}) {
  const [isOpen, setIsOpen] = useState(true)
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <span className="material-symbols-outlined" style={{ color: 'var(--text-primary)' }}>filter_list</span>
      </button>
    )
  }

  return (
    <div 
      className="bg-surface-container-low/95 backdrop-blur-md p-md border shadow-lg w-72"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between mb-md">
        <h4 className="text-xs font-semibold flex items-center gap-xs" style={{ color: 'var(--text-primary)' }}>
          <span className="material-symbols-outlined text-[16px]">filter_list</span> FILTER
        </h4>
        <div className="flex gap-xs">
          <button 
            onClick={() => onFilterChange({ generation: null, madhhab: null, minYear: null, maxYear: null })}
            className="text-xs text-accent hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            Reset
          </button>
          <button onClick={() => setIsOpen(false)} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            ✕
          </button>
        </div>
      </div>
      
      <FilterSidebarContent filters={filters} onFilterChange={onFilterChange} />
    </div>
  )
}

function FilterSidebarContent({ 
  filters, 
  onFilterChange 
}: { 
  filters: { generation: Generation | null; madhhab: Madhhab | null; minYear: number | null; maxYear: number | null }
  onFilterChange: (filters: any) => void 
}) {
  const generations: Generation[] = ['sahaba', 'tabiun', 'atba_al_tabiin', 'imams', 'scholars']
  const madhhabs: (Madhhab | null)[] = ['hanafi', 'maliki', 'shafii', 'hanbali', 'zahiri', 'hadith', null]

  return (
    <div className="space-y-4">
      {/* Generation Filter */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          Generation
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ ...filters, generation: null })}
            className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
            style={{
              backgroundColor: !filters.generation ? 'var(--accent)' : 'transparent',
              color: !filters.generation ? 'var(--surface)' : 'var(--text-secondary)',
            }}
          >
            All
          </button>
          {generations.map(gen => (
            <button
              key={gen}
              onClick={() => onFilterChange({ ...filters, generation: gen })}
              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all capitalize"
              style={{
                backgroundColor: filters.generation === gen ? 'var(--surface-hover)' : 'transparent',
                color: filters.generation === gen ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {gen.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Madhhab Filter */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          Madhhab
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onFilterChange({ ...filters, madhhab: null })}
            className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: !filters.madhhab ? 'var(--accent)' : 'var(--surface-hover)',
              color: !filters.madhhab ? 'var(--surface)' : 'var(--text-secondary)',
            }}
          >
            All
          </button>
          {madhhabs.filter(Boolean).map(m => (
            <button
              key={m!}
              onClick={() => onFilterChange({ ...filters, madhhab: m })}
              className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all capitalize"
              style={{
                backgroundColor: filters.madhhab === m ? 'var(--accent)' : 'var(--surface-hover)',
                color: filters.madhhab === m ? 'var(--surface)' : 'var(--text-secondary)',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function EraNavigation({ 
  scrollY, 
  onScroll, 
  pixelsPerYear,
  viewportHeight 
}: { 
  scrollY: number
  onScroll: (y: number) => void
  pixelsPerYear: number
  viewportHeight: number
}) {
  const eras = [
    { name: 'Rashidun', startYear: 0, endYear: 40 },
    { name: 'Umayyad', startYear: 40, endYear: 132 },
    { name: 'Abbasid', startYear: 132, endYear: 656 },
    { name: 'Ottoman', startYear: 1517, endYear: 1924 },
  ]
  
  const currentYear = Math.floor(scrollY / pixelsPerYear)
  
  // Determine current era
  const currentEra = eras.find(era => 
    currentYear >= era.startYear && currentYear < era.endYear
  ) || { name: 'Early Islam', startYear: 0, endYear: 40 }

  const handleScrollTo = (year: number) => {
    const targetScroll = year * pixelsPerYear - viewportHeight / 2
    onScroll(Math.max(0, targetScroll))
  }

  return (
    <>
      <button 
        onClick={() => handleScrollTo(currentEra.startYear - 50)}
        className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-surface-hover transition-all"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
      >
        <span className="material-symbols-outlined" style={{ color: 'var(--text-secondary)' }}>expand_less</span>
      </button>
      
      <div 
        className="px-3 py-1 rounded-lg border"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
      >
        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
          {currentEra.name} ({currentYear} AH)
        </span>
      </div>
      
      <button 
        onClick={() => handleScrollTo(currentEra.endYear + 50)}
        className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-surface-hover transition-all"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
      >
        <span className="material-symbols-outlined" style={{ color: 'var(--text-secondary)' }}>expand_more</span>
      </button>
    </>
  )
}

function ScholarDetailContent({ 
  scholar, 
  onClose 
}: { 
  scholar: GraphNode
  onClose: () => void 
}) {
  const birthYear = scholar.data.birthYear
  const deathYear = scholar.data.deathYear
  const lifespan = birthYear && deathYear ? deathYear - birthYear : null

  return (
    <div className="space-y-5">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg transition-all lg:hidden"
          style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)' }}
          aria-label="Close"
        >
          ✕
        </button>
      )}
      
      <div className="space-y-4">
        <div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-lg inline-block" style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)' }}>
            {scholar.data.generation}
          </span>
        </div>

        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Limelight, serif' }}>
          {scholar.label}
        </h2>

        {(birthYear || deathYear) && (
          <div style={{ color: 'var(--text-secondary)', fontSize: '16px', fontFamily: 'JetBrains Mono, monospace' }}>
            {birthYear && <span>{birthYear}</span>}
            {birthYear && deathYear && <span> — </span>}
            {deathYear && <span>{deathYear}</span>}
            <span className="ml-2 text-sm">(AH)</span>
          </div>
        )}

        {lifespan && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg inline-block" style={{ backgroundColor: 'var(--accent)', color: 'var(--surface)' }}>
            {lifespan} years
          </span>
        )}

        <hr style={{ borderColor: 'var(--border)' }} />

        {scholar.data.madhhab && (
          <div>
            <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-secondary)' }}>Madhhab</span>
            <p className="text-sm font-medium mt-1 capitalize" style={{ color: 'var(--text-primary)' }}>{scholar.data.madhhab}</p>
          </div>
        )}

        {scholar.data.creed && (
          <div>
            <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-secondary)' }}>Aqeedah</span>
            <p className="text-sm font-medium mt-1 capitalize" style={{ color: 'var(--text-primary)' }}>{scholar.data.creed}</p>
          </div>
        )}
      </div>
    </div>
  )
}
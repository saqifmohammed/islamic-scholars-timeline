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
  
  // Mobile state
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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar 
        onSearch={(query) => console.log('Search:', query)}
        searchPlaceholder="Search scholars..."
        filters={filters}
        onFilterChange={handleFilterChange}
        zoom={1}
        onZoomChange={() => {}}
        onToggleFilters={isMobile ? () => setShowFilters(!showFilters) : undefined}
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop: Permanent Sidebar */}
        <aside 
          className="hidden lg:block w-[280px] h-full border-r p-4 overflow-y-auto shrink-0"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <FilterSidebarContent filters={filters} onFilterChange={handleFilterChange} />
        </aside>

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
        
        {/* Main Graph Canvas */}
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
        
        {/* Desktop: Permanent Detail Panel */}
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
        {isMobile && showDetail && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={handleCloseDetail}
            />
            <aside 
              className="absolute right-0 top-0 bottom-0 w-[320px] max-w-[85vw] p-5 overflow-y-auto animate-slideIn"
              style={{ backgroundColor: 'var(--surface)' }}
            >
              {selectedScholar && (
                <ScholarDetailContent scholar={selectedScholar} onClose={handleCloseDetail} />
              )}
            </aside>
          </div>
        )}
      </div>
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
    <div className="space-y-5">
      <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Limelight, serif' }}>
        Filters
      </h2>
      
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

      {/* Year Range */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          Year Range (AH)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="From"
            value={filters.minYear || ''}
            onChange={(e) => onFilterChange({ ...filters, minYear: e.target.value ? parseInt(e.target.value) : null })}
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <input
            type="number"
            placeholder="To"
            value={filters.maxYear || ''}
            onChange={(e) => onFilterChange({ ...filters, maxYear: e.target.value ? parseInt(e.target.value) : null })}
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <button
        onClick={() => onFilterChange({ generation: null, madhhab: null, minYear: null, maxYear: null })}
        className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
        style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)' }}
      >
        Clear All
      </button>
    </div>
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
'use client'

interface TimelineRulerProps {
  startYear: number
  endYear: number
  scrollY: number
  pixelsPerYear: number
  onScroll?: (scrollY: number) => void
  zoom?: number
}

export default function TimelineRuler({ 
  startYear = 570, 
  endYear = 2030, 
  scrollY = 0,
  pixelsPerYear = 4,
  onScroll,
  zoom = 1
}: TimelineRulerProps) {
  const totalYears = endYear - startYear
  
  // Calculate visible year range
  const visibleStartYear = startYear + Math.floor(scrollY / pixelsPerYear)
  const visibleEndYear = visibleStartYear + Math.floor(700 / pixelsPerYear)
  
  // Determine marker intervals based on zoom level
  const majorInterval = zoom < 1 ? 100 : zoom < 1.5 ? 50 : 25
  const minorInterval = majorInterval / 5

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onScroll) return
    const startY = e.clientY - scrollY
    const container = e.currentTarget.parentElement
    
    const handleMouseMove = (e: MouseEvent) => {
      const newScrollY = Math.max(0, Math.min(
        (e.clientY - startY) * 2,
        totalYears * pixelsPerYear - 600
      ))
      onScroll(newScrollY)
    }
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 100 : -100
    const newScrollY = Math.max(0, Math.min(scrollY + delta, totalYears * pixelsPerYear - 600))
    onScroll?.(newScrollY)
  }

  return (
    <div 
      className="fixed right-10 top-12 bottom-0 w-12 flex flex-col items-center border-l select-none cursor-grab"
      style={{ 
        backgroundColor: 'var(--surface)', 
        borderColor: 'var(--border)' 
      }}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      {/* Current view indicator */}
      <div 
        className="w-full py-1 text-[9px] text-center font-medium border-b"
        style={{ 
          backgroundColor: 'var(--accent)', 
          color: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        {visibleStartYear}
      </div>

      {/* Ruler markers */}
      <div className="flex-1 w-full overflow-hidden relative">
        <div 
          className="absolute w-full"
          style={{ transform: `translateY(${-scrollY}px)` }}
        >
          {/* Major markers (100 years) */}
          {Array.from({ length: Math.floor(totalYears / majorInterval) + 1 }).map((_, i) => {
            const year = startYear + (i * majorInterval)
            return (
              <div
                key={year}
                className="absolute w-full flex items-center"
                style={{ 
                  top: `${(year - startYear) * pixelsPerYear}px`,
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span className="pl-1 text-[7px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {year}
                </span>
              </div>
            )
          })}

          {/* Minor markers (50 years) */}
          {Array.from({ length: Math.floor(totalYears / minorInterval) + 1 }).map((_, i) => {
            const year = startYear + (i * minorInterval)
            if (year % majorInterval !== 0) {
              return (
                <div
                  key={`m${year}`}
                  className="absolute w-full"
                  style={{ 
                    top: `${(year - startYear) * pixelsPerYear}px`,
                    borderBottom: '1px solid var(--border)',
                    opacity: 0.3,
                    height: '1px',
                  }}
                />
              )
            }
            return null
          })}
        </div>
      </div>

      {/* Bottom indicator */}
      <div 
        className="w-full py-1 text-[9px] text-center border-t"
        style={{ 
          backgroundColor: 'var(--surface-hover)', 
          color: 'var(--text-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        {visibleEndYear}
      </div>

      {/* Handle */}
      <div 
        className="w-full h-2 flex items-center justify-center border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: 'var(--text-secondary)', opacity: 0.3 }} />
      </div>
    </div>
  )
}
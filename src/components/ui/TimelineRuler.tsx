'use client'

import { useMemo, useCallback, useState } from 'react'
import { KHILAFAH_DATA, Khilafah } from '@/lib/khilafah'

interface TimelineRulerProps {
  scrollY: number
  pixelsPerYear: number
  startYear: number
  endYear: number
  viewportHeight: number
  onScroll: (scrollY: number) => void
  visibleStartYear: number
  visibleEndYear: number
}

export default function TimelineRuler({
  scrollY,
  pixelsPerYear,
  startYear,
  endYear,
  viewportHeight,
  onScroll,
  visibleStartYear,
  visibleEndYear
}: TimelineRulerProps) {
  const [hoveredKhilafah, setHoveredKhilafah] = useState<Khilafah | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startY = e.clientY
    const startScrollY = scrollY

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = (startY - moveEvent.clientY) * 1.5
      const maxScroll = (endYear - startYear) * pixelsPerYear - viewportHeight
      const newScrollY = Math.max(0, Math.min(startScrollY + deltaY, maxScroll))
      onScroll(newScrollY)
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [scrollY, pixelsPerYear, endYear, startYear, viewportHeight, onScroll])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const deltaY = e.deltaY > 0 ? 120 : -120
    const maxScroll = (endYear - startYear) * pixelsPerYear - viewportHeight
    const newScrollY = Math.max(0, Math.min(scrollY + deltaY, maxScroll))
    onScroll(newScrollY)
  }, [scrollY, pixelsPerYear, endYear, startYear, viewportHeight, onScroll])

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickY = e.clientY - rect.top - 50
    const yearAtClick = startYear + Math.floor(clickY / pixelsPerYear)
    const targetScrollY = (yearAtClick - startYear) * pixelsPerYear - viewportHeight / 2
    const maxScroll = (endYear - startYear) * pixelsPerYear - viewportHeight
    onScroll(Math.max(0, Math.min(targetScrollY, maxScroll)))
  }, [pixelsPerYear, startYear, endYear, viewportHeight, onScroll])

  const handleKhilafahClick = useCallback((kh: Khilafah) => {
    const targetScrollY = (kh.startYear - startYear) * pixelsPerYear - viewportHeight / 2
    const maxScroll = (endYear - startYear) * pixelsPerYear - viewportHeight
    onScroll(Math.max(0, Math.min(targetScrollY, maxScroll)))
  }, [startYear, pixelsPerYear, viewportHeight, endYear, onScroll])

  const handleKhilafahHover = useCallback((e: React.MouseEvent, kh: Khilafah | null) => {
    if (kh) {
      const rect = e.currentTarget.getBoundingClientRect()
      setTooltipPos({
        x: rect.left - 200,
        y: e.clientY - 60
      })
    }
    setHoveredKhilafah(kh)
  }, [])

  const markers = useMemo(() => {
    const result = []
    for (let year = startYear; year <= endYear; year += 50) {
      result.push({ year, type: 'major', y: (year - startYear) * pixelsPerYear })
    }
    for (let year = startYear; year <= endYear; year += 10) {
      if (year % 50 !== 0) {
        result.push({ year, type: 'medium', y: (year - startYear) * pixelsPerYear })
      }
    }
    if (pixelsPerYear >= 3) {
      for (let year = startYear; year <= endYear; year += 1) {
        if (year % 10 !== 0) {
          result.push({ year, type: 'minor', y: (year - startYear) * pixelsPerYear })
        }
      }
    }
    return result.sort((a, b) => a.y - b.y)
  }, [startYear, endYear, pixelsPerYear])

  const visibleKhs = useMemo(() => {
    return KHILAFAH_DATA.filter(kh => {
      const khEnd = kh.endYear || 2030
      return kh.startYear <= endYear && khEnd >= startYear
    })
  }, [startYear, endYear])

  return (
    <div 
      className="fixed right-0 top-16 bottom-0 w-[60px] flex flex-col items-center select-none"
      style={{ 
        backgroundColor: 'var(--surface)', 
        borderLeft: '1px solid var(--border)',
        zIndex: 10,
      }}
    >
      <div 
        className="w-full h-[50px] flex items-center justify-center text-xs font-bold border-b"
        style={{ 
          backgroundColor: 'var(--accent)',
          color: 'var(--surface)',
        }}
      >
        {visibleStartYear} - {visibleEndYear}
      </div>

      <div 
        className="flex-1 w-full overflow-hidden relative"
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onClick={handleClick}
      >
        {/* Khilafah background bands */}
        {visibleKhs.map((kh) => {
          const y = (kh.startYear - startYear) * pixelsPerYear
          const khEnd = kh.endYear || 2030
          const height = (khEnd - kh.startYear) * pixelsPerYear
          
          if (y + height < scrollY - 50 || y > scrollY + viewportHeight + 50) return null

          return (
            <div
              key={kh.id}
              className="absolute w-full cursor-pointer transition-opacity duration-200"
              style={{
                top: y - scrollY,
                height: Math.max(20, height),
                backgroundColor: kh.color,
                opacity: hoveredKhilafah?.id === kh.id ? 0.5 : 0.25,
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleKhilafahClick(kh)
              }}
              onMouseEnter={(e) => handleKhilafahHover(e, kh)}
              onMouseLeave={(e) => handleKhilafahHover(e, null)}
            />
          )
        })}

        {/* Year markers on top */}
        {markers.map(({ year, type, y }) => {
          if (y < scrollY - 50 || y > scrollY + viewportHeight + 50) return null
          
          const isMajor = type === 'major'
          const isMedium = type === 'medium'
          
          return (
            <div
              key={`${year}-${type}`}
              className="absolute w-full flex items-center pointer-events-none"
              style={{ 
                top: y - scrollY,
                borderBottom: '1px solid',
                borderColor: isMajor ? 'rgba(255,255,255,0.6)' : isMedium ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              }}
            >
              {(isMajor || isMedium) && (
                <span 
                  className={`pl-1 ${isMajor ? 'text-xs font-semibold' : 'text-[9px]'}`}
                  style={{ color: 'var(--surface)' }}
                >
                  {year}
                </span>
              )}
            </div>
          )
        })}

        <div 
          className="absolute w-full h-[50px] top-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, var(--surface), transparent)' }}
        />
        <div 
          className="absolute w-full h-[50px] bottom-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--surface), transparent)' }}
        />
      </div>

      {/* Tooltip */}
      {hoveredKhilafah && (
        <div 
          className="fixed w-44 p-3 rounded-lg shadow-xl z-50 pointer-events-none"
          style={{ 
            left: tooltipPos.x,
            top: tooltipPos.y,
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-sm font-semibold" style={{ color: hoveredKhilafah.color }}>
            {hoveredKhilafah.name}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {hoveredKhilafah.startYear} - {hoveredKhilafah.endYear || 'Present'}
          </div>
          <div className="text-[10px] mt-2" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-medium">Rulers: </span>
            {hoveredKhilafah.khalifas.slice(0, 3).join(', ')}
            {hoveredKhilafah.khalifas.length > 3 && ` +${hoveredKhilafah.khalifas.length - 3}`}
          </div>
        </div>
      )}

      <div 
        className="w-full h-3 flex items-center justify-center border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: 'var(--text-secondary)', opacity: 0.3 }} />
      </div>
    </div>
  )
}
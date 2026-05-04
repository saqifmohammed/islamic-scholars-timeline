'use client'

import { useState, useCallback, memo } from 'react'
import { KHILAFAH_DATA, getKhilafahForYear, Khilafah } from '@/lib/khilafah'

interface KhilafahLayerProps {
  scrollY: number
  pixelsPerYear: number
  startYear: number
  endYear: number
  viewportHeight: number
  onKhilafahClick?: (khilafah: Khilafah) => void
}

function KhilafahLayer({
  scrollY,
  pixelsPerYear,
  startYear,
  endYear,
  viewportHeight,
  onKhilafahClick
}: KhilafahLayerProps) {
  const [hoveredKhilafah, setHoveredKhilafah] = useState<string | null>(null)
  const [tooltipKhilafah, setTooltipKhilafah] = useState<Khilafah | null>(null)

  const handleKhilafahClick = useCallback((kh: Khilafah) => {
    onKhilafahClick?.(kh)
  }, [onKhilafahClick])

  const visibleKhs = KHILAFAH_DATA.filter(kh => {
    const khEnd = kh.endYear || 2030
    return kh.startYear <= endYear && khEnd >= startYear
  })

  return (
    <div 
      className="fixed left-0 top-16 w-16 h-full overflow-hidden pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {/* Khilafah blocks */}
      {visibleKhs.map((kh) => {
        const y = (kh.startYear - startYear) * pixelsPerYear - scrollY
        const khEnd = kh.endYear || 2030
        const blockHeight = (khEnd - kh.startYear) * pixelsPerYear
        
        if (y + blockHeight < -50 || y > viewportHeight + 50) return null

        const isHovered = hoveredKhilafah === kh.id

        return (
          <div
            key={kh.id}
            className="absolute left-0 w-16 pointer-events-auto cursor-pointer transition-all duration-200"
            style={{
              top: y,
              height: Math.max(20, blockHeight),
              backgroundColor: kh.color,
              opacity: isHovered ? 0.9 : 0.4,
              borderRight: `3px solid ${kh.color}`,
            }}
            onClick={() => handleKhilafahClick(kh)}
            onMouseEnter={() => {
              setHoveredKhilafah(kh.id)
              setTooltipKhilafah(kh)
            }}
            onMouseLeave={() => {
              setHoveredKhilafah(null)
              setTooltipKhilafah(null)
            }}
          >
            {/* Khilafah name - vertical */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              <span className="text-[8px] font-bold text-white truncate px-1">
                {kh.name}
              </span>
            </div>
          </div>
        )
      })}

      {/* Tooltip */}
      {tooltipKhilafah && hoveredKhilafah && (
        <div 
          className="fixed left-16 top-1/2 -translate-y-1/2 w-48 p-3 rounded-lg shadow-xl z-50 pointer-events-none"
          style={{ 
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-sm font-semibold" style={{ color: tooltipKhilafah.color }}>
            {tooltipKhilafah.name}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {tooltipKhilafah.startYear} - {tooltipKhilafah.endYear || 'Present'}
          </div>
          <div className="text-[10px] mt-2" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-medium">Rulers: </span>
            {tooltipKhilafah.khalifas.slice(0, 3).join(', ')}
            {tooltipKhilafah.khalifas.length > 3 && ` +${tooltipKhilafah.khalifas.length - 3}`}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(KhilafahLayer)
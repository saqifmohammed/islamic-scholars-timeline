'use client'

interface ZoomControlsProps {
  zoom: number
  onZoomChange: (zoom: number) => void
  minZoom?: number
  maxZoom?: number
}

export default function ZoomControls({ 
  zoom, 
  onZoomChange,
  minZoom = 0.5,
  maxZoom = 3
}: ZoomControlsProps) {
  const zoomIn = () => {
    const newZoom = Math.min(zoom + 0.25, maxZoom)
    onZoomChange(newZoom)
  }

  const zoomOut = () => {
    const newZoom = Math.max(zoom - 0.25, minZoom)
    onZoomChange(newZoom)
  }

  const resetZoom = () => {
    onZoomChange(1)
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={zoomOut}
        className="p-1 rounded text-xs"
        style={{ 
          backgroundColor: 'var(--surface-hover)', 
          color: 'var(--text-secondary)' 
        }}
        title="Zoom out"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <button
        onClick={resetZoom}
        className="px-2 py-1 rounded text-[10px]"
        style={{ 
          backgroundColor: 'var(--surface-hover)', 
          color: 'var(--text-secondary)' 
        }}
        title="Reset zoom"
      >
        {zoom.toFixed(1)}x
      </button>

      <button
        onClick={zoomIn}
        className="p-1 rounded text-xs"
        style={{ 
          backgroundColor: 'var(--surface-hover)', 
          color: 'var(--text-secondary)' 
        }}
        title="Zoom in"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}
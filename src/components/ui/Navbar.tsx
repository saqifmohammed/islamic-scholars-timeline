'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import FilterMenu from './FilterMenu'
import { Generation, Madhhab } from '@/types'

interface NavbarProps {
  onSearch?: (query: string) => void
  searchPlaceholder?: string
  filters: {
    generation: Generation | null
    madhhab: Madhhab | null
    minYear: number | null
    maxYear: number | null
  }
  onFilterChange: (filters: NavbarProps['filters']) => void
  zoom: number
  onZoomChange: (zoom: number) => void
}

export default function Navbar({ 
  onSearch, 
  searchPlaceholder, 
  filters, 
  onFilterChange,
  zoom,
  onZoomChange
}: NavbarProps) {
  const [query, setQuery] = useState('')

  const toggleTheme = useCallback(() => {
    const isDark = document.documentElement.classList.contains('dark')
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }, [])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }, [query, onSearch])

  return (
    <nav 
      className="h-16 flex items-center justify-between px-5 border-b shrink-0"
      style={{ 
        backgroundColor: 'var(--surface)', 
        borderColor: 'var(--border)' 
      }}
    >
      {/* Logo & Title */}
      <div className="flex items-center gap-4">
        <Link href="/" className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Islamic Scholars
        </Link>
      </div>

      {/* Controls - Search, Filter, Zoom, Theme, Admin */}
      <div className="flex items-center gap-3">
        {/* Search */}
        {onSearch && (
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder || 'Search scholars...'}
                className="w-56 h-10 px-4 pr-10 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        )}

        {/* Filter Dropdown */}
        <FilterMenu filters={filters} onFilterChange={onFilterChange} />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 h-10 px-2 rounded-lg" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
          <button
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
            className="w-8 h-8 flex items-center justify-center rounded hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <span className="text-xs font-medium w-10 text-center" style={{ color: 'var(--text-secondary)' }}>
            {zoom.toFixed(1)}x
          </span>
          
          <button
            onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
            className="w-8 h-8 flex items-center justify-center rounded hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:opacity-80 transition-opacity"
          style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          title="Toggle theme"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>

        {/* Admin */}
        <Link 
          href="/admin" 
          className="h-10 px-4 flex items-center justify-center rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
          style={{ 
            backgroundColor: 'var(--accent)',
            color: 'var(--surface)' 
          }}
        >
          Admin
        </Link>
      </div>
    </nav>
  )
}
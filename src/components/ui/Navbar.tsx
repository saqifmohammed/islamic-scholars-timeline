'use client'

import { useState, useCallback } from 'react'
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
}

export default function Navbar({ onSearch, searchPlaceholder, filters, onFilterChange }: NavbarProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <nav 
      className="h-12 flex items-center justify-between px-3 border-b"
      style={{ 
        backgroundColor: 'var(--surface)', 
        borderColor: 'var(--border)' 
      }}
    >
      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Islamic Scholars
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {onSearch && (
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder || 'Search...'}
              className="w-32 px-2 py-1 rounded text-xs"
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </form>
        )}

        <FilterMenu filters={filters} onFilterChange={onFilterChange} />

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded"
          style={{ color: 'var(--text-secondary)' }}
          title="Toggle theme"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>

        <Link 
          href="/admin" 
          className="text-xs px-2 py-1 rounded"
          style={{ 
            backgroundColor: 'var(--surface-hover)',
            color: 'var(--text-secondary)' 
          }}
        >
          Admin
        </Link>
      </div>
    </nav>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Scholar {
  id: string
  name: string
  birth_year: number | null
  death_year: number | null
  generation: string
  madhhab: string | null
  region: string | null
}

const generations = ['sahaba', 'tabiun', 'atba_al_tabiin', 'imams', 'scholars']
const madhhabs = ['hanafi', 'maliki', 'shafii', 'hanbali', 'zahiri', 'hadith']

export default function AdminScholarsPage() {
  const [scholars, setScholars] = useState<Scholar[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    birth_year: '',
    death_year: '',
    generation: 'scholars',
    madhhab: '',
    region: '',
    notes: '',
  })

  useEffect(() => {
    fetchScholars()
  }, [])

  const fetchScholars = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/scholars')
      const data = await res.json()
      setScholars(data)
    } catch (error) {
      console.error('Failed to fetch scholars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload = {
      name: form.name,
      birth_year: form.birth_year ? parseInt(form.birth_year) : null,
      death_year: form.death_year ? parseInt(form.death_year) : null,
      generation: form.generation,
      madhhab: form.madhhab || null,
      region: form.region || null,
      notes: form.notes || null,
    }

    try {
      if (editingId) {
        await fetch(`/api/scholars/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch('/api/scholars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      
      setShowForm(false)
      setEditingId(null)
      setForm({
        name: '',
        birth_year: '',
        death_year: '',
        generation: 'scholars',
        madhhab: '',
        region: '',
        notes: '',
      })
      fetchScholars()
    } catch (error) {
      console.error('Failed to save scholar:', error)
    }
  }

  const handleEdit = (scholar: Scholar) => {
    setForm({
      name: scholar.name,
      birth_year: scholar.birth_year?.toString() || '',
      death_year: scholar.death_year?.toString() || '',
      generation: scholar.generation,
      madhhab: scholar.madhhab || '',
      region: scholar.region || '',
      notes: '',
    })
    setEditingId(scholar.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scholar?')) return
    
    try {
      await fetch(`/api/scholars/${id}`, { method: 'DELETE' })
      fetchScholars()
    } catch (error) {
      console.error('Failed to delete scholar:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Scholars</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setForm({
              name: '',
              birth_year: '',
              death_year: '',
              generation: 'scholars',
              madhhab: '',
              region: '',
              notes: '',
            })
          }}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80"
        >
          Add Scholar
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-surface rounded-lg border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            {editingId ? 'Edit Scholar' : 'Add New Scholar'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="px-3 py-2 rounded-md bg-background border border-border text-text-primary"
              />
              <input
                type="text"
                placeholder="Region"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="px-3 py-2 rounded-md bg-background border border-border text-text-primary"
              />
              <input
                type="number"
                placeholder="Birth Year"
                value={form.birth_year}
                onChange={(e) => setForm({ ...form, birth_year: e.target.value })}
                className="px-3 py-2 rounded-md bg-background border border-border text-text-primary"
              />
              <input
                type="number"
                placeholder="Death Year"
                value={form.death_year}
                onChange={(e) => setForm({ ...form, death_year: e.target.value })}
                className="px-3 py-2 rounded-md bg-background border border-border text-text-primary"
              />
              <select
                value={form.generation}
                onChange={(e) => setForm({ ...form, generation: e.target.value })}
                className="px-3 py-2 rounded-md bg-background border border-border text-text-primary"
              >
                {generations.map(g => (
                  <option key={g} value={g}>{g.replace('_', ' ')}</option>
                ))}
              </select>
              <select
                value={form.madhhab}
                onChange={(e) => setForm({ ...form, madhhab: e.target.value })}
                className="px-3 py-2 rounded-md bg-background border border-border text-text-primary"
              >
                <option value="">Select Madhhab</option>
                {madhhabs.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-surface-hover text-text-secondary rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-text-secondary">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Name</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Generation</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Madhhab</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Years</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scholars.map((scholar) => (
                <tr key={scholar.id} className="border-b border-border hover:bg-surface-hover">
                  <td className="py-3 px-4 text-text-primary">{scholar.name}</td>
                  <td className="py-3 px-4 text-text-secondary">{scholar.generation.replace('_', ' ')}</td>
                  <td className="py-3 px-4 text-text-secondary">{scholar.madhhab || '-'}</td>
                  <td className="py-3 px-4 text-text-secondary">
                    {scholar.birth_year && scholar.death_year
                      ? `${scholar.birth_year} - ${scholar.death_year}`
                      : scholar.birth_year || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(scholar)}
                        className="text-accent hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(scholar.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
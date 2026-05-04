'use client'

import { useState, useEffect } from 'react'

interface Scholar {
  id: string
  name: string
}

interface Relationship {
  id: string
  teacher_id: string
  student_id: string
  type: string
}

export default function AdminRelationshipsPage() {
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [scholars, setScholars] = useState<Scholar[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    teacher_id: '',
    student_id: '',
    type: 'teacher',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [relsRes, scholarsRes] = await Promise.all([
        fetch('/api/relationships'),
        fetch('/api/scholars'),
      ])
      const [relsData, scholarsData] = await Promise.all([
        relsRes.json(),
        scholarsRes.json(),
      ])
      setRelationships(relsData)
      setScholars(scholarsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await fetch('/api/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      
      setShowForm(false)
      setForm({ teacher_id: '', student_id: '', type: 'teacher' })
      fetchData()
    } catch (error) {
      console.error('Failed to create relationship:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this relationship?')) return
    
    try {
      await fetch(`/api/relationships?id=${id}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      console.error('Failed to delete relationship:', error)
    }
  }

  const getScholarName = (id: string) => {
    return scholars.find(s => s.id === id)?.name || id
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Relationships</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80"
        >
          Add Relationship
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-surface rounded-lg border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Add New Relationship
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select
                value={form.teacher_id}
                onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
                required
                className="px-3 py-2 rounded-md bg-background border border-border text-text-primary"
              >
                <option value="">Select Teacher</option>
                {scholars.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <select
                value={form.student_id}
                onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                required
                className="px-3 py-2 rounded-md bg-background border border-border text-text-primary"
              >
                <option value="">Select Student</option>
                {scholars.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="px-3 py-2 rounded-md bg-background border border-border text-text-primary"
            >
              <option value="teacher">Teacher</option>
              <option value="influence">Influence</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80"
              >
                Add
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
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Teacher</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Relationship</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Student</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {relationships.map((rel) => (
                <tr key={rel.id} className="border-b border-border hover:bg-surface-hover">
                  <td className="py-3 px-4 text-text-primary">{getScholarName(rel.teacher_id)}</td>
                  <td className="py-3 px-4 text-text-secondary">{rel.type}</td>
                  <td className="py-3 px-4 text-text-primary">{getScholarName(rel.student_id)}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(rel.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {relationships.length === 0 && (
            <div className="text-center py-8 text-text-secondary">
              No relationships yet. Add one to connect teachers with students.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
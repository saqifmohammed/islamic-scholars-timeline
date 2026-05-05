'use client'

import { useState, useEffect } from 'react'

interface Scholar {
  id: string
  name: string
}

interface Book {
  id: string
  title: string
  author_id: string
  notes: string | null
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [scholars, setScholars] = useState<Scholar[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNewAuthorForm, setShowNewAuthorForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    author_id: '',
    notes: '',
  })
  const [newAuthorForm, setNewAuthorForm] = useState({
    name: '',
    birth_year: '',
    death_year: '',
    generation: 'scholars',
    madhhab: '',
    region: '',
  })
  const [savingAuthor, setSavingAuthor] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [booksRes, scholarsRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/scholars'),
      ])
      const [booksData, scholarsData] = await Promise.all([
        booksRes.json(),
        scholarsRes.json(),
      ])
      setBooks(booksData)
      setScholars(scholarsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.author_id) return

    try {
      if (editingId) {
        await fetch(`/api/books/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      } else {
        await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Failed to save book:', error)
    }
  }

  const handleEdit = (book: Book) => {
    setForm({
      title: book.title,
      author_id: book.author_id,
      notes: book.notes || '',
    })
    setEditingId(book.id)
    setShowForm(true)
    setShowNewAuthorForm(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this book?')) return
    try {
      await fetch(`/api/books/${id}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      console.error('Failed to delete book:', error)
    }
  }

  const handleAddNewAuthor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAuthorForm.name) return
    setSavingAuthor(true)
    try {
      const res = await fetch('/api/scholars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAuthorForm.name,
          birth_year: newAuthorForm.birth_year ? parseInt(newAuthorForm.birth_year) : null,
          death_year: newAuthorForm.death_year ? parseInt(newAuthorForm.death_year) : null,
          generation: newAuthorForm.generation,
          madhhab: newAuthorForm.madhhab || null,
          region: newAuthorForm.region || null,
          notes: null,
        }),
      })
      const created = await res.json()
      // Refresh scholars list and auto-select the new author
      const scholarsRes = await fetch('/api/scholars')
      const scholarsData = await scholarsRes.json()
      setScholars(scholarsData)
      setForm(prev => ({ ...prev, author_id: created.id }))
      setNewAuthorForm({ name: '', birth_year: '', death_year: '', generation: 'scholars', madhhab: '', region: '' })
      setShowNewAuthorForm(false)
    } catch (error) {
      console.error('Failed to create author:', error)
    } finally {
      setSavingAuthor(false)
    }
  }

  const resetForm = () => {
    setForm({ title: '', author_id: '', notes: '' })
    setEditingId(null)
    setShowForm(false)
    setShowNewAuthorForm(false)
  }

  const getAuthorName = (id: string) => scholars.find(s => s.id === id)?.name || id

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Books</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80"
        >
          Add Book
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-5 bg-surface rounded-lg border border-border space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {editingId ? 'Edit Book' : 'Add New Book'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <input
              type="text"
              placeholder="Book title *"
              value={form.title}
              required
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-text-primary"
            />

            {/* Author selector */}
            <div className="space-y-2">
              <label className="text-sm text-text-secondary">Author *</label>
              <div className="flex gap-2">
                <select
                  value={form.author_id}
                  required
                  onChange={(e) => setForm({ ...form, author_id: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-md bg-background border border-border text-text-primary max-h-48"
                  size={1}
                >
                  <option value="">— Select scholar —</option>
                  {scholars.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewAuthorForm(v => !v)}
                  className="px-3 py-2 rounded-md text-sm border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover whitespace-nowrap"
                >
                  {showNewAuthorForm ? 'Cancel' : '+ New Author'}
                </button>
              </div>
            </div>

            {/* Inline new author form */}
            {showNewAuthorForm && (
              <div className="p-4 rounded-md border border-accent/40 bg-background space-y-3">
                <p className="text-xs font-medium text-accent uppercase tracking-wider">New Author</p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Name *"
                    value={newAuthorForm.name}
                    onChange={(e) => setNewAuthorForm({ ...newAuthorForm, name: e.target.value })}
                    className="col-span-2 px-3 py-2 rounded-md bg-surface border border-border text-text-primary text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Birth year"
                    value={newAuthorForm.birth_year}
                    onChange={(e) => setNewAuthorForm({ ...newAuthorForm, birth_year: e.target.value })}
                    className="px-3 py-2 rounded-md bg-surface border border-border text-text-primary text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Death year"
                    value={newAuthorForm.death_year}
                    onChange={(e) => setNewAuthorForm({ ...newAuthorForm, death_year: e.target.value })}
                    className="px-3 py-2 rounded-md bg-surface border border-border text-text-primary text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Region"
                    value={newAuthorForm.region}
                    onChange={(e) => setNewAuthorForm({ ...newAuthorForm, region: e.target.value })}
                    className="px-3 py-2 rounded-md bg-surface border border-border text-text-primary text-sm"
                  />
                  <select
                    value={newAuthorForm.generation}
                    onChange={(e) => setNewAuthorForm({ ...newAuthorForm, generation: e.target.value })}
                    className="px-3 py-2 rounded-md bg-surface border border-border text-text-primary text-sm"
                  >
                    {['sahaba','tabiun','atba_al_tabiin','imams','scholars'].map(g => (
                      <option key={g} value={g}>{g.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddNewAuthor}
                  disabled={savingAuthor || !newAuthorForm.name}
                  className="px-4 py-1.5 bg-accent text-white rounded-md text-sm hover:bg-accent/80 disabled:opacity-50"
                >
                  {savingAuthor ? 'Saving…' : 'Save Author'}
                </button>
              </div>
            )}

            {/* Notes */}
            <textarea
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-text-primary text-sm resize-none"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-surface-hover text-text-secondary rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-text-secondary">Loading…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Title</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Author</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Notes</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-border hover:bg-surface-hover">
                  <td className="py-3 px-4 text-text-primary font-medium">{book.title}</td>
                  <td className="py-3 px-4 text-text-secondary">{getAuthorName(book.author_id)}</td>
                  <td className="py-3 px-4 text-text-secondary text-sm">{book.notes || '—'}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-accent hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {books.length === 0 && (
            <div className="text-center py-8 text-text-secondary">
              No books yet. Add one to link works to scholars.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import Link from 'next/link'

export const metadata = {
  title: 'Admin - Islamic Scholar Graph',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="h-16 bg-surface border-b border-border px-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-text-primary">
          Islamic Scholar Graph
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/admin/scholars" className="text-sm text-text-secondary hover:text-text-primary">
            Scholars
          </Link>
          <Link href="/admin/relationships" className="text-sm text-text-secondary hover:text-text-primary">
            Relationships
          </Link>
          <Link href="/admin/books" className="text-sm text-text-secondary hover:text-text-primary">
            Books
          </Link>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-48 h-[calc(100vh-4rem)] bg-surface border-r border-border p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/admin/scholars" className="block px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary">
                Scholars
              </Link>
            </li>
            <li>
              <Link href="/admin/relationships" className="block px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary">
                Relationships
              </Link>
            </li>
            <li>
              <Link href="/admin/books" className="block px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary">
                Books
              </Link>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
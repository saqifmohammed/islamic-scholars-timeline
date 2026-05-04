import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About - Islamic Scholar Graph",
  description: "About the Islamic Scholar Graph project",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="h-16 bg-surface border-b border-border px-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-text-primary">
          Islamic Scholar Graph
        </Link>
        <Link href="/admin" className="text-sm text-text-secondary hover:text-text-primary">
          Admin
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-text-primary mb-6">About This Project</h1>
        
        <div className="space-y-6 text-text-secondary">
          <p>
            The Islamic Scholar Graph is an interactive visualization of the transmission 
            of Islamic knowledge across generations, following the traditional concept of 
            <em>Isnad</em> (chain of transmission).
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-4">Purpose</h2>
          <p>
            This project aims to make the rich scholarly traditions of Islam more accessible 
            by visualizing teacher-student relationships that span centuries.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-4">Methodology</h2>
          <p>
            Data is compiled from reliable classical sources on biographical history 
            (<em>Rijal</em>) and the sciences of Hadith and Fiqh.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-4">Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Interactive graph visualization</li>
            <li>Filter by generation and madhhab</li>
            <li>Detailed scholar profiles</li>
            <li>Admin panel for data management</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Islamic Scholar Graph",
  description: "Interactive visualization of Islamic scholarly transmission chains",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
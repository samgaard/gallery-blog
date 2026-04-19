'use client'

import { useRouter } from 'next/navigation'

const CATEGORIES = ['Portraits', 'Pictures', 'Installations', 'Notebooks'] as const

export function CarouselCategoryFilter({ activeCategory }: { activeCategory: string | null }) {
  const router = useRouter()

  return (
    <select
      value={activeCategory ?? ''}
      onChange={(e) => {
        const val = e.target.value
        router.push(val ? `/?category=${val}` : '/')
      }}
      className="text-sm border rounded px-3 py-1.5 bg-background"
    >
      <option value="">All</option>
      {CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  )
}

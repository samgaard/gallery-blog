'use client'

import { useRouter } from 'next/navigation'

const CATEGORIES = ['Portraits', 'Pictures', 'Installations', 'Notebooks'] as const

export function CarouselCategoryFilter({ activeCategory }: { activeCategory: string }) {
  const router = useRouter()

  return (
    <select
      value={activeCategory ?? ''}
      onChange={(e) => router.push(`/?category=${e.target.value}`)}
      className="text-sm border rounded px-3 py-1.5 bg-background"
    >
      <option value="Portraits">Portraits</option>
      {CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  )
}

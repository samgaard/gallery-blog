import { NextResponse } from 'next/server'
import { db } from '@/db'
import { artworks } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

const CATEGORIES = ['Portraits', 'Pictures', 'Installations', 'Notebooks'] as const
const LIMIT = 20

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = CATEGORIES.find((c) => c === searchParams.get('category')) ?? null
  const offset = Math.max(0, Number(searchParams.get('offset')) || 0)

  const items = await db
    .select()
    .from(artworks)
    .where(category ? eq(artworks.category, category) : undefined)
    .orderBy(desc(artworks.createdAt))
    .limit(LIMIT)
    .offset(offset)

  return NextResponse.json({ items, hasMore: items.length === LIMIT })
}

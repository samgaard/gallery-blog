import 'dotenv/config'
import { db } from '../src/db'
import { artworks } from '../src/db/schema'
import { slugify } from '../src/lib/utils'
import { isNull, eq } from 'drizzle-orm'

async function main() {
  const rows = await db.select({ id: artworks.id, title: artworks.title })
    .from(artworks)
    .where(isNull(artworks.slug))

  console.log(`Backfilling slugs for ${rows.length} artworks…`)

  const usedSlugs = new Set<string>()

  for (const row of rows) {
    let base = slugify(row.title) || `artwork-${row.id}`
    let slug = base
    let n = 2
    while (usedSlugs.has(slug)) {
      slug = `${base}-${n++}`
    }
    usedSlugs.add(slug)

    await db.update(artworks).set({ slug }).where(eq(artworks.id, row.id))
  }

  console.log('Done.')
  process.exit(0)
}

main().catch((err) => { console.error(err); process.exit(1) })

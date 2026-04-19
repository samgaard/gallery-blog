import Link from 'next/link'
import { db } from '@/db'
import { posts } from '@/db/schema'
import { desc, count } from 'drizzle-orm'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, type SessionData } from '@/lib/auth'
import { buttonVariants } from '@/components/ui/button'

const PER_PAGE = 20

function excerpt(html: string, maxLength = 160): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s\S*$/, '') + '…'
}

function pageHref(p: number) {
  return p === 1 ? '/blog' : `/blog?page=${p}`
}

function pageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  if (current > 3) pages.push('...')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p)
  }
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const offset = (page - 1) * PER_PAGE

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  const isLoggedIn = session.isLoggedIn === true

  const [totalResult, pagePosts] = await Promise.all([
    db.select({ count: count() }).from(posts),
    db.select().from(posts).orderBy(desc(posts.createdAt)).limit(PER_PAGE).offset(offset),
  ])

  const total = totalResult[0].count
  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-8 max-w-2xl">
      {isLoggedIn && (
        <Link href="/admin/posts/new" className={buttonVariants()}>+ New post</Link>
      )}
      {pagePosts.length === 0 && (
        <p className="text-muted-foreground text-sm">No posts yet.</p>
      )}
      <div className="space-y-6">
        {pagePosts.map((post) => (
          <article key={post.id}>
            <Link href={`/blog/${post.slug}`} className="group block space-y-1">
              <p className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'numeric',
                  day: 'numeric',
                  year: '2-digit',
                })}
              </p>
              <h2 className="font-semibold text-lg group-hover:underline">{post.title}</h2>
              <p className="text-base text-foreground">{excerpt(post.body)}</p>
            </Link>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1 pt-2">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className="px-3 py-1 text-sm rounded border hover:bg-muted transition-colors">←</Link>
          )}
          {pageNumbers(page, totalPages).map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted-foreground">…</span>
            ) : (
              <Link
                key={p}
                href={pageHref(p as number)}
                className={`px-3 py-1 text-sm rounded border transition-colors ${
                  p === page ? 'bg-foreground text-background' : 'hover:bg-muted'
                }`}
              >
                {p}
              </Link>
            )
          )}
          {page < totalPages && (
            <Link href={pageHref(page + 1)} className="px-3 py-1 text-sm rounded border hover:bg-muted transition-colors">→</Link>
          )}
        </div>
      )}
    </div>
  )
}

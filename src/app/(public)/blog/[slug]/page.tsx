import { Lora } from 'next/font/google'
import { db } from '@/db'
import { posts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ImageDialog } from '@/components/image-dialog'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, type SessionData } from '@/lib/auth'

const lora = Lora({ subsets: ['latin'], variable: '--font-lora' })

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1)

  if (!post) notFound()

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  const isLoggedIn = session.isLoggedIn === true

  const hasImages = post.images && post.images.length > 0

  return (
    <div className={`${lora.variable} flex flex-col md:flex-row md:gap-8 md:items-start`}>
      <article className="w-full md:max-w-2xl md:shrink-0 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit',
              })}
            </p>
            {isLoggedIn && (
              <Link href={`/admin/posts/${post.slug}/edit`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Edit
              </Link>
            )}
          </div>
          <h1 className="font-semibold text-2xl">{post.title}</h1>
        </div>

        <div
          className="prose prose-lg max-w-none [font-family:var(--font-lora)] [color:#1c1917]"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors block pt-4">
          ← All posts
        </Link>
      </article>

      {hasImages && (
        <aside className="w-full md:flex-1 pt-6 md:pt-10">
          <div className="grid grid-cols-2 gap-2">
            {post.images!.map((url, i) => (
              <ImageDialog key={i} src={url} />
            ))}
          </div>
        </aside>
      )}
    </div>
  )
}

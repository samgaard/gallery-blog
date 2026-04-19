import { cache } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { db } from '@/db'
import { artworks } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Props = { params: Promise<{ slug: string }> }

const getArtwork = cache(async (slug: string) => {
  const [artwork] = await db.select().from(artworks).where(eq(artworks.slug, slug)).limit(1)
  return artwork ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artwork = await getArtwork(slug)
  if (!artwork) return {}

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Gallery'
  const description = artwork.description
    ? artwork.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200)
    : (artwork.altText ?? artwork.title)

  return {
    title: `${artwork.title} — ${siteName}`,
    description,
    openGraph: {
      title: artwork.title,
      description,
      siteName,
      images: [{ url: artwork.imageUrl, alt: artwork.altText ?? artwork.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: artwork.title,
      description,
      images: [artwork.imageUrl],
    },
  }
}

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params
  const artwork = await getArtwork(slug)
  if (!artwork) notFound()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
        <Image
          src={artwork.imageUrl}
          alt={artwork.altText ?? artwork.title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 672px"
          priority
        />
      </div>
      <div className="space-y-2">
        <h1 className="font-semibold text-xl">{artwork.title}</h1>
        {artwork.description && (
          <div
            className="text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: artwork.description }}
          />
        )}
      </div>
      <Link href="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
        ← Back to gallery
      </Link>
    </div>
  )
}

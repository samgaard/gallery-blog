'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import { ArtworkLightbox } from './artwork-lightbox'
import type { artworks } from '@/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

type Artwork = InferSelectModel<typeof artworks>

export function GalleryGrid({ artworks, priorityCount = 0 }: { artworks: Artwork[]; priorityCount?: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const galleryUrlRef = useRef<string | null>(null)
  if (typeof window !== 'undefined' && galleryUrlRef.current === null) {
    galleryUrlRef.current = window.location.href
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {artworks.map((artwork, i) => (
          <button
            key={artwork.id}
            onClick={() => setOpenIndex(i)}
            className="group aspect-square relative overflow-hidden rounded-md bg-muted cursor-pointer block w-full"
          >
            <Image
              src={artwork.imageUrl}
              alt={artwork.altText ?? artwork.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
              priority={i < priorityCount}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white text-xs font-medium leading-tight line-clamp-2">{artwork.title}</p>
            </div>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <ArtworkLightbox
          artworks={artworks}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() => setOpenIndex((i) => (i !== null && i < artworks.length - 1 ? i + 1 : i))}
          getArtworkUrl={(id) => `/gallery/${artworks.find((a) => a.id === id)?.slug ?? id}`}
          onCloseUrl={galleryUrlRef.current ?? '/gallery'}
        />
      )}
    </>
  )
}

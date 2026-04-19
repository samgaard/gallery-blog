'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArtworkLightbox } from './artwork-lightbox'
import type { artworks } from '@/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

type Artwork = InferSelectModel<typeof artworks>

export function ArtworkZoom({ artwork }: { artwork: Artwork }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative w-full cursor-zoom-in"
        aria-label="View full screen"
      >
        <Image
          src={artwork.imageUrl}
          alt={artwork.altText ?? artwork.title}
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, 672px"
          className="w-full h-auto rounded-md"
          priority
        />
      </button>

      {open && (
        <ArtworkLightbox
          artworks={[artwork]}
          index={0}
          onClose={() => setOpen(false)}
          onPrev={() => {}}
          onNext={() => {}}
        />
      )}
    </>
  )
}

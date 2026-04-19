'use client'

import Image from 'next/image'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'
import { ArtworkLightbox } from '@/components/artwork-lightbox'
import type { artworks } from '@/db/schema'
import type { InferSelectModel } from 'drizzle-orm'
import Autoplay from 'embla-carousel-autoplay'

type Artwork = InferSelectModel<typeof artworks>

export function ArtworkCarousel({ artworks: initial, category }: { artworks: Artwork[]; category: string }) {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))
  const [items, setItems] = useState<Artwork[]>(initial)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const homeUrlRef = useRef<string | null>(null)
  const offsetRef = useRef(initial.length)
  const apiRef = useRef<CarouselApi>(null)

  if (typeof window !== 'undefined' && homeUrlRef.current === null) {
    homeUrlRef.current = window.location.href
  }

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoading(true)
    const res = await fetch(`/api/artworks?category=${category}&offset=${offsetRef.current}`)
    const data = await res.json()
    setItems((prev) => [...prev, ...data.items])
    offsetRef.current += data.items.length
    setHasMore(data.hasMore)
    loadingRef.current = false
    setLoading(false)
  }, [hasMore, category])

  useEffect(() => {
    if (apiRef.current) apiRef.current.reInit()
  }, [items.length])

  const onApiChange = useCallback((api: CarouselApi) => {
    if (!api) return
    apiRef.current = api
    api.on('select', () => {
      if (!api.canScrollNext()) loadMore()
    })
  }, [loadMore])

  return (
    <div className="relative">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        setApi={onApiChange}
      >
        <CarouselContent className="ml-0">
          {items.map((artwork, i) => (
            <CarouselItem key={artwork.id} className="pl-0 basis-1/2 sm:basis-1/3 md:basis-1/4">
              <button
                onClick={() => setOpenIndex(i)}
                className="group aspect-[3/4] relative overflow-hidden bg-muted cursor-pointer block w-full"
              >
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.altText ?? artwork.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-medium leading-tight line-clamp-2">{artwork.title}</p>
                </div>
              </button>
            </CarouselItem>
          ))}
          {loading && (
            <CarouselItem className="pl-0 basis-1/2 sm:basis-1/3 md:basis-1/4">
              <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10" />
        <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10" />
      </Carousel>

      {openIndex !== null && (
        <ArtworkLightbox
          artworks={items}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() => setOpenIndex((i) => (i !== null && i < items.length - 1 ? i + 1 : i))}
          getArtworkUrl={(id) => `/gallery/${items.find((a) => a.id === id)?.slug ?? id}`}
          onCloseUrl={homeUrlRef.current ?? '/'}
          loadingMore={loading}
        />
      )}
    </div>
  )
}

'use client'

import Image from 'next/image'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'
import { ArtworkLightbox } from '@/components/artwork-lightbox'
import type { artworks } from '@/db/schema'
import type { InferSelectModel } from 'drizzle-orm'
import Autoplay from 'embla-carousel-autoplay'

type Artwork = InferSelectModel<typeof artworks>

const CATEGORIES = ['Portraits', 'Pictures', 'Installations', 'Notebooks'] as const

export function ArtworkCarousel({ artworks: initial }: { artworks: Artwork[] }) {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))
  const [category, setCategory] = useState('')
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

  const loadMore = useCallback(async (cat: string, offset: number, replace = false) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    const res = await fetch(`/api/artworks?category=${cat}&offset=${offset}`)
    const data = await res.json()
    setItems((prev) => replace ? data.items : [...prev, ...data.items])
    offsetRef.current = offset + data.items.length
    setHasMore(data.hasMore)
    loadingRef.current = false
    setLoading(false)
  }, [])

  const onCategoryChange = useCallback(async (cat: string) => {
    setCategory(cat)
    setItems([])
    setHasMore(true)
    offsetRef.current = 0
    loadingRef.current = false
    await loadMore(cat, 0, true)
  }, [loadMore])

  useEffect(() => {
    if (apiRef.current) apiRef.current.reInit()
  }, [items.length])

  const onApiChange = useCallback((api: CarouselApi) => {
    if (!api) return
    apiRef.current = api
    api.on('select', () => {
      if (!api.canScrollNext()) loadMore(category, offsetRef.current)
    })
  }, [loadMore, category])

  return (
    <div className="space-y-3">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="text-sm border rounded px-3 py-1.5 bg-background"
      >
        <option value="">All</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

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
    </div>
  )
}

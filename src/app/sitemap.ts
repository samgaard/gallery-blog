import { MetadataRoute } from 'next'
import { db } from '@/db'
import { posts } from '@/db/schema'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = await db.select({ slug: posts.slug, createdAt: posts.createdAt }).from(posts)

  const postEntries: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.createdAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/gallery`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    ...postEntries,
  ]
}

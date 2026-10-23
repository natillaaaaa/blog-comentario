// content.config.ts
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        author: z.string(),
        date: z.date(),
        image: z.string(),
        tags: z.array(z.string()).default([])
      })
    })
  }
})

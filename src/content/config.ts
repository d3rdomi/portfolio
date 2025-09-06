import { defineCollection, z } from 'astro:content';

// Design Collection
const design = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string().optional(),
    altText: z.string().optional(),
    text: z.string(),
    images: z.array(z.string()).optional(),
    link: z.string().optional(),
    copyright: z.string().optional(),
  }),
});

// Motion Design Collection
/* const motionDesign = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    text: z.string(),
    images: z.array(z.string()).optional(),
  }),
});

// Photography Collection
const photography = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    text: z.string(),
    images: z.array(z.string()).optional(),
  }),
}); */

export const collections = {
  design,
  'motion-design': motionDesign,
  photography,
};
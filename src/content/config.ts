import { defineCollection, z } from 'astro:content';

const blockSchema = z.discriminatedUnion('discriminant', [
  z.object({
    discriminant: z.literal('text'),
    value: z.object({ content: z.string() }),
  }),
  z.object({
    discriminant: z.literal('image'),
    value: z.object({
      src: z.string(),
      alt: z.string().optional(),
      caption: z.string().optional(),
    }),
  }),
  z.object({
    discriminant: z.literal('imageText'),
    value: z.object({
      image: z.string(),
      alt: z.string().optional(),
      text: z.string(),
      imagePosition: z.enum(['left', 'right']),
    }),
  }),
]);

// About Collection
const aboutMe = defineCollection({
  type: 'content',
  schema: z.object({
    portrait: z.string(),
  }),
});

// Design Collection
const design = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    thumbnail: z.string().optional(),
    heroImageDesktop: z.string().optional(),
    heroImageMobile: z.string().optional(),
    altText: z.string().optional(),
    ImageCarousel: z.array(
      z.object({
        title: z.string(),
        text: z.string(),
        image: z.string(),
        altText: z.string().optional(),
      })
    ).optional(),
    blocks: z.array(blockSchema).optional(),
    backgroundColor: z.string().optional(),
    link: z.string().optional(),
    copyright: z.string().optional(),
  }),
});

// Concepts Collection
const concepts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    thumbnail: z.string().optional(),
    heroImageDesktop: z.string().optional(),
    heroImageMobile: z.string().optional(),
    altText: z.string().optional(),
    ImageCarousel: z.array(
      z.object({
        title: z.string(),
        text: z.string(),
        image: z.string(),
        altText: z.string().optional(),
      })
    ).optional(),
    blocks: z.array(blockSchema).optional(),
    backgroundColor: z.string().optional(),
    link: z.string().optional(),
    copyright: z.string().optional(),
  }),
});

// Photography Collection
const photography = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    images: z.array(z.string()).optional(),
	pubDate: z.coerce.date(),
	altText: z.string().optional(),
    heroImage: z.string().optional(),
	text: z.string().optional(),
  }),
});

export const collections = {
  design,
  'concepts': concepts,
  photography,
  'about-me': aboutMe,
};

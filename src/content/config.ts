import { defineCollection, z } from 'astro:content';

// Zweisprachiges Textfeld { de, en } – beide optional, Fallback passiert beim Rendern (pick()).
const tText = z
  .object({
    de: z.string().optional().default(''),
    en: z.string().optional().default(''),
  })
  .optional();

const blockSchema = z.discriminatedUnion('discriminant', [
  z.object({
    discriminant: z.literal('text'),
    value: z.object({
      headline: tText,
      content: tText,
    }),
  }),
  z.object({
    discriminant: z.literal('image'),
    value: z.object({
      src: z.string(),
      alt: tText,
    }),
  }),
  z.object({
    discriminant: z.literal('imageText'),
    value: z.object({
      image: z.string(),
      alt: tText,
      text: tText,
      imagePosition: z.enum(['left', 'right', 'top', 'bottom']),
    }),
  }),
]);

// About Collection
const aboutMe = defineCollection({
  type: 'content',
  schema: z.object({
    portrait: z.string(),
    textEn: z.string().optional(),
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
    altText: tText,
    contentEn: z.string().optional(),
    ImageCarousel: z.array(
      z.object({
        image: z.string(),
        altText: tText,
      })
    ).optional(),
    blocks: z.array(blockSchema).optional(),
    backgroundColor: z.string().optional(),
    copyright: z.string().optional(),
    button: z.object({
      buttonLink: z.string().optional(),
      buttonLabel: tText,
    }).optional(),
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
    altText: tText,
    contentEn: z.string().optional(),
    ImageCarousel: z.array(
      z.object({
        image: z.string(),
        altText: tText,
      })
    ).optional(),
    blocks: z.array(blockSchema).optional(),
    backgroundColor: z.string().optional(),
    copyright: z.string().optional(),
    button: z.object({
      buttonLink: z.string().optional(),
      buttonLabel: tText,
    }).optional(),
  }),
});

// Photography Collection
const photography = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    images: z.array(z.string()).optional(),
    pubDate: z.coerce.date(),
    altText: tText,
    heroImage: z.string().optional(),
    text: tText,
    contentEn: z.string().optional(),
  }),
});

export const collections = {
  design,
  'concepts': concepts,
  photography,
  'about-me': aboutMe,
};

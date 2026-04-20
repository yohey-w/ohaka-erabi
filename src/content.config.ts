import { defineCollection, z } from 'astro:content';

const personSchema = z.object({
  name: z.string(),
  url: z.string().url().optional(),
  sameAs: z.array(z.string().url()).optional(),
  type: z.enum(['Person', 'Organization']).optional(),
});

const personLikeSchema = z.union([z.string(), personSchema]);

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  category: z.enum(['ranking', 'vs', 'area', 'review', 'specialty', 'guide']),
  area: z.string().optional(),
  keyword: z.string().optional(),
  services: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  author: personLikeSchema.optional(),
  authors: z.array(personLikeSchema).optional(),
  supervisor: personLikeSchema.optional(),
  reviewedBy: personLikeSchema.optional(),
  expert: personLikeSchema.optional(),
  noindex: z.boolean().default(false),
});

const ranking = defineCollection({ type: 'content', schema: articleSchema });
const vs = defineCollection({ type: 'content', schema: articleSchema });
const area = defineCollection({ type: 'content', schema: articleSchema });
const review = defineCollection({ type: 'content', schema: articleSchema });
const guide = defineCollection({ type: 'content', schema: articleSchema });

export const collections = { ranking, vs, area, review, guide };

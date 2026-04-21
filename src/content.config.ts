import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const blogCollection = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		author: z.string().optional(),
		subtitle: z.string().optional(),
		description: z.string().optional(),
		published: z.boolean(),
		date: z.date().transform((date) => {
			// Convert to YYYY-MM-DD string
			const iso = date.toISOString().split("T")[0]; // "2025-07-11"
			const [year, month, day] = iso.split("-").map(Number);

			// Reconstruct Date at local midnight
			return new Date(year, month - 1, day);
		}).optional(),
		tags: z.array(z.string()).optional(),
	}),
});

const jobCollection = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/jobs' }),
	schema: z.object({
		title: z.string(),
		pricing: z.string(),
		summary: z.string().optional(),
		published: z.boolean(),
		tags: z.array(z.string()).optional(),
	}),
});

export const collections = { blog: blogCollection, jobs: jobCollection };

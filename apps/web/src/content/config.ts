import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const mediaItem = z.object({
    src: z.string(),
    alt: z.string().optional(),
    title: z.string().optional(),
});

const posts = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
    schema: z.object({
        type: z.enum(["note", "photo", "audio", "video"]).default("note"),
        date: z.coerce.date(),
        title: z.string().optional(),
        location: z.string().optional(),
        media: z.array(mediaItem).optional(),
        tags: z.array(z.string()).optional(),
    }),
});

export const collections = { posts };

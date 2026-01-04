#!/usr/bin/env node

import { confirm, input, select } from "@inquirer/prompts";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = join(__dirname, "../src/content/posts");

// Schema matching src/content/config.ts
const mediaItem = z.object({
  src: z.string(),
  alt: z.string().optional(),
  title: z.string().optional(),
});

const postSchema = z.object({
  type: z.enum(["note", "photo", "audio", "video"]).default("note"),
  date: z.coerce.date(),
  title: z.string().optional(),
  location: z.string().optional(),
  media: z.array(mediaItem).optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Generate a URL-safe slug from text
 */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

/**
 * Generate filename with date prefix and slug
 */
function generateFilename(date, title, content) {
  const dateStr = date.toISOString().split("T")[0];
  const slugSource = title || content.split("\n")[0] || "post";
  let slug = slugify(slugSource);

  if (!slug) slug = "post";

  let filename = `${dateStr}-${slug}.md`;
  let filepath = join(POSTS_DIR, filename);

  // Handle duplicates
  let counter = 2;
  while (existsSync(filepath)) {
    filename = `${dateStr}-${slug}-${counter}.md`;
    filepath = join(POSTS_DIR, filename);
    counter++;
  }

  return { filename, filepath };
}

/**
 * Format frontmatter as YAML
 */
function formatFrontmatter(data) {
  const lines = ["---"];

  lines.push(`type: ${data.type}`);
  lines.push(`date: ${data.date.toISOString()}`);

  if (data.title) {
    lines.push(`title: ${data.title}`);
  }

  if (data.location) {
    lines.push(`location: ${data.location}`);
  }

  if (data.tags && data.tags.length > 0) {
    lines.push("tags:");
    for (const tag of data.tags) {
      lines.push(`  - ${tag}`);
    }
  }

  if (data.media && data.media.length > 0) {
    lines.push("media:");
    for (const item of data.media) {
      lines.push(`  - src: ${item.src}`);
      if (item.alt) {
        lines.push(`    alt: ${item.alt}`);
      }
      if (item.title) {
        lines.push(`    title: ${item.title}`);
      }
    }
  }

  lines.push("---");
  return lines.join("\n");
}

/**
 * Prompt for media items (for photo/audio/video types)
 */
async function promptMedia() {
  const media = [];

  const addMedia = await confirm({
    message: "Add media?",
    default: false,
  });

  if (!addMedia) return media;

  let addMore = true;
  while (addMore) {
    const src = await input({
      message: "Media URL:",
      validate: (value) => {
        if (!value.trim()) return "URL is required";
        try {
          new URL(value);
          return true;
        } catch {
          return "Please enter a valid URL";
        }
      },
    });

    const alt = await input({
      message: "Alt text (optional):",
    });

    const title = await input({
      message: "Title (optional):",
    });

    const item = { src: src.trim() };
    if (alt.trim()) item.alt = alt.trim();
    if (title.trim()) item.title = title.trim();

    media.push(item);

    addMore = await confirm({
      message: "Add another media item?",
      default: false,
    });
  }

  return media;
}

/**
 * Main CLI flow
 */
async function main() {
  console.log("\n📝 Create a new post\n");

  try {
    // Post type
    const type = await select({
      message: "Post type:",
      choices: [
        { value: "note", name: "note" },
        { value: "photo", name: "photo" },
        { value: "audio", name: "audio" },
        { value: "video", name: "video" },
      ],
    });

    // Content
    const content = await input({
      message: "Content:",
      validate: (value) => (value.trim() ? true : "Content is required"),
    });

    // Title (optional)
    const title = await input({
      message: "Title (optional):",
    });

    // Location (optional)
    const location = await input({
      message: "Location (optional):",
    });

    // Tags (optional)
    const tagsInput = await input({
      message: "Tags (comma-separated, optional):",
    });

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Media (for non-note types, or optionally for notes)
    let media = [];
    if (type !== "note") {
      media = await promptMedia();
    } else {
      const wantMedia = await confirm({
        message: "Add media to this note?",
        default: false,
      });
      if (wantMedia) {
        media = await promptMedia();
      }
    }

    // Build frontmatter data
    const date = new Date();
    const frontmatterData = {
      type,
      date,
      ...(title.trim() && { title: title.trim() }),
      ...(location.trim() && { location: location.trim() }),
      ...(tags.length > 0 && { tags }),
      ...(media.length > 0 && { media }),
    };

    // Validate against schema
    const result = postSchema.safeParse(frontmatterData);
    if (!result.success) {
      console.error("\n❌ Validation failed:");
      console.error(result.error.format());
      process.exit(1);
    }

    // Ensure posts directory exists
    if (!existsSync(POSTS_DIR)) {
      mkdirSync(POSTS_DIR, { recursive: true });
    }

    // Generate filename and write file
    const { filename, filepath } = generateFilename(
      date,
      title.trim(),
      content.trim()
    );
    const frontmatter = formatFrontmatter(result.data);
    const fileContent = `${frontmatter}\n\n${content.trim()}\n`;

    writeFileSync(filepath, fileContent, "utf-8");

    console.log(`\n✅ Created: src/content/posts/${filename}\n`);
  } catch (error) {
    if (error.name === "ExitPromptError") {
      console.log("\n👋 Cancelled\n");
      process.exit(0);
    }
    throw error;
  }
}

main();

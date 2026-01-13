import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts");
  const sortedPosts = posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: "Cosmic Garden",
    description: "Posts from Cosmic Garden",
    site: context.site || "https://cosmic.garden",
    items: sortedPosts.map((post) => ({
      title: post.data.title || post.data.type,
      pubDate: post.data.date,
      link: `/posts/${post.id}/`,
    })),
  });
}

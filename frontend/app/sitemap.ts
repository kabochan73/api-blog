import { MetadataRoute } from "next";

const BASE_URL = "https://api-blog-navy.vercel.app";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  try {
    const res = await fetch(`${API_URL}/posts`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const posts = Array.isArray(data) ? data : data.data ?? [];

    const postPages: MetadataRoute.Sitemap = posts.map(
      (post: { id: number; updated_at: string }) => ({
        url: `${BASE_URL}/posts/${post.id}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    );

    return [...staticPages, ...postPages];
  } catch {
    return staticPages;
  }
}

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  author?: string;
  cover?: string;
  tags?: string[];
  readingMinutes: number;
};

export type BlogPost = BlogPostMeta & {
  html: string;
};

function estimateReadingMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

async function readPostFile(fileName: string): Promise<BlogPost | null> {
  if (!fileName.endsWith(".md")) return null;
  const slug = fileName.replace(/\.md$/, "");
  const filePath = path.join(BLOG_DIR, fileName);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);
  return {
    slug,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? new Date().toISOString().slice(0, 10)),
    author: data.author ? String(data.author) : undefined,
    cover: data.cover ? String(data.cover) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    readingMinutes: estimateReadingMinutes(content),
    html: processed.toString()
  };
}

export async function listBlogPosts(): Promise<BlogPostMeta[]> {
  let files: string[];
  try {
    files = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }
  const posts = (await Promise.all(files.map(readPostFile))).filter((p): p is BlogPost => p !== null);
  return posts
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ html: _html, ...meta }) => meta);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return readPostFile(`${slug}.md`);
}

export function formatDutchDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Shell } from "@/components/shell";
import { listBlogPosts, formatDutchDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog, praktische artikelen voor MKB-ondernemers",
  description:
    "Praktische artikelen over webdesign, automatisering en AI voor het Nederlandse MKB. Wat werkt, wat niet, en hoe je er zelf mee aan de slag kunt."
};

export default async function BlogIndexPage() {
  const posts = await listBlogPosts();

  return (
    <Shell>
      <section className="hazenco-hero">
        <div className="page">
          <div className="hazenco-hero-inner">
            <p className="eyebrow">Blog</p>
            <h1>Praktische artikelen voor MKB-ondernemers.</h1>
            <p className="lead">
              Geen jargon, geen leadmagnet-trucs. Wat werkt in webdesign, automatisering en AI, en wat het
              realistisch oplevert.
            </p>
          </div>
        </div>
      </section>

      <div className="page">
        <section className="hazenco-section">
          {posts.length > 0 ? (
            <div className="blog-list">
              {posts.map((post) => (
                <article key={post.slug} className="blog-list-item">
                  <div className="blog-list-meta">
                    <time dateTime={post.date}>{formatDutchDate(post.date)}</time>
                    <span className="blog-list-reading">
                      <Clock size={12} /> {post.readingMinutes} min
                    </span>
                  </div>
                  <h2>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p>{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="blog-list-link">
                    Lees verder <ArrowRight size={13} />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "var(--green-700)" }}>
              Nog geen posts. Kom binnenkort terug!
            </p>
          )}
        </section>
      </div>
    </Shell>
  );
}

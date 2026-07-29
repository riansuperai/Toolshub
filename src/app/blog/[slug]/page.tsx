import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Shell } from "@/components/shell";
import { getBlogPost, listBlogPosts, formatDutchDate } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = await listBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post niet gevonden" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <Shell>
      <div className="page">
        <Link className="blog-back-link" href="/blog">
          <ArrowLeft size={14} /> Terug naar blog
        </Link>

        <article className="blog-post">
          <header className="blog-post-header">
            <div className="blog-post-meta">
              <time dateTime={post.date}>{formatDutchDate(post.date)}</time>
              <span>
                <Clock size={12} /> {post.readingMinutes} min lezen
              </span>
              {post.author ? <span>Door {post.author}</span> : null}
            </div>
            <h1>{post.title}</h1>
            <p className="blog-post-excerpt">{post.excerpt}</p>
          </header>

          <div
            className="blog-post-body"
            /* html komt van eigen markdown-bestanden onder ./content/blog, geen user-input */
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>

        <section className="hazenco-contact-band">
          <div className="hazenco-contact-inner">
            <h2>Vragen over dit onderwerp?</h2>
            <p>Plan een kort gesprek — we bespreken hoe dit in jouw situatie zou werken.</p>
            <div className="hazenco-contact-cta">
              <Link href="/contact" className="button">
                Plan een gesprek <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}

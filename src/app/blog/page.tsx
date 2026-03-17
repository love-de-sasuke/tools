import Link from "next/link";
import { buildMetadata, jsonLdWebPage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { prisma } from "@/lib/prisma";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Finance calculator guides, formula explanations, and comparisons written for clarity and responsible YMYL publishing.",
  pathname: "/blog"
});

export default async function BlogIndexPage() {
  const canQueryDb = Boolean(process.env.DATABASE_URL);
  const posts = canQueryDb
    ? await prisma.blogPost.findMany({
        where: { publishedAt: { not: null } },
        orderBy: { publishedAt: "desc" },
        select: { slug: true, title: true, description: true, publishedAt: true }
      })
    : [];

  return (
    <>
      <JsonLd
        data={jsonLdWebPage({
          name: "Blog",
          description: "Finance calculator blog and guides.",
          pathname: "/blog"
        })}
      />

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Blog</h1>
        <p className="text-slate-700">Actionable guides with formulas, assumptions, and responsible disclaimers.</p>
      </header>

      <section className="mt-8 space-y-4">
        {posts.length === 0 ? (
          <div className="card p-6">
            <p className="text-slate-700">
              No published posts yet. Once you add posts to the database, this page and the sitemap will update automatically.
            </p>
          </div>
        ) : (
          posts.map((p) => (
            <article key={p.slug} className="card p-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                <Link className="no-underline hover:underline" href={`/blog/${p.slug}`}>
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 text-slate-700">{p.description}</p>
              {p.publishedAt ? <p className="mt-3 text-xs text-slate-500">Published {p.publishedAt.toISOString().slice(0, 10)}</p> : null}
            </article>
          ))
        )}
      </section>
    </>
  );
}


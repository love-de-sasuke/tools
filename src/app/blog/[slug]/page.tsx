import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata, jsonLdFaqPage, jsonLdWebPage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  if (!process.env.DATABASE_URL) return {};
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    select: { title: true, description: true, publishedAt: true, updatedAt: true }
  });
  if (!post || !post.publishedAt) return {};

  return buildMetadata({
    title: post.title,
    description: post.description,
    pathname: `/blog/${params.slug}`,
    ogType: "article",
    publishedTime: post.publishedAt.toISOString(),
    modifiedTime: post.updatedAt.toISOString()
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  if (!process.env.DATABASE_URL) return notFound();

  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: { faqItems: { orderBy: { sortOrder: "asc" } } }
  });
  if (!post || !post.publishedAt) return notFound();

  const faqItems = post.faqItems.map((i) => ({ question: i.question, answer: i.answer }));

  return (
    <>
      <JsonLd
        data={[
          jsonLdWebPage({
            name: post.title,
            description: post.description,
            pathname: `/blog/${post.slug}`
          }),
          ...(faqItems.length ? [jsonLdFaqPage({ items: faqItems })] : [])
        ]}
      />

      <article className="prose prose-slate max-w-none">
        <h1>{post.title}</h1>
        <p className="text-slate-600">{post.description}</p>
        <p className="text-xs text-slate-500">
          Published {post.publishedAt.toISOString().slice(0, 10)} · Updated {post.updatedAt.toISOString().slice(0, 10)}
        </p>
        <hr />
        <pre className="whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-900">
          {post.contentMd}
        </pre>
      </article>
    </>
  );
}


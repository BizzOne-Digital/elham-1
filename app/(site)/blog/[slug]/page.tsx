import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { buildArticleSchema, buildPageMetadata, serializeJsonLd } from "@/lib/seo/metadata";
import { getPostBySlug, getPostSlugs, getPublishedPosts } from "@/lib/data/blog";
import { ROUTES, SEED_IMAGES } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getPostBySlug(slug), getPublishedPosts()]);
  if (!post) notFound();

  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 2);
  const schema = buildArticleSchema({
    title: post.title,
    description: post.excerpt ?? post.title,
    path: `/blog/${slug}`,
    publishedTime: post.publishedAt ?? new Date().toISOString(),
    image: post.featuredImage?.url,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />

      <article>
        <section className="section-pad bg-carbon">
          <div className="container-site mx-auto max-w-3xl text-center">
            <Breadcrumbs
              centered
              items={[
                { label: "Home", href: "/" },
                { label: "Insights", href: ROUTES.blog },
                { label: post.title },
              ]}
            />
            <h1 className="mt-6 text-4xl font-bold">{post.title}</h1>
            {post.excerpt && <p className="mx-auto mt-4 max-w-2xl text-xl text-concrete">{post.excerpt}</p>}
            <p className="mt-4 text-sm text-steel">
              {post.readingTimeMinutes ? `${post.readingTimeMinutes} min read` : "Article"}
            </p>
          </div>
        </section>

        <section className="section-pad pt-0">
          <div className="container-site max-w-4xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={post.featuredImage?.url ?? SEED_IMAGES.strategy}
                alt={post.featuredImage?.alt ?? post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          </div>
        </section>

        <section className="section-pad">
          <ScrollReveal className="container-site max-w-3xl prose prose-invert prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </ScrollReveal>
        </section>

        <section className="section-pad bg-graphite">
          <div className="container-site grid gap-4 md:grid-cols-2">
            {[SEED_IMAGES.automation, SEED_IMAGES.seo].map((src) => (
              <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <Image src={src} alt="" fill className="object-cover" sizes="50vw" />
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="section-pad">
            <div className="container-site">
              <h2 className="mb-6 text-2xl font-bold">Related posts</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {related.map((item) => (
                  <a key={item._id} href={`/blog/${item.slug}`} className="rounded-xl border border-white/10 p-4 hover:border-signal-red/40">
                    <h3 className="font-bold">{item.title}</h3>
                    {item.excerpt && <p className="mt-2 text-sm text-steel">{item.excerpt}</p>}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}

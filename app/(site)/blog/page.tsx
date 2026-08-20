import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getPublishedPosts } from "@/lib/data/blog";
import { SEED_IMAGES } from "@/lib/constants";

export const metadata = buildPageMetadata({
  title: "Insights",
  description: "Practical articles on websites, automation, SEO, ads, and small-business growth.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const featured = posts.find((p) => p.isFeatured) ?? posts[0];

  return (
    <>
      <section className="section-pad bg-carbon grain">
        <div className="container-site">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <Breadcrumbs centered items={[{ label: "Home", href: "/" }, { label: "Insights" }]} />
            <p className="label-caps mb-4 text-signal-red">Insights</p>
            <h1 className="text-4xl font-bold sm:text-5xl">Ideas for practical growth</h1>
          </ScrollReveal>
        </div>
      </section>

      {featured && (
        <section className="section-pad">
          <div className="container-site">
            <Link href={`/blog/${featured.slug}`} className="group grid min-w-0 overflow-hidden rounded-3xl border border-white/10 lg:grid-cols-2">
              <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[360px]">
                <Image
                  src={featured.featuredImage?.url ?? SEED_IMAGES.strategy}
                  alt={featured.featuredImage?.alt ?? featured.title}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="50vw"
                  priority
                />
              </div>
              <div className="flex min-w-0 flex-col justify-center p-6 sm:p-8">
                <p className="label-caps mb-3">Featured</p>
                <h2 className="text-3xl font-bold">{featured.title}</h2>
                {featured.excerpt && <p className="mt-4 text-concrete">{featured.excerpt}</p>}
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="section-pad bg-graphite">
        <div className="container-site min-w-0 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <ScrollReveal key={post._id} delay={index * 0.05}>
              <Link href={`/blog/${post.slug}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-carbon">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={post.featuredImage?.url ?? SEED_IMAGES.webDesign}
                    alt={post.featuredImage?.alt ?? post.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="33vw"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-bold">{post.title}</h2>
                  {post.excerpt && <p className="mt-2 text-sm text-steel">{post.excerpt}</p>}
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}

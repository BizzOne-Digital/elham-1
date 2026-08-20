import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { TransitionLink } from "@/components/animations/PageTransition";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getPublishedTestimonials } from "@/lib/data/testimonials";
import { PRIMARY_CTA } from "@/lib/constants";

export const metadata = buildPageMetadata({
  title: "Testimonials",
  description: "Approved client testimonials and credibility from Netbrandit.",
  path: "/testimonials",
});

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <>
      <section className="section-pad bg-carbon grain">
        <div className="container-site">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <Breadcrumbs centered items={[{ label: "Home", href: "/" }, { label: "Testimonials" }]} />
            <h1 className="text-4xl font-bold">Client voices</h1>
            <p className="mx-auto mt-4 max-w-2xl text-concrete">
              Small-business owners sharing their experience working with Netbrandit.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          {testimonials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((item, index) => (
                <ScrollReveal key={item._id} delay={index * 0.05}>
                  <blockquote className="h-full min-w-0 rounded-2xl border border-white/10 bg-graphite p-6">
                    <p className="wrap-anywhere text-lg text-concrete">&ldquo;{item.content}&rdquo;</p>
                    <footer className="mt-4 font-semibold">
                      {item.name}
                      {(item.role || item.company) && (
                        <span className="block text-sm text-steel">
                          {[item.role, item.company].filter(Boolean).join(" · ")}
                        </span>
                      )}
                    </footer>
                  </blockquote>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/20 p-10 text-center">
              <h2 className="text-2xl font-bold">Approved testimonials coming soon</h2>
              <p className="mx-auto mt-3 max-w-xl text-concrete">
                We never publish invented reviews. Add approved testimonials from the admin portal when ready.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section-pad bg-graphite text-center">
        <TransitionLink href={PRIMARY_CTA.href} className="inline-flex min-h-11 items-center rounded-full bg-signal-red px-8 py-3 font-semibold">
          {PRIMARY_CTA.label}
        </TransitionLink>
      </section>
    </>
  );
}

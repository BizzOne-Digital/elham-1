import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/data/settings";
import { DEFAULT_TERMS_OF_SERVICE_HTML, resolveLegalContent } from "@/lib/legal/content";

export const metadata = buildPageMetadata({
  title: "Terms of Service",
  description: "Terms of service for Netbrandit website, forms, and engagement.",
  path: "/terms",
});

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const content = resolveLegalContent(
    settings.legal?.termsOfServiceContent,
    DEFAULT_TERMS_OF_SERVICE_HTML.replace(
      "info@netbrandit.com",
      settings.contact.email ?? "info@netbrandit.com",
    ),
  );

  return (
    <section className="section-pad">
      <div className="container-site max-w-3xl">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <Breadcrumbs centered items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />
          <h1 className="mt-6 text-4xl font-bold">Terms of Service</h1>
          <div className="prose prose-invert mx-auto mt-8 max-w-none overflow-x-auto text-concrete max-lg:text-center lg:text-left" dangerouslySetInnerHTML={{ __html: content }} />
        </ScrollReveal>
      </div>
    </section>
  );
}

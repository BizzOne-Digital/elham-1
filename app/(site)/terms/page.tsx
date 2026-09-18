import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata = buildPageMetadata({
  title: "Terms of Service",
  description: "Terms of service for Netbrandit website, forms, and engagement.",
  path: "/terms",
});

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const content =
    settings.legal?.termsOfServiceContent ??
    `<p><strong>Placeholder — owner/legal review required.</strong></p>
<p>By using the Netbrandit website and submitting forms or booking requests, you agree to these terms.</p>
<p>Information on this website is provided for general guidance. Proposals, pricing, and timelines are confirmed in writing after discovery.</p>
<p>Netbrandit does not guarantee search rankings, ad performance, lead volume, revenue, or return on ad spend. Marketing outcomes depend on many factors outside our control.</p>
<p>Clients are responsible for accurate information, timely feedback, legal compliance of claims and assets, and approvals before launch.</p>
<p>Discovery calls are free and do not require payment. Paid work begins only after a mutually agreed proposal.</p>
<p>Uploaded assets must be owned or licensed by the client. Netbrandit is not liable for third-party platform policy changes.</p>
<p>These terms may be updated. Continued use of the site after updates constitutes acceptance.</p>
<p>Questions: ${settings.contact.email ?? "info@netbrandit.com"}</p>`;

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

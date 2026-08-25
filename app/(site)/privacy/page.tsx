import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ScrollReveal } from "@/components/animations/ScrollAnimations";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for Netbrandit website forms, bookings, and communications.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const content =
    settings.legal?.privacyPolicyContent ??
    `<p><strong>Placeholder — owner/legal review required.</strong></p>
<p>Netbrandit collects information you submit through contact forms, growth-plan requests, and booking flows. This may include your name, business name, email, phone number, website, service interests, budget range, timeline, and message content.</p>
<p>We use this information to respond to inquiries, schedule discovery calls, prepare quotes, and deliver services you request. We do not sell personal information.</p>
<p>Form submissions and booking records are stored securely in our database. Email notifications are sent when SMTP is configured.</p>
<p>Cookies and analytics placeholders may be enabled later with appropriate consent mechanisms.</p>
<p>We retain inquiry data as long as needed to manage the business relationship or as required by law. You may request access or deletion by contacting ${settings.contact.email ?? "ak_2123@hotmail.com"}.</p>
<p>Third-party platforms used to deliver services (hosting, email, advertising platforms) may process data under their own terms.</p>
<p>Netbrandit does not guarantee specific marketing outcomes. Clients remain responsible for approvals, claims, assets, and platform compliance.</p>`;

  return (
    <section className="section-pad">
      <div className="container-site max-w-3xl">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <Breadcrumbs centered items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
          <h1 className="mt-6 text-4xl font-bold">Privacy Policy</h1>
          <div className="prose prose-invert mx-auto mt-8 max-w-none overflow-x-auto text-concrete max-lg:text-center lg:text-left" dangerouslySetInnerHTML={{ __html: content }} />
        </ScrollReveal>
      </div>
    </section>
  );
}

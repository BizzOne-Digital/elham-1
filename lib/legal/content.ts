export const DEFAULT_PRIVACY_POLICY_HTML = `<p><em>Last updated: ${new Date().getFullYear()}</em></p>
<h2>Overview</h2>
<p>Netbrandit ("we", "us") respects your privacy. This policy explains what we collect through our website, forms, and booking tools, how we use it, and the choices you have.</p>
<h2>Information we collect</h2>
<p>When you contact us, request a quote, book a call, or ask for a growth plan, we may collect:</p>
<ul>
<li>Name and business name</li>
<li>Email address and phone number</li>
<li>Preferred meeting date and time</li>
<li>Services you are interested in, budget or timeline notes, and message content</li>
<li>Technical data such as browser type, pages visited, and referral source (when analytics are enabled)</li>
</ul>
<h2>How we use information</h2>
<p>We use your information to respond to inquiries, schedule discovery calls, prepare proposals, deliver services you request, improve our website, and meet legal or accounting obligations. We do not sell personal information.</p>
<h2>Storage and security</h2>
<p>Form submissions and booking records are stored in secured systems with access limited to authorized team members. Email notifications are sent when mail services are configured.</p>
<h2>Cookies and analytics</h2>
<p>We may use cookies or similar technologies for essential site operation and, with appropriate consent where required, for analytics to understand how visitors use our site.</p>
<h2>Retention</h2>
<p>We retain inquiry and client-related data for as long as needed to manage the business relationship or as required by applicable law.</p>
<h2>Your rights</h2>
<p>You may request access, correction, or deletion of personal information we hold about you by contacting us using the details below.</p>
<h2>Third-party services</h2>
<p>Hosting, email, calendar, advertising, and analytics providers may process data under their own terms when we use their services to operate Netbrandit.</p>
<h2>Contact</h2>
<p>Questions about this policy: <a href="mailto:info@netbrandit.com">info@netbrandit.com</a>.</p>`;

export const DEFAULT_TERMS_OF_SERVICE_HTML = `<p><em>Last updated: ${new Date().getFullYear()}</em></p>
<h2>Agreement</h2>
<p>By using the Netbrandit website and submitting forms or booking requests, you agree to these Terms of Service.</p>
<h2>Website content</h2>
<p>Information on this site is provided for general guidance. Proposals, pricing, timelines, and deliverables are confirmed in writing after discovery.</p>
<h2>No guaranteed outcomes</h2>
<p>Netbrandit does not guarantee specific search rankings, advertising results, lead volume, revenue, return on ad spend, or other marketing outcomes. Results depend on market conditions, budget, offer, competition, and client participation.</p>
<h2>Client responsibilities</h2>
<p>You agree to provide accurate information, timely feedback, and approvals. You are responsible for the accuracy of claims, compliance of creative assets, and adherence to platform policies for any channels we manage on your behalf.</p>
<h2>Discovery calls and paid work</h2>
<p>Discovery calls are complimentary unless otherwise stated. Paid engagements begin only after both parties accept a written proposal or statement of work.</p>
<h2>Intellectual property and assets</h2>
<p>You must own or have rights to materials you supply. Netbrandit retains rights to pre-existing tools, frameworks, and methodologies unless otherwise agreed in writing.</p>
<h2>Limitation of liability</h2>
<p>To the fullest extent permitted by law, Netbrandit is not liable for indirect, incidental, or consequential damages arising from use of the website or services. Our total liability for any claim is limited to fees paid to Netbrandit for the specific service giving rise to the claim during the twelve months before the claim.</p>
<h2>Changes</h2>
<p>We may update these terms from time to time. Continued use of the site after updates constitutes acceptance of the revised terms.</p>
<h2>Contact</h2>
<p>Questions: <a href="mailto:info@netbrandit.com">info@netbrandit.com</a>.</p>`;

export function isPlaceholderLegalContent(content?: string | null): boolean {
  if (!content?.trim()) return true;
  const normalized = content.toLowerCase();
  return (
    normalized.includes("placeholder") ||
    normalized.includes("owner/legal review") ||
    normalized.length < 120
  );
}

export function resolveLegalContent(stored: string | undefined | null, fallback: string): string {
  return isPlaceholderLegalContent(stored) ? fallback : stored!.trim();
}

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar, Mail, Phone } from "lucide-react";
import { Wordmark } from "@/components/site/Wordmark";
import { TransitionLink } from "@/components/animations/PageTransition";
import { BRAND, HEADER_NAV_ITEMS, PRIMARY_CTA, ROUTES } from "@/lib/constants";
import type { ContactInfo, NavItem, SocialLink } from "@/models/shared";

interface FooterProps {
  contact: ContactInfo;
  navItems?: NavItem[];
  legalLinks?: NavItem[];
  social?: SocialLink[];
  copyrightText?: string;
  tagline?: string;
}

const socialLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  pinterest: "Pinterest",
  other: "Social",
};

const SERVICE_LINKS = [
  { label: "Custom Web Design", href: `${ROUTES.services}/custom-web-design` },
  { label: "App Development", href: `${ROUTES.services}/web-and-mobile-app-development` },
  { label: "AI Automation", href: `${ROUTES.services}/ai-automation` },
  { label: "Social Media", href: `${ROUTES.services}/social-media-management` },
  { label: "SEO & Advertising", href: `${ROUTES.services}/search-engine-optimisation` },
] as const;

function buildPhoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  return `tel:${phone}`;
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "group block w-full min-w-0 break-words text-sm text-concrete transition-colors hover:text-warm-white";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        <span className="inline-flex items-center gap-1.5">
          {children}
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover:opacity-100" aria-hidden />
        </span>
      </a>
    );
  }

  if (href.startsWith("/")) {
    return (
      <TransitionLink href={href} className={className}>
        {children}
      </TransitionLink>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Footer({
  contact,
  navItems = [...HEADER_NAV_ITEMS],
  legalLinks = [
    { label: "Privacy", href: ROUTES.privacy },
    { label: "Terms", href: ROUTES.terms },
  ],
  social = [],
  copyrightText,
  tagline = BRAND.tagline,
}: FooterProps) {
  const visibleSocial = social.filter((s) => s.url?.trim());
  const phoneHref = contact.phone ? buildPhoneHref(contact.phone) : undefined;
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full max-w-full overflow-x-clip border-t border-white/10 bg-void-black">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal-red to-transparent" aria-hidden />
      <div className="absolute inset-0 grain opacity-40" aria-hidden />

      <div className="container-site relative py-16 lg:py-20">
        <div className="grid min-w-0 gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* Brand + contact */}
          <div className="min-w-0 space-y-6 lg:col-span-5 xl:col-span-4">
            <Wordmark asLink size="lg" />
            <p className="max-w-md break-words text-sm leading-relaxed text-steel">{tagline}</p>

            <div className="flex min-w-0 flex-col gap-3 sm:max-w-md">
              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="group flex min-w-0 w-full items-start gap-3 overflow-hidden rounded-2xl border border-white/10 bg-carbon/80 p-4 transition hover:border-signal-red/40 hover:bg-graphite"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-signal-red/15 text-signal-red">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-smoke">
                      Email
                    </span>
                    <span className="wrap-anywhere mt-1 block text-sm font-medium text-warm-white group-hover:text-signal-red">
                      {contact.email}
                    </span>
                  </span>
                </a>
              ) : null}

              {contact.phone && phoneHref ? (
                <a
                  href={phoneHref}
                  className="group flex min-w-0 w-full items-start gap-3 overflow-hidden rounded-2xl border border-white/10 bg-carbon/80 p-4 transition hover:border-signal-red/40 hover:bg-graphite"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-signal-red/15 text-signal-red">
                    <Phone className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-smoke">
                      Phone
                    </span>
                    <span className="mt-1 block text-sm font-medium text-warm-white group-hover:text-signal-red">
                      {contact.phone}
                    </span>
                  </span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Services */}
          <div className="min-w-0 lg:col-span-2">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-signal-red">
              Services
            </p>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((item) => (
                <li key={item.href} className="min-w-0">
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="min-w-0 lg:col-span-2">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-signal-red">
              Explore
            </p>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.href} className="min-w-0">
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="min-w-0 lg:col-span-3">
            <div className="min-w-0 rounded-2xl border border-signal-red/30 bg-gradient-to-br from-graphite to-carbon p-6 sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal-red">
                Ready to grow?
              </p>
              <h2 className="mt-3 break-words text-xl font-bold text-warm-white sm:text-2xl">
                Start with a free discovery call.
              </h2>
              <p className="mt-3 break-words text-sm leading-relaxed text-steel">
                Tell us about your business and we&apos;ll recommend practical next steps—no pressure,
                no inflated promises.
              </p>
              <TransitionLink
                href={PRIMARY_CTA.href}
                className="mt-6 inline-flex min-h-11 w-full max-w-full items-center justify-center gap-2 rounded-full bg-signal-red px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.12em] text-warm-white transition hover:bg-hot-red sm:px-6 sm:text-sm"
              >
                <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">{PRIMARY_CTA.label}</span>
              </TransitionLink>
              <TransitionLink
                href={ROUTES.contact}
                className="mt-3 inline-flex min-h-11 w-full max-w-full items-center justify-center rounded-full border border-white/15 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.12em] text-warm-white transition hover:border-signal-red/50 hover:text-signal-red sm:px-6 sm:text-sm"
              >
                Get a Growth Plan
              </TransitionLink>
            </div>

            {visibleSocial.length > 0 ? (
              <div className="mt-6 min-w-0">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-smoke">
                  Follow
                </p>
                <ul className="flex flex-wrap gap-2">
                  {visibleSocial.map((item) => (
                    <li key={item.url}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-9 max-w-full items-center rounded-full border border-white/10 px-3 text-xs font-semibold text-concrete transition hover:border-signal-red/40 hover:text-signal-red"
                      >
                        <span className="truncate">{item.label ?? socialLabels[item.platform] ?? "Link"}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-carbon/60">
        <div className="container-site flex min-w-0 flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <div className="flex min-w-0 flex-col items-center gap-3 sm:flex-row sm:items-center">
            <Wordmark asLink={false} size="sm" />
            <p className="max-w-full break-words text-center text-xs text-steel sm:text-left">
              {copyrightText ?? `© ${year} Netbrandit. All rights reserved.`}
            </p>
          </div>

          <div className="flex max-w-full flex-wrap items-center justify-center gap-4 sm:gap-6">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium uppercase tracking-wider text-steel transition hover:text-signal-red"
              >
                {item.label}
              </Link>
            ))}
            <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
            <span className="text-xs text-smoke">Canada · CAD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

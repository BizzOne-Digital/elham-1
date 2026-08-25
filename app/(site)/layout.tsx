import { SiteProviders } from "@/components/animations/SiteProviders";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { getSiteSettings } from "@/lib/data/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <SiteProviders>
      <div className="site-shell">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[300] focus:rounded-md focus:bg-signal-red focus:px-4 focus:py-2 focus:text-warm-white"
        >
          Skip to content
        </a>
        <Header navItems={settings.nav.main} cta={settings.nav.cta} />
        <main id="main-content" className="site-page-content min-w-0 flex-1 overflow-x-clip pt-[80px] max-lg:text-center">
          {children}
        </main>
        <Footer
          contact={settings.contact}
          navItems={settings.nav.footer}
          legalLinks={settings.footer.legalLinks}
          social={settings.social}
          copyrightText={settings.footer.copyrightText}
          tagline={settings.footer.tagline}
        />
      </div>
    </SiteProviders>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/site/Wordmark";
import { TransitionLink } from "@/components/animations/PageTransition";
import { HEADER_NAV_ITEMS, PRIMARY_CTA } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/models/shared";

interface HeaderProps {
  navItems?: NavItem[];
  cta?: { label: string; href: string };
}

export function Header({
  navItems = [...HEADER_NAV_ITEMS],
  cta = PRIMARY_CTA,
}: HeaderProps) {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const open = menuPath === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full max-w-full overflow-x-clip border-b transition-all duration-300",
        scrolled ?
          "border-white/10 bg-void-black/95 backdrop-blur-md"
        : "border-transparent bg-void-black/80 backdrop-blur-sm",
      )}
    >
      <div className="container-site grid h-[80px] min-w-0 grid-cols-[minmax(0,auto)_minmax(0,1fr)_auto] items-center gap-2 sm:gap-4">
        <div className="min-w-0 shrink-0">
          <Wordmark size="lg" />
        </div>

        <nav className="hidden min-w-0 justify-center overflow-hidden lg:flex" aria-label="Main navigation">
          <ul className="flex min-w-0 items-center gap-0.5 xl:gap-2">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    className={cn(
                      "inline-flex min-h-11 items-center px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors xl:px-4 xl:text-xs",
                      active ?
                        "text-signal-red"
                      : "text-warm-white/90 hover:text-warm-white",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <TransitionLink
            href={cta.href}
            className="hidden min-h-11 items-center rounded-full bg-signal-red px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-warm-white transition hover:bg-hot-red lg:inline-flex xl:px-6 xl:text-xs"
          >
            {cta.label}
          </TransitionLink>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setMenuPath(open ? null : pathname)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-white/10 bg-carbon px-4 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center rounded-md px-3 text-sm font-semibold uppercase tracking-wider text-warm-white hover:bg-graphite"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={cta.href}
                className="flex min-h-11 items-center justify-center rounded-full bg-signal-red px-4 text-sm font-bold uppercase tracking-wider text-warm-white"
              >
                {cta.label}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

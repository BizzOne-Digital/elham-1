"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TransitionContextValue {
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

function shouldBypassTransition(event: React.MouseEvent<HTMLAnchorElement>, href: string): boolean {
  if (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.defaultPrevented
  ) {
    return true;
  }

  const target = event.currentTarget;
  if (target.target === "_blank") return true;
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return true;
  if (href.startsWith("#")) return true;
  if (href.includes("?") && href.split("?")[0] === window.location.pathname) return true;

  return false;
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("");
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    queueMicrotask(() => setActive(false));
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      if (reducedMotion.current) {
        router.push(href);
        return;
      }

      const routeLabel = href === "/" ? "HOME" : href.replace(/^\//, "").split("/")[0].toUpperCase();
      setLabel(routeLabel);
      setActive(true);

      window.setTimeout(() => {
        router.push(href);
        window.setTimeout(() => setActive(false), 350);
      }, 550);
    },
    [router],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        aria-hidden={!active}
        className={cn(
          "pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-opacity duration-300",
          active ? "opacity-100" : "opacity-0",
        )}
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-1/2 bg-signal-red transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]",
            active ? "translate-x-0" : "-translate-x-full",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-1/2 bg-signal-red transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]",
            active ? "translate-x-0" : "translate-x-full",
          )}
        />
        <span
          className={cn(
            "relative z-10 font-display text-sm font-bold tracking-[0.35em] text-warm-white transition-opacity duration-300",
            active ? "opacity-100" : "opacity-0",
          )}
        >
          {label}
        </span>
      </div>
    </TransitionContext.Provider>
  );
}

export function TransitionLink({
  href,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  const ctx = useContext(TransitionContext);

  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (!ctx || shouldBypassTransition(event, String(href))) return;
        event.preventDefault();
        ctx.navigate(String(href));
      }}
      {...props}
    >
      {children}
    </Link>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  return <PageTransitionProvider>{children}</PageTransitionProvider>;
}

import Link from "next/link";
import { Wordmark } from "@/components/site/Wordmark";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-4 text-center text-ink">
      <Wordmark size="lg" />
      <p className="mt-8 text-6xl font-bold text-signal-red">404</p>
      <h1 className="mt-4 text-2xl font-bold">This page is off the growth map</h1>
      <p className="mt-3 max-w-md text-concrete">
        The route you requested does not exist or may have moved.
      </p>
      <Link
        href={ROUTES.home}
        className="mt-8 inline-flex min-h-11 items-center rounded-full bg-signal-red px-6 py-3 text-sm font-semibold"
      >
        Back to Home
      </Link>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/site/Wordmark";
import { ROUTES } from "@/lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-4 text-center text-ink">
      <Wordmark size="lg" />
      <h1 className="mt-8 text-2xl font-bold">Something interrupted the signal</h1>
      <p className="mt-3 max-w-md text-concrete">
        An unexpected error occurred. Try again, or return to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center rounded-full bg-signal-red px-6 py-3 text-sm font-semibold"
        >
          Try again
        </button>
        <Link
          href={ROUTES.home}
          className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

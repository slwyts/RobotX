"use client";

import { useEffect } from "react";
import { routing } from "@/i18n/routing";

export default function RootPage() {
  useEffect(() => {
    const target = new URL(window.location.href);
    target.pathname = `/${routing.defaultLocale}`;
    window.location.replace(target.toString());
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-light-bg px-6 text-light-textMain">
      <a
        href={`/${routing.defaultLocale}/`}
        className="rounded-full border border-light-border px-5 py-3 text-sm font-medium"
      >
        Continue to {routing.defaultLocale.toUpperCase()}
      </a>
    </main>
  );
}

"use client";

import { usePathname } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const NAV_LINKS = [
  { label: "Gallery", href: "/gallery", external: false },
  { label: "Lab", href: "/lab", external: false },
  { label: "Docs", href: `${API_URL}/redoc`, external: true },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-[rgba(2,4,8,0.60)] backdrop-blur-xl border-b border-white/5">
      <nav className="flex justify-between items-center py-4">
        {/* Logo — left edge aligns with sidebar content (p-6 = 1.5rem) */}
        <a
          href="/"
          className="text-2xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-headline)", width: "16rem", paddingLeft: "1.5rem" }}
        >
          {process.env.NEXT_PUBLIC_BRAND_NAME ?? "Upscaler AI"}
        </a>

        {/* Desktop nav */}
        <div
          className="hidden md:flex items-center gap-10 uppercase tracking-widest text-sm"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = link.href !== "#" && pathname.startsWith(link.href);
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-on-surface transition-colors"
                }
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 pr-6">
          <a
            href="/lab"
            className="shimmer-bg px-6 py-2.5 text-on-primary font-bold text-sm tracking-widest hover:scale-95 active:opacity-80 transition-all"
            style={{ fontFamily: "var(--font-headline)", borderRadius: "var(--radius)" }}
          >
            GET STARTED
          </a>
        </div>
      </nav>
    </header>
  );
}

const LINKS = [
  { label: "Terms of Service",  href: "/terms" },
  { label: "Privacy Protocol",  href: "/privacy" },
  { label: "Contact Support",   href: "/contact" },
];

export default function LabFooter() {
  return (
    <footer
      className="fixed bottom-0 z-30 border-t border-white/5 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(2,4,8,0.90)", left: "16rem", right: "20rem" }}
    >
      <div className="flex justify-between items-center gap-4 px-6 py-3">
        <div
          className="text-[8px] uppercase tracking-[0.15em] text-on-surface-variant whitespace-nowrap"
          style={{ fontFamily: "var(--font-label)" }}
        >
          © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_BRAND_NAME ?? "Upscaler AI"}. PRECISION ENGINEERED IMAGE RECONSTRUCTION.
        </div>
        <div className="flex gap-6">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[8px] uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {link.label}
            </a>
          ))}
          <span
            className="text-[8px] uppercase tracking-[0.15em] text-primary whitespace-nowrap"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Status: ONLINE
          </span>
        </div>
      </div>
    </footer>
  );
}

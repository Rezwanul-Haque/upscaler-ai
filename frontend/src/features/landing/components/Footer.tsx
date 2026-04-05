const FOOTER_LINKS = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Protocol", href: "/privacy" },
  { label: "Contact Support", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 border-t border-white/5" style={{ backgroundColor: "#020408" }}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-screen-2xl mx-auto">
        <div
          className="text-lg font-black text-on-surface tracking-tighter"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          {process.env.NEXT_PUBLIC_BRAND_NAME ?? "Upscaler AI"}
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-on-surface-variant hover:text-primary transition-colors text-[10px] tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div
          className="text-on-surface-variant text-[10px] tracking-[0.2em] uppercase text-center md:text-right"
          style={{ fontFamily: "var(--font-label)" }}
        >
          © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_BRAND_NAME ?? "Upscaler AI"}. PRECISION ENGINEERED IMAGE RECONSTRUCTION.
        </div>
      </div>
    </footer>
  );
}

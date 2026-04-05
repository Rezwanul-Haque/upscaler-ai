"use client";

import { useCallback, useRef, useState } from "react";

const LOW_RES_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBOLw6d1lk9Q0UBf7zve9XkQX-Jd-RhOhS5fHj6CAZPSAHacB67cql57kJ-v_8esG9UF6lwVyQ347rVXOc_SlP7fdrRodMMr4m0mtA_ETs0yfDTW7NuCpI6stTLFekxgcSlsaWxa1JLwzr4uvrwPx3ZikqZKNb46MAkQghKBYTM8bUR6p1s963tpCQaVOt0cOAfDuWA3SFJllLb4EyUA_5aambGGMa20CRxg9tnKQGGV6sSb8Xfwnz9oKm36rFqazRbvnr3PPa5fuA";

const UPSCALED_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBn9e5aoQRHFD4wMaSVPfrYc4CJuAlnwitVP4u24P9pDfda1eOUjEbBreAsnvOgMKnt9s3086RzADuLZLSMjqaV6yp05i5PLiuFwxHbWHTxh-LDSWgwZ4l3i0_m_eS213BHM1FdpHIvghBGAmdfdeko8q5bYDGLDNR-uc69ijC73ZC3LkxkH1GjXOa0t2QexOHOvWF_OWtoaaEyiWYqg6A1HnJ8ZJXrDMLAOELV2UgYLxD0N-XzLVz5Meiv4OfIIdWEGWIdqxFS0II";

export default function HeroSection() {
  const [sliderPct, setSliderPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setSliderPct(pct);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => { if (dragging.current) updateSlider(e.clientX); },
    [updateSlider]
  );
  const onTouchMove = useCallback(
    (e: React.TouchEvent) => { updateSlider(e.touches[0].clientX); },
    [updateSlider]
  );

  return (
    <section className="relative px-8 pt-16 pb-32 max-w-screen-2xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Copy */}
        <div className="space-y-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 border border-outline-variant/20"
            style={{ backgroundColor: "#1d2025", borderRadius: "var(--radius)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span
              className="text-[10px] tracking-[0.2em] uppercase text-primary"
              style={{ fontFamily: "var(--font-label)" }}
            >
              v4.0 Core Active
            </span>
          </div>

          <h1
            className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            RECONSTRUCT <br />
            <span className="text-primary">REALITY.</span>
          </h1>

          <p className="text-on-surface-variant text-lg max-w-md font-light leading-relaxed">
            Precision-engineered image reconstruction using neural tensor
            processing. Enhance resolution up to 8K without losing a single
            pixel of soul.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="/lab"
              className="shimmer-bg px-8 py-4 text-on-primary font-bold text-base tracking-widest hover:scale-95 transition-all"
              style={{ fontFamily: "var(--font-headline)", borderRadius: "var(--radius)" }}
            >
              INITIALIZE ENGINE
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/redoc`}
              className="px-8 py-4 border border-outline-variant/30 font-bold text-base tracking-widest hover:bg-white/5 transition-all"
              style={{ fontFamily: "var(--font-headline)", borderRadius: "var(--radius)" }}
            >
              VIEW DOCS
            </a>
          </div>
        </div>

        {/* Comparison slider */}
        <div
          ref={containerRef}
          className="relative group aspect-square overflow-hidden neon-glow select-none cursor-col-resize border border-outline-variant/20"
          style={{ backgroundColor: "#171a1f", borderRadius: "var(--radius)" }}
          onMouseMove={onMouseMove}
          onMouseDown={() => { dragging.current = true; }}
          onMouseUp={() => { dragging.current = false; }}
          onMouseLeave={() => { dragging.current = false; }}
          onTouchMove={onTouchMove}
        >
          {/* Low-res base */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOW_RES_IMG}
            alt="Low resolution source"
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-30"
          />

          {/* Upscaled overlay clipped to slider width */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-primary"
            style={{ width: `${sliderPct}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={UPSCALED_IMG}
              alt="Upscaled output"
              className="absolute inset-0 h-full object-cover"
              style={{ width: `${10000 / sliderPct}%`, maxWidth: "none" }}
            />
            <div
              className="absolute top-4 left-4 bg-surface-dim/80 px-2 py-1 text-[10px] tracking-widest border border-primary/20"
              style={{ fontFamily: "var(--font-label)" }}
            >
              UPSCALED_400%
            </div>
          </div>

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary cursor-col-resize"
            style={{ left: `${sliderPct}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-primary bg-surface-container flex items-center justify-center">
              <span className="text-primary text-xs select-none">⇔</span>
            </div>
          </div>

          {/* Source label */}
          <div
            className="absolute top-4 right-4 bg-surface-dim/80 px-2 py-1 text-[10px] tracking-widest border border-outline-variant/20 text-on-surface-variant"
            style={{ fontFamily: "var(--font-label)" }}
          >
            SOURCE_LOW_RES
          </div>

          {/* Bottom legend */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 flex items-center gap-4">
            <span
              className="text-[10px] tracking-widest"
              style={{ fontFamily: "var(--font-label)" }}
            >
              PRECISION SLIDER
            </span>
            <div className="w-32 h-1 rounded-full" style={{ backgroundColor: "#23262c" }}>
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${sliderPct}%`, borderRadius: "inherit" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

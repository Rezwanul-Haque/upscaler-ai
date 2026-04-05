"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  sourceUrl: string;
  outputUrl: string | null;
};

export default function ComparisonViewer({ sourceUrl, outputUrl }: Props) {
  const [sliderPct, setSliderPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setSliderPct(pct);
  }, []);

  const displayUrl = outputUrl ?? sourceUrl;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden group select-none shadow-2xl cursor-col-resize"
      style={{ aspectRatio: "16/9", backgroundColor: "#000000", borderRadius: "var(--radius)" }}
      onMouseMove={(e) => { if (dragging.current) updateSlider(e.clientX); }}
      onMouseDown={(e) => { dragging.current = true; updateSlider(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchMove={(e) => updateSlider(e.touches[0].clientX)}
    >
      {/* Background layer — upscaled (right side) or source as placeholder */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={outputUrl ?? sourceUrl}
        alt={outputUrl ? "AI upscaled" : "Source"}
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />

      {/* Source layer — clipped to slider width (left side) */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${sliderPct}%`, zIndex: 10 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sourceUrl}
          alt="Source original"
          className="absolute inset-0 h-full object-contain"
          style={{ width: `${10000 / sliderPct}%`, maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* Slider divider line + handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-primary"
        style={{
          left: `${sliderPct}%`,
          zIndex: 20,
          boxShadow: "0 0 15px rgba(143,245,255,0.8)",
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center group-hover:scale-110 transition-transform"
          style={{ backgroundColor: "#020408", cursor: "ew-resize" }}
        >
          <ChevronLeft size={14} className="text-primary" />
          <ChevronRight size={14} className="text-primary" />
        </div>
      </div>

      {/* Corner labels */}
      <div className="absolute top-4 left-4 pointer-events-none" style={{ zIndex: 30 }}>
        <div
          className="text-[10px] uppercase text-on-surface-variant tracking-[0.2em] px-2 py-1 border-l-2 border-primary backdrop-blur-sm"
          style={{ fontFamily: "var(--font-label)", backgroundColor: "rgba(2,4,8,0.80)" }}
        >
          SOURCE // ORIGINAL
        </div>
      </div>
      <div className="absolute top-4 right-4 pointer-events-none" style={{ zIndex: 30 }}>
        <div
          className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 border-r-2 border-primary backdrop-blur-sm text-right ${outputUrl ? "text-primary" : "text-on-surface-variant"}`}
          style={{ fontFamily: "var(--font-label)", backgroundColor: "rgba(2,4,8,0.80)" }}
        >
          {outputUrl ? "ENHANCED // AI UPSCALED" : "ENHANCED // PENDING"}
        </div>
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: "linear-gradient(rgba(143,245,255,0.1) 50%, transparent 50%)",
          backgroundSize: "100% 4px",
          zIndex: 25,
        }}
      />
    </div>
  );
}

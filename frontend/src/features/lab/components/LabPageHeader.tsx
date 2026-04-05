"use client";

import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import type { UploadedImage, UpscaleJob } from "@/infra/api/upscaleApi";

type Props = {
  image: UploadedImage | null;
  job: UpscaleJob | null;
};

export default function LabPageHeader({ image, job }: Props) {
  const sourceLabel = image?.width && image?.height
    ? `${image.width}×${image.height}`
    : "—";
  const targetLabel = job?.output_width && job?.output_height
    ? `${job.output_width}×${job.output_height}`
    : job
      ? `${(image?.width ?? 0) * job.scale}×${(image?.height ?? 0) * job.scale} (est)`
      : "—";

  return (
    <div className="flex justify-between items-end mb-8">
      {/* Title + dimensions */}
      <div className="space-y-2">
        <h2
          className="text-3xl font-extrabold tracking-tighter text-on-surface"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          PRECISION_EDITOR.v1
        </h2>
        <div className="flex items-center gap-3">
          <span
            className="text-xs uppercase text-on-surface-variant tracking-widest px-2 py-1"
            style={{ fontFamily: "var(--font-label)", backgroundColor: "#171a1f" }}
          >
            SOURCE: {sourceLabel}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-on-surface-variant">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <span
            className="text-xs uppercase text-primary tracking-widest px-2 py-1"
            style={{ fontFamily: "var(--font-label)", backgroundColor: "rgba(143,245,255,0.08)" }}
          >
            TARGET: {targetLabel}
          </span>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="flex gap-2">
        {[ZoomIn, ZoomOut, Maximize2].map((Icon, i) => (
          <button
            key={i}
            className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
            style={{ backgroundColor: "#1d2025" }}
          >
            <Icon size={18} strokeWidth={1.5} />
          </button>
        ))}
      </div>
    </div>
  );
}

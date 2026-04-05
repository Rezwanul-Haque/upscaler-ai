"use client";

import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";
import { downloadUrl } from "@/infra/api/upscaleApi";

const FORMATS = ["png", "jpg", "webp"] as const;

type Props = {
  jobId: number;
  size?: "sm" | "md";
};

export default function DownloadMenu({ jobId, size = "md" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const iconSize = size === "sm" ? 14 : 18;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        className="text-on-surface-variant hover:text-primary transition-colors"
        title="Download"
      >
        <Download size={iconSize} strokeWidth={1.5} />
      </button>

      {open && (
        <div
          className="absolute right-0 bottom-full mb-2 border border-white/10 shadow-xl z-50 py-1"
          style={{ backgroundColor: "#1d2025", borderRadius: "var(--radius)", minWidth: "8rem" }}
        >
          {FORMATS.map((fmt) => (
            <a
              key={fmt}
              href={downloadUrl(jobId, fmt)}
              download
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors"
              style={{ fontFamily: "var(--font-label)" }}
            >
              <Download size={12} strokeWidth={1.5} />
              {fmt.toUpperCase()}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

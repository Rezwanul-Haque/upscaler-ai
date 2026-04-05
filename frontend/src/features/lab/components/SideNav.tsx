"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Aperture,
  Wand2,
  Paintbrush,
  Layers,
  Settings,
  Upload,
} from "lucide-react";
import { useUpload } from "@/features/upload/hooks/useUpload";

const NAV_ITEMS = [
  { label: "Upscale", icon: Aperture, href: "#", active: true, disabled: false },
  { label: "Restore", icon: Wand2, href: "#", active: false, disabled: true },
  { label: "Retouch", icon: Paintbrush, href: "#", active: false, disabled: true },
  { label: "Batches", icon: Layers, href: "#", active: false, disabled: true },
  { label: "Settings", icon: Settings, href: "#", active: false, disabled: true },
];

export default function SideNav() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, upload } = useUpload();

  const isUploading = state.status === "uploading";

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const image = await upload(file);
    if (image) {
      router.push(`/lab?imageId=${image.id}`);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 pt-20 border-r border-white/5 flex flex-col z-40" style={{ backgroundColor: "#020408" }}>
      {/* Brand */}
      <div className="p-6 space-y-1">
        <div
          className="text-xl font-black text-primary"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          {process.env.NEXT_PUBLIC_BRAND_NAME ?? "Upscaler AI"} Lab
        </div>
        <div
          className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant"
          style={{ fontFamily: "var(--font-label)" }}
        >
          ENGINE: v1.0.0
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {NAV_ITEMS.map(({ label, icon: Icon, href, active, disabled }) => (
          <a
            key={label}
            href={disabled ? undefined : href}
            aria-disabled={disabled}
            className={`flex items-center gap-4 p-3 transition-all text-xs uppercase tracking-[0.05em] ${
              active
                ? "bg-white/5 text-primary border-l-4 border-primary"
                : disabled
                ? "text-[#555] border-l-4 border-transparent cursor-not-allowed"
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5 border-l-4 border-transparent"
            }`}
            style={{ fontFamily: "var(--font-label)" }}
            onClick={disabled ? (e) => e.preventDefault() : undefined}
          >
            <Icon size={18} strokeWidth={1.5} />
            <span>{label}</span>
            {disabled && <span className="ml-auto text-[8px] tracking-widest text-[#666]">SOON</span>}
          </a>
        ))}
      </nav>

      {/* Upload + Process */}
      <div className="p-4 border-t border-white/5 space-y-3">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full py-3 flex items-center justify-center gap-2 text-on-surface-variant hover:text-on-surface text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
          style={{
            fontFamily: "var(--font-label)",
            backgroundColor: "#1d2025",
            borderRadius: "var(--radius)",
          }}
        >
          <Upload size={14} strokeWidth={1.5} />
          {isUploading ? "UPLOADING..." : "UPLOAD NEW IMAGE"}
        </button>

        {state.status === "error" && (
          <p className="text-red-400 text-[10px] text-center">{state.message}</p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </aside>
  );
}

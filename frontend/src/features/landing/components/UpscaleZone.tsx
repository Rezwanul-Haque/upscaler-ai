"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUpload } from "@/features/upload/hooks/useUpload";

export default function UpscaleZone() {
  const [draggingOver, setDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { state, upload } = useUpload();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const image = await upload(file);
    if (image) {
      router.push(`/lab?imageId=${image.id}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  const isUploading = state.status === "uploading";

  return (
    <section className="py-24" style={{ backgroundColor: "#111318" }}>
      <div className="max-w-4xl mx-auto px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            DRAG. DROP. SCALE.
          </h2>
          <p
            className="text-[10px] tracking-[0.3em] text-on-surface-variant uppercase"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Neural Processing Laboratory
          </p>
        </div>

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload image"
          className={`relative h-80 w-full border-2 border-dashed flex flex-col items-center justify-center group transition-all cursor-pointer ${
            draggingOver
              ? "border-primary/70 bg-primary/5"
              : "border-outline-variant/40 hover:border-primary/50"
          } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
          style={{ backgroundColor: "#171a1f", borderRadius: "var(--radius)" }}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
          onDragLeave={() => setDraggingOver(false)}
          onDrop={handleDrop}
        >
          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-primary/5 transition-opacity ${
              draggingOver ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            style={{ borderRadius: "var(--radius)" }}
          />

          {/* Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="relative w-12 h-12 text-primary mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>

          <p
            className="relative text-lg font-medium tracking-wide"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            {isUploading ? "UPLOADING…" : "UPLOAD SOURCE DATA"}
          </p>
          <p className="relative text-on-surface-variant text-sm mt-2">
            {state.status === "error" ? state.message : "RAW, PNG, JPG or TIFF up to 50MB"}
          </p>

          {/* Decorative corner brackets */}
          <span className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary/40" />
          <span className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-primary/40" />
          <span className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-primary/40" />
          <span className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary/40" />

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
}

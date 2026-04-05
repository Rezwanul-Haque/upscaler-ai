"use client";

import { useState } from "react";
import { History } from "lucide-react";

export default function EnhancementInput() {
  const [value, setValue] = useState("");

  return (
    <div className="mt-8 flex gap-4">
      {/* Text input */}
      <div
        className="flex-1 border-b-2 p-4 transition-all"
        style={{
          backgroundColor: "#171a1f",
          borderColor: value ? "var(--color-primary)" : "#23262c",
        }}
      >
        <label
          className="block text-[10px] text-on-surface-variant uppercase tracking-widest mb-1"
          style={{ fontFamily: "var(--font-label)" }}
        >
          ENHANCEMENT CONTEXT
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe additional textures to synthesize..."
          className="bg-transparent border-none outline-none w-full text-on-surface placeholder:text-outline text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>

      {/* Iteration log button */}
      <button
        className="px-6 flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-xs uppercase tracking-widest transition-colors"
        style={{
          fontFamily: "var(--font-label)",
          backgroundColor: "#1d2025",
        }}
      >
        <History size={14} strokeWidth={1.5} />
        V4_ITERATION_LOG
      </button>
    </div>
  );
}

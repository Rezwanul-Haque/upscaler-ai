"use client";

import { useState } from "react";
import { http } from "@/infra/http/client";

const PARTNERS = ["NVIDIA_P", "TENSOR_X", "CORE_RE"];

export default function CtaSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await http.post<{ message: string }>("/api/v1/waitlist", { email });
      setMessage(res.message);
      setStatus("success");
      setEmail("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        background: "radial-gradient(circle at 50% 50%, #8ff5ff, transparent 70%)",
      }} />

      <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
        <h2
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-8"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          THE FUTURE IS <span className="text-primary">SHARP.</span>
        </h2>

        {/* Email input */}
        {status === "success" ? (
          <div
            className="inline-flex items-center gap-2 px-6 py-4 border border-primary/30 mb-12"
            style={{ backgroundColor: "rgba(143,245,255,0.08)", borderRadius: "var(--radius)" }}
          >
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span
              className="text-sm uppercase tracking-widest text-primary"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {message}
            </span>
          </div>
        ) : (
          <div
            className="p-1 glass-panel inline-flex overflow-hidden mb-4"
            style={{ borderRadius: "var(--radius)" }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="ENTER TERMINAL ADDRESS (EMAIL)"
              className="bg-transparent border-none focus:outline-none focus:ring-0 px-6 py-4 w-64 md:w-96 text-on-surface placeholder-on-surface-variant text-sm uppercase tracking-widest"
              style={{ fontFamily: "var(--font-label)" }}
            />
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="shimmer-bg px-8 py-4 font-bold text-on-primary tracking-widest whitespace-nowrap disabled:opacity-50"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              {status === "loading" ? "JOINING..." : "JOIN QUEUE"}
            </button>
          </div>
        )}

        {status === "error" && (
          <p
            className="text-red-400 text-[10px] uppercase tracking-widest mb-8"
            style={{ fontFamily: "var(--font-label)" }}
          >
            {message}
          </p>
        )}

        {/* Partner logos */}
        <div className="flex justify-center gap-12 opacity-40 mt-8">
          {PARTNERS.map((p) => (
            <span
              key={p}
              className="font-black text-xl tracking-tighter"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

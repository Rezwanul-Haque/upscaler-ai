"use client";

import { CheckCircle } from "lucide-react";
import type { AIModel } from "@/infra/api/upscaleApi";
import type { JobSettings } from "@/features/lab/hooks/useLabJob";

type Props = {
  models: AIModel[];
  settings: JobSettings;
  onSettingsChange: (patch: Partial<JobSettings>) => void;
  onProcess: () => void;
  isProcessing: boolean;
  hasImage: boolean;
};

const SCALES = [2, 4];
const FORMATS: JobSettings["output_format"][] = ["PNG", "JPG", "WEBP"];

export default function ControlPanel({ models, settings, onSettingsChange, onProcess, isProcessing, hasImage }: Props) {
  return (
    <aside
      className="fixed right-0 top-0 h-full w-80 pt-20 border-l border-white/5 z-40 p-6 overflow-y-auto flex flex-col"
      style={{ backgroundColor: "#111318" }}
    >
      <div className="space-y-8 flex-1">

        {/* Engine Core — Model Selection */}
        <div>
          <h3
            className="text-xs font-bold text-on-surface uppercase tracking-[0.2em] mb-4 flex items-center gap-2"
            style={{ fontFamily: "var(--font-label)" }}
          >
            <span className="w-1 h-3 bg-primary inline-block" />
            ENGINE_CORE
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => onSettingsChange({ model: model.id, scale: model.scale })}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-3 border-l-2 transition-colors text-left disabled:opacity-50 ${
                  settings.model === model.id
                    ? "border-primary"
                    : "border-transparent hover:bg-surface-container"
                }`}
                style={{ backgroundColor: settings.model === model.id ? "#1d2025" : "#0c0e12" }}
              >
                <div>
                  <div
                    className={`text-[10px] font-bold uppercase ${
                      settings.model === model.id ? "text-primary" : "text-on-surface-variant"
                    }`}
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    {model.name}
                  </div>
                  <div
                    className="text-[9px] uppercase mt-0.5"
                    style={{ fontFamily: "var(--font-body)", color: "#46484d" }}
                  >
                    {model.description}
                  </div>
                </div>
                {settings.model === model.id && (
                  <CheckCircle size={16} className="text-primary flex-shrink-0" />
                )}
              </button>
            ))}
            {models.length === 0 && (
              <div className="text-[10px] text-on-surface-variant text-center py-4">
                Loading models...
              </div>
            )}
          </div>
        </div>

        {/* Scale */}
        <div>
          <h3
            className="text-xs font-bold text-on-surface uppercase tracking-[0.2em] mb-4 flex items-center gap-2"
            style={{ fontFamily: "var(--font-label)" }}
          >
            <span className="w-1 h-3 bg-primary inline-block" />
            SCALE_FACTOR
          </h3>
          <div className="flex gap-2">
            {SCALES.map((s) => (
              <button
                key={s}
                onClick={() => onSettingsChange({ scale: s })}
                disabled={isProcessing}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 ${
                  settings.scale === s
                    ? "text-primary border border-primary"
                    : "text-on-surface-variant border border-white/10 hover:border-primary/50"
                }`}
                style={{
                  fontFamily: "var(--font-label)",
                  backgroundColor: settings.scale === s ? "rgba(143,245,255,0.08)" : "#0c0e12",
                }}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>

        {/* Output Format */}
        <div>
          <h3
            className="text-xs font-bold text-on-surface uppercase tracking-[0.2em] mb-4 flex items-center gap-2"
            style={{ fontFamily: "var(--font-label)" }}
          >
            <span className="w-1 h-3 bg-primary inline-block" />
            OUTPUT_FORMAT
          </h3>
          <div className="flex gap-2">
            {FORMATS.map((fmt) => (
              <button
                key={fmt}
                onClick={() => onSettingsChange({ output_format: fmt })}
                disabled={isProcessing}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 ${
                  settings.output_format === fmt
                    ? "text-primary border border-primary"
                    : "text-on-surface-variant border border-white/10 hover:border-primary/50"
                }`}
                style={{
                  fontFamily: "var(--font-label)",
                  backgroundColor: settings.output_format === fmt ? "rgba(143,245,255,0.08)" : "#0c0e12",
                }}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Job Metadata */}
        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="flex justify-between">
            <span
              className="text-[10px] text-on-surface-variant uppercase tracking-widest"
              style={{ fontFamily: "var(--font-label)" }}
            >
              SELECTED_MODEL
            </span>
            <span
              className="text-[10px] uppercase tracking-widest text-on-surface"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {settings.model}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              className="text-[10px] text-on-surface-variant uppercase tracking-widest"
              style={{ fontFamily: "var(--font-label)" }}
            >
              SCALE
            </span>
            <span
              className="text-[10px] uppercase tracking-widest text-on-surface"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {settings.scale}×
            </span>
          </div>
          <div className="flex justify-between">
            <span
              className="text-[10px] text-on-surface-variant uppercase tracking-widest"
              style={{ fontFamily: "var(--font-label)" }}
            >
              FORMAT
            </span>
            <span
              className="text-[10px] uppercase tracking-widest text-on-surface"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {settings.output_format}
            </span>
          </div>
        </div>

      </div>

      {/* Process Image Button */}
      <div className="pt-4 border-t border-white/5 mt-6">
        <button
          onClick={onProcess}
          disabled={isProcessing || !hasImage}
          className="w-full py-4 text-on-primary font-bold uppercase tracking-widest text-xs active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            fontFamily: "var(--font-headline)",
            background: isProcessing
              ? "#46484d"
              : "linear-gradient(135deg, #8ff5ff 0%, #00eefc 100%)",
            borderRadius: "var(--radius)",
            boxShadow: isProcessing ? "none" : "0 0 20px rgba(143,245,255,0.2)",
          }}
        >
          {isProcessing ? "PROCESSING..." : "PROCESS IMAGE"}
        </button>
      </div>
    </aside>
  );
}

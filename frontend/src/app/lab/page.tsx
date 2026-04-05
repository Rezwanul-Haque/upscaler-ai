"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/features/landing";
import {
  SideNav,
  LabPageHeader,
  ComparisonViewer,
  ControlPanel,
  LabFooter,
} from "@/features/lab";
import { useLabJob } from "@/features/lab/hooks/useLabJob";
import DownloadMenu from "@/features/lab/components/DownloadMenu";

function LabContent() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get("imageId");
  const { state, updateSettings, processImage } = useLabJob(imageId ? Number(imageId) : null);

  const isProcessing = state.phase === "processing";
  const hasImage = state.image !== null;

  return (
    <>
      <Header />
      <SideNav />
      <ControlPanel
        models={state.models}
        settings={state.settings}
        onSettingsChange={updateSettings}
        onProcess={processImage}
        isProcessing={isProcessing}
        hasImage={hasImage}
      />

      <main
        className="pt-20 pb-16 min-h-screen p-8 relative overflow-hidden"
        style={{
          marginLeft: "16rem",
          marginRight: "20rem",
          backgroundColor: "#0c0e12",
        }}
      >
        <LabPageHeader
          image={state.image}
          job={state.job}
        />

        {state.phase === "loading" && (
          <div className="flex items-center justify-center h-80 text-on-surface-variant text-sm">
            Loading image...
          </div>
        )}

        {state.phase === "error" && (
          <div className="flex items-center justify-center h-80 text-red-400 text-sm">
            {state.error}
          </div>
        )}

        {(state.phase === "ready" || state.phase === "processing" || state.phase === "completed") && state.sourceUrl && (
          <>
            <ComparisonViewer
              sourceUrl={state.sourceUrl}
              outputUrl={state.outputUrl}
            />
            {state.phase === "processing" && (
              <div
                className="mt-4 text-center text-sm text-primary animate-pulse"
                style={{ fontFamily: "var(--font-label)" }}
              >
                PROCESSING — {Math.round(state.job?.progress ?? 0)}%
              </div>
            )}
            {state.phase === "completed" && state.job && (
              <div className="mt-4 flex justify-end">
                <div
                  className="flex items-center gap-3 px-4 py-2 border border-white/10"
                  style={{ backgroundColor: "#171a1f", borderRadius: "var(--radius)" }}
                >
                  <span
                    className="text-[10px] text-on-surface-variant uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    DOWNLOAD
                  </span>
                  <DownloadMenu jobId={state.job.id} />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <LabFooter />
    </>
  );
}

export default function LabPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0c0e12]" />}>
      <LabContent />
    </Suspense>
  );
}

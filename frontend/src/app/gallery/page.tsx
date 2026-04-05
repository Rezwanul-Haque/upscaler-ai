"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/features/landing";
import {
  listJobs,
  downloadUrl,
  type UpscaleJob,
} from "@/infra/api/upscaleApi";
import DownloadMenu from "@/features/lab/components/DownloadMenu";

const PAGE_SIZE = 12;

export default function GalleryPage() {
  const [jobs, setJobs] = useState<UpscaleJob[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await listJobs(p * PAGE_SIZE, PAGE_SIZE, "completed");
      setJobs(data.jobs);
      setTotal(data.total);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  // Refetch when restored from bfcache (browser back from external page)
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) fetchPage(page);
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchPage(page);
    };
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [page, fetchPage]);

  return (
    <>
      <Header />
      <main
        className="pt-24 pb-16 min-h-screen px-8 max-w-screen-2xl mx-auto"
        style={{ backgroundColor: "#0c0e12" }}
      >
        {/* Page header */}
        <div className="mb-10">
          <h1
            className="text-3xl font-extrabold tracking-tighter text-on-surface"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            GALLERY
          </h1>
          <p
            className="text-[10px] tracking-[0.3em] text-on-surface-variant uppercase mt-2"
            style={{ fontFamily: "var(--font-label)" }}
          >
            {total} ENHANCED IMAGE{total !== 1 ? "S" : ""}
          </p>
        </div>

        {/* Grid */}
        {loading && jobs.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-on-surface-variant text-sm">
            Loading...
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-on-surface-variant text-sm gap-4">
            <p>No upscaled images yet.</p>
            <a
              href="/lab"
              className="text-primary text-xs uppercase tracking-widest hover:underline"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Go to Lab to upscale your first image
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="group relative overflow-hidden border border-white/5 hover:border-primary/30 transition-colors"
                style={{ backgroundColor: "#171a1f", borderRadius: "var(--radius)" }}
              >
                {/* Thumbnail */}
                <div className="aspect-square overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={downloadUrl(job.id)}
                    alt={`Upscaled #${job.id}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Hover overlay — thumbnail only */}
                  <a
                    href={`/lab?imageId=${job.image_id}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: "rgba(2,4,8,0.60)" }}
                  >
                    <span
                      className="text-[10px] text-primary uppercase tracking-widest border border-primary px-4 py-2"
                      style={{ fontFamily: "var(--font-label)", borderRadius: "var(--radius)" }}
                    >
                      Open in Lab
                    </span>
                  </a>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2 relative z-10">
                  <div className="flex justify-between items-center">
                    <span
                      className="text-[10px] text-primary uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-label)" }}
                    >
                      {job.output_width}×{job.output_height}
                    </span>
                    <span
                      className="text-[10px] text-on-surface-variant uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-label)" }}
                    >
                      {job.scale}× {job.model}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className="text-[9px] text-on-surface-variant"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {new Date(job.completed_at!).toLocaleDateString()}
                    </span>
                    <DownloadMenu jobId={job.id} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-[10px] uppercase tracking-widest px-4 py-2 border border-white/10 text-on-surface-variant hover:text-primary hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-label)", borderRadius: "var(--radius)" }}
            >
              Previous
            </button>
            <span
              className="text-[10px] text-on-surface-variant uppercase tracking-widest"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="text-[10px] uppercase tracking-widest px-4 py-2 border border-white/10 text-on-surface-variant hover:text-primary hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-label)", borderRadius: "var(--radius)" }}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  cancelJob,
  createJob,
  getJob,
} from "@/infra/api/upscaleApi";
import type { CreateJobRequest, UpscaleJob } from "@/infra/api/upscaleApi";

const POLL_INTERVAL_MS = 1500;

export function useUpscaleJob() {
  const [job, setJob] = useState<UpscaleJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (jobId: number) => {
      stopPolling();
      pollRef.current = setInterval(async () => {
        try {
          const updated = await getJob(jobId);
          setJob(updated);
          if (["completed", "failed", "cancelled"].includes(updated.status)) {
            stopPolling();
          }
        } catch {
          stopPolling();
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling]
  );

  async function submit(req: CreateJobRequest) {
    setLoading(true);
    setError(null);
    try {
      const created = await createJob(req);
      setJob(created);
      if (!["completed", "failed", "cancelled"].includes(created.status)) {
        startPolling(created.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  async function cancel(jobId: number) {
    try {
      await cancelJob(jobId);
      stopPolling();
      setJob((prev) => (prev ? { ...prev, status: "cancelled" } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel job");
    }
  }

  function reset() {
    stopPolling();
    setJob(null);
    setError(null);
  }

  useEffect(() => () => stopPolling(), [stopPolling]);

  return { job, error, loading, submit, cancel, reset };
}

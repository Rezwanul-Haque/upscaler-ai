"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createJob,
  getJob,
  getUploadedImage,
  listModels,
  uploadedImageUrl,
  downloadUrl,
  type UploadedImage,
  type UpscaleJob,
  type AIModel,
  type CreateJobRequest,
} from "@/infra/api/upscaleApi";

export type JobSettings = {
  model: string;
  scale: number;
  output_format: "PNG" | "JPG" | "WEBP";
};

type LabPhase = "loading" | "error" | "ready" | "processing" | "completed";

export type LabState = {
  phase: LabPhase;
  error: string | null;
  image: UploadedImage | null;
  sourceUrl: string | null;
  job: UpscaleJob | null;
  outputUrl: string | null;
  models: AIModel[];
  settings: JobSettings;
};

const DEFAULT_SETTINGS: JobSettings = {
  model: "pillow-lanczos",
  scale: 2,
  output_format: "PNG",
};

const POLL_INTERVAL = 1000;

export function useLabJob(imageId: number | null) {
  const [state, setState] = useState<LabState>({
    phase: "loading",
    error: null,
    image: null,
    sourceUrl: null,
    job: null,
    outputUrl: null,
    models: [],
    settings: DEFAULT_SETTINGS,
  });
  const pollingRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = undefined;
    }
  }, []);

  // Load image metadata + models on mount
  useEffect(() => {
    if (!imageId) {
      setState((prev) => ({ ...prev, phase: "error", error: "No image selected." }));
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const [image, models] = await Promise.all([
          getUploadedImage(imageId),
          listModels(),
        ]);
        if (cancelled) return;

        const sourceUrl = uploadedImageUrl(imageId);
        setState((prev) => ({
          ...prev,
          phase: "ready",
          error: null,
          image,
          sourceUrl,
          models,
          job: null,
          outputUrl: null,
        }));
      } catch (err) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            phase: "error",
            error: err instanceof Error ? err.message : "Failed to load image.",
          }));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [imageId]);

  // Update settings
  const updateSettings = useCallback((patch: Partial<JobSettings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  // Process image — create job + poll
  const processImage = useCallback(async () => {
    if (!state.image) return;

    stopPolling();

    const body: CreateJobRequest = {
      image_id: state.image.id,
      model: state.settings.model,
      scale: state.settings.scale,
      output_format: state.settings.output_format,
    };

    try {
      const job = await createJob(body);
      setState((prev) => ({ ...prev, phase: "processing", job, outputUrl: null, error: null }));

      pollingRef.current = setInterval(async () => {
        try {
          const updated = await getJob(job.id);

          if (updated.status === "completed") {
            stopPolling();
            setState((prev) => ({
              ...prev,
              phase: "completed",
              job: updated,
              outputUrl: downloadUrl(updated.id),
            }));
          } else if (updated.status === "failed") {
            stopPolling();
            setState((prev) => ({
              ...prev,
              phase: "error",
              error: updated.error_message || "Upscale failed.",
              job: updated,
            }));
          } else {
            setState((prev) => ({ ...prev, job: updated }));
          }
        } catch {
          // keep polling on transient errors
        }
      }, POLL_INTERVAL);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        phase: "error",
        error: err instanceof Error ? err.message : "Failed to create job.",
      }));
    }
  }, [state.image, state.settings, stopPolling]);

  // Cleanup polling on unmount
  useEffect(() => stopPolling, [stopPolling]);

  return { state, updateSettings, processImage };
}

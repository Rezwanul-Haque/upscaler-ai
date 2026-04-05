"use client";

import { useState } from "react";
import { uploadImage } from "@/infra/api/upscaleApi";
import type { UploadedImage } from "@/infra/api/upscaleApi";

type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "success"; image: UploadedImage }
  | { status: "error"; message: string };

export function useUpload() {
  const [state, setState] = useState<UploadState>({ status: "idle" });

  async function upload(file: File) {
    setState({ status: "uploading" });
    try {
      const image = await uploadImage(file);
      setState({ status: "success", image });
      return image;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setState({ status: "error", message });
      return null;
    }
  }

  function reset() {
    setState({ status: "idle" });
  }

  return { state, upload, reset };
}

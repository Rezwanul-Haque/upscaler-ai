import { http, uploadFile } from "@/infra/http/client";

export type UploadedImage = {
  id: number;
  filename: string;
  original_filename: string;
  content_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  created_at: string;
};

export type UpscaleJob = {
  id: number;
  image_id: number;
  model: string;
  scale: number;
  output_format: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  progress: number;
  output_path: string | null;
  output_width: number | null;
  output_height: number | null;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
};

export type AIModel = {
  id: string;
  name: string;
  description: string;
  scale: number;
  category: string;
};

export type CreateJobRequest = {
  image_id: number;
  model: string;
  scale: number;
  output_format: "PNG" | "JPG" | "WEBP";
};

// Upload
export const uploadImage = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return uploadFile<UploadedImage>("/api/v1/upload", form);
};

// Models
export const listModels = () =>
  http.get<{ models: AIModel[] }>("/api/v1/models").then((r) => r.models);

// Jobs
export const createJob = (body: CreateJobRequest) =>
  http.post<UpscaleJob>("/api/v1/upscale/jobs", body);

export const getJob = (jobId: number) =>
  http.get<UpscaleJob>(`/api/v1/upscale/jobs/${jobId}`);

export const listJobs = (skip = 0, limit = 50, status?: string) => {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (status) params.set("status", status);
  return http.get<{ jobs: UpscaleJob[]; total: number }>(
    `/api/v1/upscale/jobs?${params}`
  );
};

export const cancelJob = (jobId: number) =>
  http.delete<{ message: string }>(`/api/v1/upscale/jobs/${jobId}`);

export const downloadUrl = (jobId: number, format?: string) => {
  const base = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/upscale/jobs/${jobId}/download`;
  return format ? `${base}?format=${format}` : base;
};

export const uploadedImageUrl = (imageId: number) =>
  `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/upload/${imageId}/file`;

export const getUploadedImage = (imageId: number) =>
  http.get<UploadedImage>(`/api/v1/upload/${imageId}`);

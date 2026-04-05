"use client";

import { useEffect, useState } from "react";
import { listModels } from "@/infra/api/upscaleApi";
import type { AIModel } from "@/infra/api/upscaleApi";

export function useModels() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listModels()
      .then(setModels)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load models")
      )
      .finally(() => setLoading(false));
  }, []);

  return { models, loading, error };
}

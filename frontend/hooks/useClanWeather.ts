"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ClanWeather } from "@/lib/api/modules/weather";

export function useClanWeather() {
  const [data, setData] = useState<ClanWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missingCoords, setMissingCoords] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setMissingCoords(false);

    void api.weather
      .clan()
      .then((next) => {
        if (!cancelled) setData(next);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const status =
          err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "status" in err.response
            ? Number((err.response as { status?: number }).status)
            : null;
        if (status === 404) {
          setMissingCoords(true);
          setData(null);
          return;
        }
        setError("load_failed");
        setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error, missingCoords };
}

/** Env cho Google Analytics 4 và Microsoft Clarity (chỉ NEXT_PUBLIC_*). */

export function getGaMeasurementId(): string | null {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return id || null;
}

export function getClarityProjectId(): string | null {
  const id = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();
  return id || null;
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(getGaMeasurementId() || getClarityProjectId());
}

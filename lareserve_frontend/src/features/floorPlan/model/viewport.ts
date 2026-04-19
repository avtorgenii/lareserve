import { DEFAULT_VIEWPORT_SCALE } from './types';

export const MIN_VIEWPORT_SCALE = 0.25;
export const MAX_VIEWPORT_SCALE = 8;
/** Multiplicative factor applied per zoom step (≈100% per click). */
export const VIEWPORT_SCALE_FACTOR = 2;

export function clampViewportScale(scale: number): number {
  if (!Number.isFinite(scale)) return DEFAULT_VIEWPORT_SCALE;
  return Math.max(MIN_VIEWPORT_SCALE, Math.min(MAX_VIEWPORT_SCALE, scale));
}

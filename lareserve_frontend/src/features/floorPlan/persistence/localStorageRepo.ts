import {
  DEFAULT_VIEWPORT_SCALE,
  FLOOR_PLAN_STORAGE_KEY,
  createInitialFloorPlanState,
} from '../model/types';

import type { FloorPlanPersistedState, FloorPlanState } from '../model/types';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFloorPlanState(value: unknown): value is Omit<
  FloorPlanPersistedState,
  'viewportScale' | 'viewportPan'
> & {
  viewportScale?: number;
  viewportPan?: { x: number; y: number };
} {
  if (!isObject(value)) return false;

  if (!isObject(value.meta)) return false;
  if (typeof value.meta.id !== 'string') return false;
  if (typeof value.meta.name !== 'string') return false;
  if (typeof value.meta.updatedAt !== 'string') return false;

  if (!Array.isArray(value.elements)) return false;
  if (typeof value.selectedElementId !== 'string' && value.selectedElementId !== null) return false;
  if (
    typeof value.viewportScale !== 'undefined' &&
    (typeof value.viewportScale !== 'number' || !Number.isFinite(value.viewportScale))
  ) {
    return false;
  }

  if (typeof value.viewportPan !== 'undefined') {
    const pan = value.viewportPan;
    if (!isObject(pan) || typeof pan.x !== 'number' || typeof pan.y !== 'number') {
      return false;
    }
  }

  return true;
}

function toPersistedState(state: FloorPlanState): FloorPlanPersistedState {
  return {
    meta: state.meta,
    elements: state.elements,
    selectedElementId: state.selectedElementId,
    viewportScale: state.viewportScale,
    viewportPan: state.viewportPan,
  };
}

function migrateElement(el: Record<string, unknown>): Record<string, unknown> {
  if (
    (el.type === 'wall' || el.type === 'separator') &&
    el.x2 == null &&
    typeof el.width === 'number'
  ) {
    const x = typeof el.x === 'number' ? el.x : 0;
    const y = typeof el.y === 'number' ? el.y : 0;
    const { width, ...rest } = el;
    return { ...rest, x2: x + width, y2: y };
  }
  return el;
}

function migrateElements(elements: unknown[]): unknown[] {
  return elements.map((el) => (isObject(el) ? migrateElement(el) : el));
}

function normalizePersistedState(
  value: Omit<FloorPlanPersistedState, 'viewportScale' | 'viewportPan'> & {
    viewportScale?: number;
    viewportPan?: { x: number; y: number };
  }
): FloorPlanPersistedState {
  return {
    meta: value.meta,
    elements: migrateElements(value.elements) as FloorPlanPersistedState['elements'],
    selectedElementId: value.selectedElementId,
    viewportScale: value.viewportScale ?? DEFAULT_VIEWPORT_SCALE,
    viewportPan: value.viewportPan ?? { x: 0, y: 0 },
  };
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadFloorPlanFromLocalStorage(
  storageKey: string = FLOOR_PLAN_STORAGE_KEY
): FloorPlanPersistedState | null {
  if (!canUseLocalStorage()) return null;

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isFloorPlanState(parsed) ? normalizePersistedState(parsed) : null;
  } catch {
    return null;
  }
}

export function saveFloorPlanToLocalStorage(
  state: FloorPlanState,
  storageKey: string = FLOOR_PLAN_STORAGE_KEY
) {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(storageKey, JSON.stringify(toPersistedState(state)));
}

export function clearFloorPlanFromLocalStorage(storageKey: string = FLOOR_PLAN_STORAGE_KEY) {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(storageKey);
}

export function loadFloorPlanOrDefault(
  storageKey: string = FLOOR_PLAN_STORAGE_KEY
): FloorPlanState {
  const loaded = loadFloorPlanFromLocalStorage(storageKey);
  if (!loaded) {
    return createInitialFloorPlanState();
  }

  return {
    ...loaded,
    history: {
      past: [],
      future: [],
    },
  };
}

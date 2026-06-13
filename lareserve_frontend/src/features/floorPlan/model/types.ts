export type FloorElementType =
  | 'roundTable'
  | 'rectTable'
  | 'wall'
  | 'window'
  | 'door'
  | 'separator';

export type TableStatus = 'available' | 'reserved' | 'occupied';

export type CanvasMode = 'edit' | 'view';

type BaseElement = {
  id: string;
  type: FloorElementType;
  x: number;
  y: number;
  label: string;
};

export type RoundTableElement = BaseElement & {
  type: 'roundTable';
  radius: number;
};

export type RectTableElement = BaseElement & {
  type: 'rectTable';
  width: number;
  height: number;
};

export type WallElement = BaseElement & {
  type: 'wall';
  x2: number;
  y2: number;
  height: number;
};

export type WindowElement = BaseElement & {
  type: 'window';
  x2: number;
  y2: number;
  height: number;
};

export type DoorElement = BaseElement & {
  type: 'door';
  width: number;
  height: number;
};

export type SeparatorElement = BaseElement & {
  type: 'separator';
  x2: number;
  y2: number;
  height: number;
};

export type FloorElement =
  | RoundTableElement
  | RectTableElement
  | WallElement
  | WindowElement
  | DoorElement
  | SeparatorElement;

export type FloorData = {
  id: string;
  name: string;
  elements: FloorElement[];
  updatedAt: string;
};

export type ViewportPan = {
  x: number;
  y: number;
};

export type FloorPlanPersistedState = {
  floors: Record<string, FloorData>;
  activeFloorId: string;
  selectedElementId: string | null;
  viewportScale: number;
  viewportPan: ViewportPan;
};

export type FloorPlanHistoryEntry = {
  floors: Record<string, FloorData>;
  activeFloorId: string;
  selectedElementId: string | null;
  viewportScale: number;
};

export type FloorPlanState = FloorPlanPersistedState & {
  history: {
    past: FloorPlanHistoryEntry[];
    future: FloorPlanHistoryEntry[];
  };
};

export const FLOOR_PLAN_STORAGE_KEY = 'restaurant-floor-plan-v1';
export const DEFAULT_VIEWPORT_SCALE = 1;
export const GROUND_FLOOR_ID = '1';

/**
 * Generates a display label for a floor from its numeric string id.
 * "1" → "Parter", "2" → "Piętro 1", "0" → "Poziom -1", "-1" → "Poziom -2", etc.
 */
export function floorLabel(id: string): string {
  const n = parseInt(id, 10);
  if (isNaN(n)) return id;
  if (n === 1) return 'Parter';
  if (n < 1) return `Poziom -${1 - n}`;
  return `Piętro ${n - 1}`;
}

export const createInitialFloorPlanState = (): FloorPlanState => ({
  floors: {
    [GROUND_FLOOR_ID]: {
      id: GROUND_FLOOR_ID,
      name: 'Parter',
      elements: [],
      updatedAt: new Date().toISOString(),
    },
  },
  activeFloorId: GROUND_FLOOR_ID,
  selectedElementId: null,
  viewportScale: DEFAULT_VIEWPORT_SCALE,
  viewportPan: { x: 0, y: 0 },
  history: {
    past: [],
    future: [],
  },
});

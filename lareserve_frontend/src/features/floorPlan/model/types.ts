export type FloorElementType = 'roundTable' | 'rectTable' | 'wall' | 'window' | 'door' | 'separator';

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

export type FloorPlanMeta = {
  id: string;
  name: string;
  updatedAt: string;
};

export type ViewportPan = {
  x: number;
  y: number;
};

export type FloorPlanPersistedState = {
  meta: FloorPlanMeta;
  elements: FloorElement[];
  selectedElementId: string | null;
  viewportScale: number;
  viewportPan: ViewportPan;
};

export type FloorPlanHistoryEntry = {
  meta: FloorPlanMeta;
  elements: FloorElement[];
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

export const createInitialFloorPlanState = (): FloorPlanState => ({
  meta: {
    id: 'default-floor',
    name: 'Main Hall',
    updatedAt: new Date().toISOString(),
  },
  selectedElementId: null,
  elements: [],
  viewportScale: DEFAULT_VIEWPORT_SCALE,
  viewportPan: { x: 0, y: 0 },
  history: {
    past: [],
    future: [],
  },
});

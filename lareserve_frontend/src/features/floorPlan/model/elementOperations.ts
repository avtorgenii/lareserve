import { cloneElements, cloneFloors, pushHistory } from './history';
import { clampViewportScale } from './viewport';

import type {
  AddDoorPayload,
  AddPayloadByType,
  AddRectTablePayload,
  AddRoundTablePayload,
  AddSeparatorPayload,
  AddWallPayload,
  AddWindowPayload,
  ResizeDoorPayload,
  ResizePayloadByType,
  ResizeRectTablePayload,
  ResizeRoundTablePayload,
  ResizeSeparatorPayload,
  ResizeWallPayload,
  ResizeWindowPayload,
} from './payloadTypes';
import type {
  FloorData,
  FloorElement,
  FloorElementType,
  FloorPlanPersistedState,
  FloorPlanState,
} from './types';

export const LABEL_PREFIX: Record<FloorElementType, string> = {
  roundTable: 'R',
  rectTable: 'T',
  wall: 'W',
  window: 'WN',
  door: 'D',
  separator: 'SP',
};

const ELEMENT_DEFAULTS = {
  roundTable: { x: 0, y: 0, radius: 20 },
  rectTable: { x: 0, y: 0, width: 140, height: 80 },
  wall: { x: 0, y: 0, x2: 220, y2: 0, height: 22 },
  window: { x: 0, y: 0, x2: 140, y2: 0, height: 12 },
  door: { x: 0, y: 0, width: 100, height: 12 },
  separator: { x: 0, y: 0, x2: 120, y2: 0, height: 8 },
} satisfies {
  [K in FloorElementType]: Omit<Extract<FloorElement, { type: K }>, 'id' | 'type' | 'label'>;
};

const ELEMENT_BUILDERS = {
  roundTable: (id: string, label: string, payload: AddRoundTablePayload) => ({
    id,
    type: 'roundTable' as const,
    label,
    ...ELEMENT_DEFAULTS.roundTable,
    ...payload,
  }),
  rectTable: (id: string, label: string, payload: AddRectTablePayload) => ({
    id,
    type: 'rectTable' as const,
    label,
    ...ELEMENT_DEFAULTS.rectTable,
    ...payload,
  }),
  wall: (id: string, label: string, payload: AddWallPayload) => ({
    id,
    type: 'wall' as const,
    label,
    ...ELEMENT_DEFAULTS.wall,
    ...payload,
  }),
  window: (id: string, label: string, payload: AddWindowPayload) => ({
    id,
    type: 'window' as const,
    label,
    ...ELEMENT_DEFAULTS.window,
    ...payload,
  }),
  door: (id: string, label: string, payload: AddDoorPayload) => ({
    id,
    type: 'door' as const,
    label,
    ...ELEMENT_DEFAULTS.door,
    ...payload,
  }),
  separator: (id: string, label: string, payload: AddSeparatorPayload) => ({
    id,
    type: 'separator' as const,
    label,
    ...ELEMENT_DEFAULTS.separator,
    ...payload,
  }),
} satisfies {
  [K in FloorElementType]: (
    id: string,
    label: string,
    payload: AddPayloadByType[K]
  ) => Extract<FloorElement, { type: K }>;
};

type ElementResizers = {
  [K in FloorElementType]: (
    element: Extract<FloorElement, { type: K }>,
    payload: ResizePayloadByType[K]
  ) => void;
};

const ELEMENT_RESIZERS: ElementResizers = {
  roundTable: (
    element: Extract<FloorElement, { type: 'roundTable' }>,
    payload: ResizeRoundTablePayload
  ) => {
    if (typeof payload.radius === 'number') {
      element.radius = payload.radius;
    }
  },

  rectTable: (
    element: Extract<FloorElement, { type: 'rectTable' }>,
    payload: ResizeRectTablePayload
  ) => {
    if (typeof payload.width === 'number') {
      element.width = payload.width;
    }
    if (typeof payload.height === 'number') {
      element.height = payload.height;
    }
  },

  wall: (element: Extract<FloorElement, { type: 'wall' }>, payload: ResizeWallPayload) => {
    if (typeof payload.height === 'number') {
      element.height = payload.height;
    }
  },

  window: (element: Extract<FloorElement, { type: 'window' }>, payload: ResizeWindowPayload) => {
    if (typeof payload.height === 'number') {
      element.height = payload.height;
    }
  },

  door: (element: Extract<FloorElement, { type: 'door' }>, payload: ResizeDoorPayload) => {
    if (typeof payload.width === 'number') {
      element.width = payload.width;
    }
    if (typeof payload.height === 'number') {
      element.height = payload.height;
    }
  },

  separator: (
    element: Extract<FloorElement, { type: 'separator' }>,
    payload: ResizeSeparatorPayload
  ) => {
    if (typeof payload.height === 'number') {
      element.height = payload.height;
    }
  },
};

function getElementResizers<T extends FloorElementType>(type: T): ElementResizers[T] {
  return ELEMENT_RESIZERS[type] as ElementResizers[T];
}

export function generateId(prefix: FloorElementType): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/** Returns the active FloorData, or undefined if activeFloorId is not in floors. */
function getActiveFloor(state: FloorPlanState): FloorData | undefined {
  return state.floors[state.activeFloorId];
}

export function nextIndexByType(state: FloorPlanState, type: FloorElementType): number {
  const floor = getActiveFloor(state);
  if (!floor) return 1;
  return floor.elements.filter((e) => e.type === type).length + 1;
}

export function touchUpdatedAt(state: FloorPlanState) {
  const floor = getActiveFloor(state);
  if (floor) floor.updatedAt = new Date().toISOString();
}

export function addElement<T extends FloorElementType>(
  state: FloorPlanState,
  type: T,
  payload: AddPayloadByType[T] = {} as AddPayloadByType[T]
) {
  const floor = getActiveFloor(state);
  if (!floor) return;

  pushHistory(state);
  const id = generateId(type);
  const index = nextIndexByType(state, type);
  const label = payload.label ?? `${LABEL_PREFIX[type]}${index}`;
  const element = ELEMENT_BUILDERS[type](id, label, payload);
  floor.elements.push(element);
  state.selectedElementId = id;
  touchUpdatedAt(state);
}

export function resizeElement<T extends FloorElementType>(
  state: FloorPlanState,
  type: T,
  payload: ResizePayloadByType[T]
) {
  const floor = getActiveFloor(state);
  if (!floor) return;

  const element = floor.elements.find(
    (e): e is Extract<FloorElement, { type: T }> => e.id === payload.id && e.type === type
  );

  if (!element) return;

  pushHistory(state);
  const resize = getElementResizers(type);
  resize(element, payload);
  touchUpdatedAt(state);
}

export function toRuntimeState(payload: FloorPlanPersistedState): FloorPlanState {
  return {
    floors: cloneFloors(payload.floors),
    activeFloorId: payload.activeFloorId,
    selectedElementId: payload.selectedElementId,
    viewportScale: clampViewportScale(payload.viewportScale),
    viewportPan: payload.viewportPan ?? { x: 0, y: 0 },
    history: {
      past: [],
      future: [],
    },
  };
}

import { cloneElements, cloneMeta, pushHistory } from './history';
import { clampViewportScale } from './viewport';

import type {
  AddPayloadByType,
  AddRectTablePayload,
  AddRoundTablePayload,
  AddWallPayload,
  ResizePayloadByType,
  ResizeRectTablePayload,
  ResizeRoundTablePayload,
  ResizeWallPayload,
} from './payloadTypes';
import type {
  FloorElement,
  FloorElementType,
  FloorPlanPersistedState,
  FloorPlanState,
} from './types';

export const LABEL_PREFIX: Record<FloorElementType, string> = {
  roundTable: 'R',
  rectTable: 'T',
  wall: 'W',
};

const ELEMENT_DEFAULTS = {
  roundTable: { x: 0, y: 0, radius: 20 },
  rectTable: { x: 0, y: 0, width: 140, height: 80 },
  wall: { x: 0, y: 0, width: 220, height: 22 },
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
    if (typeof payload.width === 'number') {
      element.width = payload.width;
    }
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

export function nextIndexByType(state: FloorPlanState, type: FloorElementType): number {
  return state.elements.filter((e) => e.type === type).length + 1;
}

export function touchUpdatedAt(state: FloorPlanState) {
  state.meta.updatedAt = new Date().toISOString();
}

export function addElement<T extends FloorElementType>(
  state: FloorPlanState,
  type: T,
  payload: AddPayloadByType[T] = {} as AddPayloadByType[T]
) {
  pushHistory(state);
  const id = generateId(type);
  const index = nextIndexByType(state, type);
  const label = payload.label ?? `${LABEL_PREFIX[type]}${index}`;
  const element = ELEMENT_BUILDERS[type](id, label, payload);
  state.elements.push(element);
  state.selectedElementId = id;
  touchUpdatedAt(state);
}

export function resizeElement<T extends FloorElementType>(
  state: FloorPlanState,
  type: T,
  payload: ResizePayloadByType[T]
) {
  const element = state.elements.find(
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
    meta: cloneMeta(payload.meta),
    elements: cloneElements(payload.elements),
    selectedElementId: payload.selectedElementId,
    viewportScale: clampViewportScale(payload.viewportScale),
    history: {
      past: [],
      future: [],
    },
  };
}

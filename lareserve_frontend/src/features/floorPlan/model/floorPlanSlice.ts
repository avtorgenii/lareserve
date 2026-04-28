import { createSlice } from '@reduxjs/toolkit';

import {
  addElement,
  generateId,
  LABEL_PREFIX,
  nextIndexByType,
  resizeElement,
  toRuntimeState,
  touchUpdatedAt,
} from './elementOperations';
import { pushHistory, snapshotFloorPlan, restoreFromSnapshot } from './history';
import { createInitialFloorPlanState } from './types';
import { clampViewportScale, VIEWPORT_SCALE_FACTOR } from './viewport';

import type {
  AddDoorPayload,
  AddRectTablePayload,
  AddRoundTablePayload,
  AddSeparatorPayload,
  AddWallPayload,
  AddWindowPayload,
  MoveElementPayload,
  MoveWallEndpointPayload,
  ResizeDoorPayload,
  ResizeRectTablePayload,
  ResizeRoundTablePayload,
  ResizeSeparatorPayload,
  ResizeWallPayload,
  ResizeWindowPayload,
  SetViewportScalePayload,
  UpdateLabelPayload,
} from './payloadTypes';
import type { FloorElement, FloorPlanPersistedState, FloorPlanState } from './types';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: FloorPlanState = createInitialFloorPlanState();

const floorPlanSlice = createSlice({
  name: 'floorPlan',
  initialState,
  reducers: {
    hydrateFloorPlan: (_state, action: PayloadAction<FloorPlanPersistedState>) =>
      toRuntimeState(action.payload),

    resetFloorPlan: () => createInitialFloorPlanState(),

    selectElement: (state, action: PayloadAction<string | null>) => {
      state.selectedElementId = action.payload;
    },

    clearSelection: (state) => {
      state.selectedElementId = null;
    },

    addRoundTable: (state, action: PayloadAction<AddRoundTablePayload | undefined>) => {
      addElement(state, 'roundTable', action.payload ?? {});
    },

    addRectTable: (state, action: PayloadAction<AddRectTablePayload | undefined>) => {
      addElement(state, 'rectTable', action.payload ?? {});
    },

    addWall: (state, action: PayloadAction<AddWallPayload | undefined>) => {
      addElement(state, 'wall', action.payload ?? {});
    },

    addWindow: (state, action: PayloadAction<AddWindowPayload | undefined>) => {
      addElement(state, 'window', action.payload ?? {});
    },

    addDoor: (state, action: PayloadAction<AddDoorPayload | undefined>) => {
      addElement(state, 'door', action.payload ?? {});
    },

    addSeparator: (state, action: PayloadAction<AddSeparatorPayload | undefined>) => {
      addElement(state, 'separator', action.payload ?? {});
    },

    duplicateElement: (state, action: PayloadAction<string>) => {
      const source = state.elements.find((element) => element.id === action.payload);
      if (!source) return;

      pushHistory(state);
      const id = generateId(source.type);
      const index = nextIndexByType(state, source.type);

      let copy: FloorElement;
      if (source.type === 'wall' || source.type === 'separator' || source.type === 'window') {
        copy = {
          ...source,
          id,
          label: `${LABEL_PREFIX[source.type]}${index}`,
          x: source.x + 30,
          y: source.y + 30,
          x2: source.x2 + 30,
          y2: source.y2 + 30,
        };
      } else {
        copy = {
          ...source,
          id,
          label: `${LABEL_PREFIX[source.type]}${index}`,
          x: source.x + 30,
          y: source.y + 30,
        };
      }

      state.elements.push(copy);
      state.selectedElementId = id;
      touchUpdatedAt(state);
    },

    moveElement: (state, action: PayloadAction<MoveElementPayload>) => {
      const element = state.elements.find((e) => e.id === action.payload.id);
      if (!element) return;
      if (element.x === action.payload.x && element.y === action.payload.y) return;

      pushHistory(state);

      if (element.type === 'wall' || element.type === 'separator' || element.type === 'window') {
        const dx = action.payload.x - element.x;
        const dy = action.payload.y - element.y;
        element.x = action.payload.x;
        element.y = action.payload.y;
        element.x2 += dx;
        element.y2 += dy;
      } else {
        element.x = action.payload.x;
        element.y = action.payload.y;
      }

      touchUpdatedAt(state);
    },

    moveWallEndpoint: (state, action: PayloadAction<MoveWallEndpointPayload>) => {
      const element = state.elements.find((e) => e.id === action.payload.id);
      if (!element || (element.type !== 'wall' && element.type !== 'separator' && element.type !== 'window')) return;

      const { endpoint, x, y } = action.payload;
      if (endpoint === 'start' && element.x === x && element.y === y) return;
      if (endpoint === 'end' && element.x2 === x && element.y2 === y) return;

      pushHistory(state);
      if (endpoint === 'start') {
        element.x = x;
        element.y = y;
      } else {
        element.x2 = x;
        element.y2 = y;
      }
      touchUpdatedAt(state);
    },

    updateElementLabel: (state, action: PayloadAction<UpdateLabelPayload>) => {
      const element = state.elements.find((e) => e.id === action.payload.id);
      if (!element) return;
      if (element.label === action.payload.label) return;

      pushHistory(state);
      element.label = action.payload.label;
      touchUpdatedAt(state);
    },

    resizeRoundTable: (state, action: PayloadAction<ResizeRoundTablePayload>) => {
      resizeElement(state, 'roundTable', action.payload);
    },

    resizeRectTable: (state, action: PayloadAction<ResizeRectTablePayload>) => {
      resizeElement(state, 'rectTable', action.payload);
    },

    resizeWall: (state, action: PayloadAction<ResizeWallPayload>) => {
      resizeElement(state, 'wall', action.payload);
    },

    resizeWindow: (state, action: PayloadAction<ResizeWindowPayload>) => {
      resizeElement(state, 'window', action.payload);
    },

    resizeDoor: (state, action: PayloadAction<ResizeDoorPayload>) => {
      resizeElement(state, 'door', action.payload);
    },

    resizeSeparator: (state, action: PayloadAction<ResizeSeparatorPayload>) => {
      resizeElement(state, 'separator', action.payload);
    },

    removeElement: (state, action: PayloadAction<string>) => {
      const hasElement = state.elements.some((element) => element.id === action.payload);
      if (!hasElement) return;

      pushHistory(state);
      state.elements = state.elements.filter((e) => e.id !== action.payload);
      if (state.selectedElementId === action.payload) {
        state.selectedElementId = null;
      }
      touchUpdatedAt(state);
    },

    undoFloorPlan: (state) => {
      const previous = state.history.past.pop();
      if (!previous) return;

      state.history.future.push(snapshotFloorPlan(state));
      restoreFromSnapshot(state, previous);
    },

    redoFloorPlan: (state) => {
      const next = state.history.future.pop();
      if (!next) return;

      state.history.past.push(snapshotFloorPlan(state));
      restoreFromSnapshot(state, next);
    },

    setViewportScale: (state, action: PayloadAction<SetViewportScalePayload>) => {
      state.viewportScale = clampViewportScale(action.payload.scale);
    },

    setPan: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.viewportPan = action.payload;
    },

    zoomIn: (state) => {
      state.viewportScale = clampViewportScale(state.viewportScale * VIEWPORT_SCALE_FACTOR);
    },

    zoomOut: (state) => {
      state.viewportScale = clampViewportScale(state.viewportScale / VIEWPORT_SCALE_FACTOR);
    },

    saveFloorPlanRequested: () => {
      // Listener middleware persists current state to storage.
    },
  },
});

export const {
  hydrateFloorPlan,
  resetFloorPlan,
  selectElement,
  clearSelection,
  addRoundTable,
  addRectTable,
  addWall,
  addWindow,
  addDoor,
  addSeparator,
  duplicateElement,
  moveElement,
  moveWallEndpoint,
  updateElementLabel,
  removeElement,
  resizeRoundTable,
  resizeRectTable,
  resizeWall,
  resizeWindow,
  resizeDoor,
  resizeSeparator,
  undoFloorPlan,
  redoFloorPlan,
  setViewportScale,
  setPan,
  zoomIn,
  zoomOut,
  saveFloorPlanRequested,
} = floorPlanSlice.actions;

export const floorPlanReducer = floorPlanSlice.reducer;

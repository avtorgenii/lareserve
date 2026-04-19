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
  AddRectTablePayload,
  AddRoundTablePayload,
  AddWallPayload,
  MoveElementPayload,
  ResizeRectTablePayload,
  ResizeRoundTablePayload,
  ResizeWallPayload,
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

    duplicateElement: (state, action: PayloadAction<string>) => {
      const source = state.elements.find((element) => element.id === action.payload);
      if (!source) return;

      pushHistory(state);
      const id = generateId(source.type);
      const index = nextIndexByType(state, source.type);
      const copy: FloorElement = {
        ...source,
        id,
        label: `${LABEL_PREFIX[source.type]}${index}`,
        x: source.x + 30,
        y: source.y + 30,
      };

      state.elements.push(copy);
      state.selectedElementId = id;
      touchUpdatedAt(state);
    },

    moveElement: (state, action: PayloadAction<MoveElementPayload>) => {
      const element = state.elements.find((e) => e.id === action.payload.id);
      if (!element) return;
      if (element.x === action.payload.x && element.y === action.payload.y) return;

      pushHistory(state);
      element.x = action.payload.x;
      element.y = action.payload.y;
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
  duplicateElement,
  moveElement,
  updateElementLabel,
  removeElement,
  resizeRoundTable,
  resizeRectTable,
  resizeWall,
  undoFloorPlan,
  redoFloorPlan,
  setViewportScale,
  zoomIn,
  zoomOut,
  saveFloorPlanRequested,
} = floorPlanSlice.actions;

export const floorPlanReducer = floorPlanSlice.reducer;

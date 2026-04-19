import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import type { RootState } from './rootReducer';

import {
  addRectTable,
  addRoundTable,
  addWall,
  duplicateElement,
  moveElement,
  redoFloorPlan,
  removeElement,
  resetFloorPlan,
  resizeRectTable,
  resizeRoundTable,
  resizeWall,
  saveFloorPlanRequested,
  setViewportScale,
  undoFloorPlan,
  updateElementLabel,
  zoomIn,
  zoomOut,
} from '@/features/floorPlan/model/floorPlanSlice';
import { saveFloorPlanToLocalStorage } from '@/features/floorPlan/persistence/localStorageRepo';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(
    addRoundTable,
    addRectTable,
    addWall,
    duplicateElement,
    moveElement,
    updateElementLabel,
    removeElement,
    resetFloorPlan,
    resizeRoundTable,
    resizeRectTable,
    resizeWall,
    undoFloorPlan,
    redoFloorPlan,
    setViewportScale,
    zoomIn,
    zoomOut
  ),
  effect: async (_action, api) => {
    api.cancelActiveListeners();
    await api.delay(300); // Debounce to avoid excessive saves during rapid changes

    const state = api.getState() as RootState;
    saveFloorPlanToLocalStorage(state.floorPlan);
  },
});

listenerMiddleware.startListening({
  actionCreator: saveFloorPlanRequested,
  effect: async (_action, api) => {
    const state = api.getState() as RootState;
    saveFloorPlanToLocalStorage(state.floorPlan);
  },
});

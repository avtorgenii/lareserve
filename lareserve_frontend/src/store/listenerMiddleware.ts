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
import { saveFloorPlanToApi } from '@/features/floorPlan/persistence/httpRepo';
import { saveFloorPlanToLocalStorage } from '@/features/floorPlan/persistence/localStorageRepo';
import { RESTAURANT_ID } from '@/shared/lib/constants';

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
    try {
      await saveFloorPlanToApi(RESTAURANT_ID, state.floorPlan.elements);
    } catch (error) {
      console.error('[FloorPlan] Failed to save to API:', error);
    }
  },
});

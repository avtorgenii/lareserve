import { createListenerMiddleware } from '@reduxjs/toolkit';

import type { RootState } from './rootReducer';

import { saveFloorPlanRequested } from '@/features/floorPlan/model/floorPlanSlice';
import { saveFloorPlanToApi } from '@/features/floorPlan/persistence/httpRepo';
import { RESTAURANT_ID } from '@/shared/lib/constants';

export const listenerMiddleware = createListenerMiddleware();

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

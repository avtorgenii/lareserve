import { combineReducers } from '@reduxjs/toolkit';

import { floorPlanReducer } from '@/features/floorPlan/model/floorPlanSlice';

export const rootReducer = combineReducers({
  floorPlan: floorPlanReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

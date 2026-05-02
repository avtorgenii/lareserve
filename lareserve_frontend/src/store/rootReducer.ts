import { combineReducers } from '@reduxjs/toolkit';

import { floorPlanReducer } from '@/features/floorPlan/model/floorPlanSlice';
import { reservationsReducer } from '@/features/reservations/model/reservationsSlice';

export const rootReducer = combineReducers({
  floorPlan: floorPlanReducer,
  reservations: reservationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

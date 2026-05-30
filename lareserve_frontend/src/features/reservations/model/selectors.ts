import { createSelector } from '@reduxjs/toolkit';

import type { Reservation, ReservationsLoadingState } from './types';
import type { TableStatus } from '@/features/floorPlan/model/types';
import type { RootState } from '@/store/rootReducer';

import { selectFloorPlanElements } from '@/features/floorPlan/model/selectors';

export const selectAllReservations = (state: RootState): Reservation[] =>
  state.reservations.reservations;

export const selectTableStatusesByLabel = (state: RootState): Record<string, TableStatus> =>
  state.reservations.tableStatusesByLabel;

/** Returns table statuses keyed by element ID (for use with FloorPlanCanvas tableStatuses prop) */
export const selectTableStatusesById = createSelector(
  selectFloorPlanElements,
  selectTableStatusesByLabel,
  (elements, statusesByLabel) => {
    const result: Record<string, TableStatus> = {};
    for (const el of elements) {
      if (el.type === 'roundTable' || el.type === 'rectTable') {
        const status = statusesByLabel[el.label];
        if (status) result[el.id] = status;
      }
    }
    return result;
  }
);

export const selectReservationsForTable = createSelector(
  selectAllReservations,
  (_: RootState, tableLabel: string) => tableLabel,
  (reservations, tableLabel) => reservations.filter((r) => r.tableLabel === tableLabel)
);

export const selectTodaysReservations = createSelector(selectAllReservations, (reservations) =>
  [...reservations].sort((a, b) => a.time.localeCompare(b.time))
);

export const selectTableStatusCounts = createSelector(
  selectTableStatusesByLabel,
  (statusesByLabel) => {
    const counts = { available: 0, reserved: 0, occupied: 0 };
    for (const status of Object.values(statusesByLabel)) {
      counts[status]++;
    }
    return counts;
  }
);

export const selectReservationsLoadingState = (state: RootState): ReservationsLoadingState =>
  state.reservations.loadingState;

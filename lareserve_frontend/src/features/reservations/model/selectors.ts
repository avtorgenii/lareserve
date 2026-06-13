import { createSelector } from '@reduxjs/toolkit';

import type { BackendReservation } from './api';
import type { Reservation, ReservationsLoadingState } from './types';
import type { FloorElement, TableStatus } from '@/features/floorPlan/model/types';
import type { RootState } from '@/store/rootReducer';

import { selectAllFloorElements } from '@/features/floorPlan/model/selectors';

const selectRawReservations = (state: RootState): BackendReservation[] =>
  state.reservations.rawReservations;

const selectRawSelectedTableReservations = (state: RootState): BackendReservation[] =>
  state.reservations.rawSelectedTableReservations;

function mapRaw(r: BackendReservation, elements: FloorElement[]): Reservation {
  const el = elements.find((e) => e.id === r.table_id);
  const status =
    r.status === 'FINISHED' ? 'completed' : r.status === 'ACCEPTED' ? 'current' : 'upcoming';
  return {
    id: r.id.toString(),
    tableLabel: el?.label ?? `T-${r.table_id}`,
    tableId: r.table_id,
    guestName: r.guest_name || '',
    email: r.email || undefined,
    phone: r.phone || undefined,
    time: r.date.substring(11, 16),
    status,
  };
}

export const selectTableStatusesByLabel = createSelector(
  selectRawReservations,
  selectAllFloorElements,
  (rawReservations, elements) => {
    const result: Record<string, TableStatus> = {};
    for (const r of rawReservations) {
      const el = elements.find((e) => e.id === r.table_id);
      if (!el) continue;

      if (r.status === 'ACCEPTED') {
        result[el.label] = 'occupied';
      } else if (r.status === 'CONFIRMED' && result[el.label] !== 'occupied') {
        result[el.label] = 'reserved';
      }
    }
    for (const el of elements) {
      if (result[el.label]) continue;
      result[el.label] = 'available';
    }
    return result;
  }
);

/** Returns table statuses keyed by element ID (for use with FloorPlanCanvas tableStatuses prop) */
export const selectTableStatusesById = createSelector(
  selectAllFloorElements,
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

export const selectTodaysReservations = createSelector(
  selectRawReservations,
  selectAllFloorElements,
  (rawReservations, elements) =>
    rawReservations
      .filter((r) => r.status !== 'CANCELLED')
      .map((r) => mapRaw(r, elements))
      .sort((a, b) => a.time.localeCompare(b.time))
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

export const selectSelectedTableReservations = createSelector(
  selectRawSelectedTableReservations,
  selectAllFloorElements,
  (rawReservations, elements) =>
    rawReservations.filter((r) => r.status !== 'CANCELLED').map((r) => mapRaw(r, elements))
);

export const selectSelectedTableLoadingState = (state: RootState): ReservationsLoadingState =>
  state.reservations.selectedTableLoadingState;

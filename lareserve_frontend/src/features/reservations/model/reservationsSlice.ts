import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchTodaysReservationsFromApi } from './api';

import type { Reservation, ReservationsState } from './types';
import type { FloorElement, TableStatus } from '@/features/floorPlan/model/types';

import { RESTAURANT_ID } from '@/shared/lib/constants';

// Minimal slice of state needed by this thunk — avoids a circular import with rootReducer.
type StateSlice = {
  floorPlan: { elements: FloorElement[] };
};

export const fetchTodaysReservations = createAsyncThunk<
  { reservations: Reservation[]; tableStatusesByLabel: Record<string, TableStatus> },
  void,
  { state: StateSlice }
>('reservations/fetchToday', async (_, { getState }) => {
  const elements = getState().floorPlan.elements;
  const data = await fetchTodaysReservationsFromApi(RESTAURANT_ID);

  const reservations: Reservation[] = data
    .filter((r) => r.status !== 'CANCELLED')
    .map((r) => {
      // table_id is currently an integer; element IDs are UUID strings.
      // This lookup will match once the backend migrates table_id to CharField.
      const el = elements.find((e) => e.id === r.table_id.toString());
      const tableLabel = el?.label ?? `T-${r.table_id}`;
      // Extract HH:MM from ISO datetime
      const time = r.date.substring(11, 16);
      return {
        id: r.id.toString(),
        tableLabel,
        tableId: r.table_id.toString(),
        guestName: r.guest_name || '',
        time,
        status: r.status === 'FINISHED' ? ('completed' as const) : ('upcoming' as const),
      };
    });

  // Build table status map from confirmed reservations
  const tableStatusesByLabel: Record<string, TableStatus> = {};
  for (const r of data) {
    if (r.status === 'CONFIRMED') {
      const el = elements.find((e) => e.id === r.table_id.toString());
      if (el) {
        tableStatusesByLabel[el.label] = 'reserved';
      }
    }
  }

  return { reservations, tableStatusesByLabel };
});

const initialState: ReservationsState = {
  tableStatusesByLabel: {},
  reservations: [],
  loadingState: 'idle',
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodaysReservations.pending, (state) => {
        state.loadingState = 'loading';
      })
      .addCase(fetchTodaysReservations.fulfilled, (state, action) => {
        state.reservations = action.payload.reservations;
        state.tableStatusesByLabel = action.payload.tableStatusesByLabel;
        state.loadingState = 'idle';
      })
      .addCase(fetchTodaysReservations.rejected, (state) => {
        state.loadingState = 'error';
      });
  },
});

export const reservationsReducer = reservationsSlice.reducer;

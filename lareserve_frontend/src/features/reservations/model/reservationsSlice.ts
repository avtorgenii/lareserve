import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  fetchTodaysReservationsFromApi,
  fetchReservationsByTable,
  cancelReservation as cancelReservationApi,
  updateReservationStatus,
} from './api';

import type { BackendReservation } from './api';
import type { ReservationsState } from './types';

import { RESTAURANT_ID } from '@/shared/lib/constants';

export const fetchTodaysReservations = createAsyncThunk<BackendReservation[], void>(
  'reservations/fetchToday',
  async () => fetchTodaysReservationsFromApi(RESTAURANT_ID)
);

export const fetchTableReservations = createAsyncThunk<
  BackendReservation[],
  { tableId: string; date: string }
>('reservations/fetchByTable', async ({ tableId, date }) =>
  fetchReservationsByTable(RESTAURANT_ID, tableId, date)
);

export const cancelReservation = createAsyncThunk<string, string>(
  'reservations/cancel',
  async (reservationId) => {
    await cancelReservationApi(Number(reservationId));
    return reservationId;
  }
);

export const finishReservation = createAsyncThunk<string, string>(
  'reservations/finish',
  async (reservationId) => {
    await updateReservationStatus(Number(reservationId), 'FINISHED');
    return reservationId;
  }
);

export const acceptReservation = createAsyncThunk<string, string>(
  'reservations/accept',
  async (reservationId) => {
    await updateReservationStatus(Number(reservationId), 'ACCEPTED');
    return reservationId;
  }
);

const initialState: ReservationsState = {
  rawReservations: [],
  loadingState: 'idle',
  rawSelectedTableReservations: [],
  selectedTableLoadingState: 'idle',
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
        state.rawReservations = action.payload;
        state.loadingState = 'idle';
      })
      .addCase(fetchTodaysReservations.rejected, (state) => {
        state.loadingState = 'error';
      })
      .addCase(fetchTableReservations.pending, (state) => {
        state.selectedTableLoadingState = 'loading';
        state.rawSelectedTableReservations = [];
      })
      .addCase(fetchTableReservations.fulfilled, (state, action) => {
        state.rawSelectedTableReservations = action.payload;
        state.selectedTableLoadingState = 'idle';
      })
      .addCase(fetchTableReservations.rejected, (state) => {
        state.selectedTableLoadingState = 'error';
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        const id = Number(action.payload);
        state.rawReservations = state.rawReservations.filter((r) => r.id !== id);
        state.rawSelectedTableReservations = state.rawSelectedTableReservations.filter(
          (r) => r.id !== id
        );
      })
      .addCase(finishReservation.fulfilled, (state, action) => {
        const id = Number(action.payload);
        const r = state.rawReservations.find((r) => r.id === id);
        if (r) r.status = 'FINISHED';
        const sr = state.rawSelectedTableReservations.find((r) => r.id === id);
        if (sr) sr.status = 'FINISHED';
      })
      .addCase(acceptReservation.fulfilled, (state, action) => {
        const id = Number(action.payload);
        const r = state.rawReservations.find((r) => r.id === id);
        if (r) r.status = 'ACCEPTED';
        const sr = state.rawSelectedTableReservations.find((r) => r.id === id);
        if (sr) sr.status = 'ACCEPTED';
      });
  },
});

export const reservationsReducer = reservationsSlice.reducer;

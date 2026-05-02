import { createSlice } from '@reduxjs/toolkit';

import type { ReservationsState } from './types';

// ---------------------------------------------------------------------------
// Mock data — replace with API calls when the backend is ready
// ---------------------------------------------------------------------------

const MOCK_INITIAL_STATE: ReservationsState = {
  tableStatusesByLabel: {
    'T-01': 'occupied',
    'T-02': 'reserved',
    'T-03': 'reserved',
    'T-04': 'available',
    'T-05': 'occupied',
    'T-06': 'reserved',
    'T-07': 'available',
    'T-08': 'occupied',
    'T-09': 'available',
  },
  reservations: [
    {
      id: 'r1',
      tableLabel: 'T-02',
      guestName: 'Kowalski',
      time: '13:00',
      partySize: 4,
      status: 'upcoming',
    },
    {
      id: 'r2',
      tableLabel: 'T-06',
      guestName: 'Nowak',
      time: '14:30',
      partySize: 6,
      status: 'upcoming',
    },
    {
      id: 'r3',
      tableLabel: 'T-01',
      guestName: 'Wiśniewska',
      time: '12:00',
      partySize: 2,
      status: 'current',
    },
    {
      id: 'r4',
      tableLabel: 'T-04',
      guestName: 'Zielińska',
      time: '17:00',
      partySize: 3,
      status: 'upcoming',
    },
    {
      id: 'r5',
      tableLabel: 'T-02',
      guestName: 'Wiśniewska',
      time: '12:00',
      partySize: 2,
      status: 'current',
    },
    {
      id: 'r6',
      tableLabel: 'T-02',
      guestName: 'Nowak',
      time: '14:30',
      partySize: 6,
      status: 'upcoming',
    },
  ],
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState: MOCK_INITIAL_STATE,
  reducers: {},
});

export const reservationsReducer = reservationsSlice.reducer;

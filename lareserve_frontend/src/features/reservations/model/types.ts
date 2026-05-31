import type { BackendReservation } from './api';

export type ReservationStatus = 'upcoming' | 'current' | 'completed';

/** Derived display type — never stored in Redux, only returned from selectors. */
export type Reservation = {
  id: string;
  tableLabel: string;
  tableId?: string;
  guestName: string;
  email?: string;
  phone?: string;
  time: string; // 'HH:MM'
  partySize?: number;
  status: ReservationStatus;
};

export type ReservationsLoadingState = 'idle' | 'loading' | 'error';

export type ReservationsState = {
  /** Raw API responses — mapping to display types happens in selectors. */
  rawReservations: BackendReservation[];
  loadingState: ReservationsLoadingState;
  rawSelectedTableReservations: BackendReservation[];
  selectedTableLoadingState: ReservationsLoadingState;
};

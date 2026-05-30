import type { TableStatus } from '@/features/floorPlan/model/types';

export type ReservationStatus = 'upcoming' | 'current' | 'completed';

export type Reservation = {
  id: string;
  tableLabel: string;
  /** Original backend table_id stored as string for future API calls (e.g. move/cancel). */
  tableId?: string;
  guestName: string;
  time: string; // 'HH:MM'
  /** Not provided by the backend — optional for display purposes only. */
  partySize?: number;
  status: ReservationStatus;
};

export type ReservationsLoadingState = 'idle' | 'loading' | 'error';

export type ReservationsState = {
  /** Table statuses keyed by table label (e.g. 'T-01') — derived from today's reservations */
  tableStatusesByLabel: Record<string, TableStatus>;
  reservations: Reservation[];
  loadingState: ReservationsLoadingState;
};

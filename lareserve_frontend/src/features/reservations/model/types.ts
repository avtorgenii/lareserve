import type { TableStatus } from '@/features/floorPlan/model/types';

export type ReservationStatus = 'upcoming' | 'current' | 'completed';

export type Reservation = {
  id: string;
  tableLabel: string;
  guestName: string;
  time: string; // 'HH:MM'
  partySize: number;
  status: ReservationStatus;
};

export type ReservationsState = {
  /** Table statuses keyed by table label (e.g. 'T-01') — derived from reservations in a real app */
  tableStatusesByLabel: Record<string, TableStatus>;
  reservations: Reservation[];
};

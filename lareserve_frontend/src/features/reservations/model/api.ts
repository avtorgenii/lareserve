import { apiClient } from '@/shared/lib/apiClient';

/** Shape returned by ReservationSummarySerializer */
export type BackendReservation = {
  id: number;
  /** ISO datetime string, e.g. "2026-05-13T19:00:00Z" */
  date: string;
  table_id: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'FINISHED';
  guest_name: string;
  email: string;
  phone: string;
  special_requests: string | null;
};

/**
 * Fetch today's reservations for a restaurant.
 * Requires authentication — will throw 401 until auth is wired up.
 */
export async function fetchTodaysReservationsFromApi(
  restaurantId: number
): Promise<BackendReservation[]> {
  const response = await apiClient.get<BackendReservation[]>('/reservations/today/', {
    params: { restaurant_id: restaurantId },
  });
  return response.data;
}

/** Fetch reservations for a specific table on a given date. */
export async function fetchReservationsByTable(
  restaurantId: number,
  tableId: string,
  date: string // ISO date "YYYY-MM-DD"
): Promise<BackendReservation[]> {
  const response = await apiClient.get<BackendReservation[]>('/reservations/by-table/', {
    params: { restaurant_id: restaurantId, table_id: tableId, date },
  });
  return response.data;
}

/** Cancel a reservation. Requires authentication. */
export async function cancelReservation(pk: number): Promise<void> {
  await apiClient.post(`/reservations/${pk}/cancel/`);
}

/** Update a reservation's status. Requires authentication. */
export async function updateReservationStatus(
  pk: number,
  status: 'CONFIRMED' | 'FINISHED'
): Promise<void> {
  await apiClient.put(`/reservations/${pk}/status/`, { status });
}

/** Permanently delete a reservation. Requires authentication. */
export async function deleteReservation(pk: number): Promise<void> {
  await apiClient.delete(`/reservations/${pk}/delete/`);
}

/** Move a reservation to a different table. Requires authentication. */
export async function moveReservation(
  pk: number,
  newTableId: string,
  date: string // ISO datetime
): Promise<void> {
  await apiClient.put(`/reservations/${pk}/move/`, { table_id: newTableId, date });
}

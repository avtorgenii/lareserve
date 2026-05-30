import { apiClient } from '@/shared/lib/apiClient';

/** Shape returned by ReservationSummarySerializer */
export type BackendReservation = {
  id: number;
  /** ISO datetime string, e.g. "2026-05-13T19:00:00Z" */
  date: string;
  /** Integer FK — matches element.id only after backend migrates table_id to CharField */
  table_id: number;
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

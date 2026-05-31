import { apiClient } from '@/shared/lib/apiClient';

/** Returns ISO date strings for the next 14 bookable days (e.g. "2026-05-13"). */
export async function fetchAvailableDates(restaurantId: number): Promise<string[]> {
  const response = await apiClient.get<string[]>(`/restaurants/${restaurantId}/available-dates/`);
  return response.data;
}

/**
 * Returns availability per time slot for a given date.
 * Shape: { "11:00": true, "12:00": false, ... }
 * true = at least one table is available at that time.
 */
export async function fetchAvailableTimes(
  restaurantId: number,
  date: string // ISO date "YYYY-MM-DD"
): Promise<Record<string, boolean>> {
  const response = await apiClient.get<Record<string, boolean>>(
    `/restaurants/${restaurantId}/available-times/`,
    { params: { date } }
  );
  return response.data;
}

/**
 * Submit a reservation.
 * Requires authentication — will throw 401 until auth is wired up.
 * Note: table_id is sent as-is; the backend currently expects an integer but the
 * frontend uses UUID strings. This will work correctly once the backend field is
 * migrated to CharField.
 */
export async function submitReservation(
  restaurantId: number,
  tableId: string,
  dateTime: string, // ISO datetime "YYYY-MM-DDTHH:MM:00Z"
  specialRequests?: string
): Promise<void> {
  await apiClient.post('/reservations/', {
    restaurant: restaurantId,
    table_id: tableId,
    date: dateTime,
    special_requests: specialRequests ?? '',
  });
}

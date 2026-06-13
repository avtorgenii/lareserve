import { apiClient } from '@/shared/lib/apiClient';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function extractDatesPayload(data: unknown): unknown {
  if (Array.isArray(data)) return data;
  if (!isRecord(data)) return [];

  if (Array.isArray(data.dates)) return data.dates;
  if (Array.isArray(data.available_dates)) return data.available_dates;
  if (Array.isArray(data.results)) return data.results;

  return [];
}

function normalizeDates(data: unknown): string[] {
  const payload = extractDatesPayload(data);
  if (!Array.isArray(payload)) return [];
  return payload.filter((d: unknown): d is string => typeof d === 'string');
}

function normalizeTimes(data: unknown): Record<string, boolean> {
  if (!isRecord(data)) return {};

  if (isRecord(data.times)) {
    return Object.entries(data.times).reduce<Record<string, boolean>>((acc, [slot, value]) => {
      if (typeof value === 'boolean') {
        acc[slot] = value;
      }
      return acc;
    }, {});
  }

  return Object.entries(data).reduce<Record<string, boolean>>((acc, [slot, value]) => {
    if (typeof value === 'boolean') {
      acc[slot] = value;
    }
    return acc;
  }, {});
}

function normalizeTables(data: unknown): Record<string, boolean> {
  if (!isRecord(data)) return {};

  const rawTables = isRecord(data.tables) ? data.tables : data;

  return Object.entries(rawTables).reduce<Record<string, boolean>>((acc, [tableId, value]) => {
    if (typeof value === 'boolean') {
      acc[tableId] = value;
    }
    return acc;
  }, {});
}

/** Returns ISO date strings for the next 14 bookable days (e.g. "2026-05-13"). */
export async function fetchAvailableDates(restaurantId: number): Promise<string[]> {
  const response = await apiClient.get<unknown>(`/restaurants/${restaurantId}/available-dates/`);
  return normalizeDates(response.data);
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
  const response = await apiClient.get<unknown>(`/restaurants/${restaurantId}/available-times/`, {
    params: { date },
  });
  return normalizeTimes(response.data);
}

/**
 * Returns availability per table for a given date and time.
 * Shape: { "table-id": true/false, ... }
 */
export async function fetchAvailableTables(
  restaurantId: number,
  date: string, // ISO date "YYYY-MM-DD"
  time: string // Time slot "HH:MM"
): Promise<Record<string, boolean>> {
  const response = await apiClient.get<unknown>(`/restaurants/${restaurantId}/available-tables/`, {
    params: { date, time },
  });
  return normalizeTables(response.data);
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
  floorId: string,
  name: string,
  email: string,
  phone: string,
  specialRequests?: string
): Promise<void> {
  await apiClient.post('/reservations/', {
    restaurant: restaurantId,
    table_id: tableId,
    floor_id: floorId,
    date: dateTime,
    special_requests: specialRequests ?? '',
    guest_name: name,
    guest_email: email,
    guest_phone: phone,
  });
}

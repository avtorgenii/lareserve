import type { FloorElement } from '../model/types';

import { apiClient } from '@/shared/lib/apiClient';

/** Shape returned by GET /api/v1/restaurants/{id}/layout/ */
type BackendLayout = {
  floors: Record<string, FloorElement>;
};

/**
 * Load floor plan elements from the backend.
 * Backend format: { floors: { [elementId]: element } }
 * Returns a flat array of elements (empty array when the restaurant has no layout yet).
 */
export async function loadFloorPlanFromApi(restaurantId: number): Promise<FloorElement[]> {
  const response = await apiClient.get<BackendLayout>(`/restaurants/${restaurantId}/layout/`);
  const floors = response.data?.floors;
  if (!floors) return [];
  return Object.values(floors);
}

/**
 * Save floor plan elements to the backend.
 * Converts the flat elements array to { floors: { [id]: element } }.
 * Requires authentication — will throw with 401 until auth is wired up.
 */
export async function saveFloorPlanToApi(
  restaurantId: number,
  elements: FloorElement[]
): Promise<void> {
  const floors: Record<string, FloorElement> = {};
  for (const el of elements) {
    floors[el.id] = el;
  }
  await apiClient.put(`/restaurants/${restaurantId}/layout/update/`, { floors });
}

import { floorLabel } from '../model/types';

import type { FloorData, FloorElement } from '../model/types';

import { apiClient } from '@/shared/lib/apiClient';

/** Shape returned by GET /api/v1/restaurants/{id}/layout/ */
type BackendLayout = {
  floors: Record<string, FloorElement[]>;
};

/**
 * Load the multi-floor layout from the backend.
 * Backend format: { floors: { "1": [element, ...], "2": [...] } }
 * Returns a Record<floorId, FloorData>, empty object when no layout exists.
 */
export async function loadFloorPlanFromApi(
  restaurantId: number
): Promise<Record<string, FloorData>> {
  const response = await apiClient.get<BackendLayout>(`/restaurants/${restaurantId}/layout/`);
  const floors = response.data?.floors;
  if (!floors || Object.keys(floors).length === 0) return {};

  const result: Record<string, FloorData> = {};
  for (const [id, elements] of Object.entries(floors)) {
    result[id] = {
      id,
      name: floorLabel(id),
      elements: Array.isArray(elements) ? elements : [],
      updatedAt: new Date().toISOString(),
    };
  }
  return result;
}

/**
 * Save the multi-floor layout to the backend.
 * Converts FloorData map to { floors: { "1": [element, ...], ... } }.
 * Requires authentication — will throw with 401 until auth is wired up.
 */
export async function saveFloorPlanToApi(
  restaurantId: number,
  floors: Record<string, FloorData>
): Promise<void> {
  const backendFloors: Record<string, FloorElement[]> = {};
  for (const [id, floor] of Object.entries(floors)) {
    backendFloors[id] = floor.elements;
  }
  await apiClient.put(`/restaurants/${restaurantId}/layout/update/`, {
    floors: backendFloors,
  });
}

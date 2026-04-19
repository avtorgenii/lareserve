// PLIK DO DOSTOSOWANIA JAK BEDZIE API

import axios from 'axios';

import type { FloorPlanState } from '../model/types';

type FloorPlanDto = FloorPlanState;

type SaveFloorPlanRequest = {
  restaurantId: string;
  floorPlanId: string;
  data: FloorPlanDto;
};

type LoadFloorPlanRequest = {
  restaurantId: string;
  floorPlanId: string;
};

type HttpRepoConfig = {
  baseUrl?: string;
};

const DEFAULT_BASE_URL = '/api/floor-plans';

function createHttpClient(config?: HttpRepoConfig) {
  return axios.create({
    baseURL: config?.baseUrl || DEFAULT_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function loadFloorPlanFromApi(
  params: LoadFloorPlanRequest,
  config?: HttpRepoConfig
): Promise<FloorPlanState> {
  const client = createHttpClient(config);

  const response = await client.get<FloorPlanDto>(`/${params.restaurantId}/${params.floorPlanId}`);

  return response.data;
}

export async function saveFloorPlanToApi(
  payload: SaveFloorPlanRequest,
  config?: HttpRepoConfig
): Promise<FloorPlanState> {
  const client = createHttpClient(config);

  const response = await client.put<FloorPlanDto>(
    `/${payload.restaurantId}/${payload.floorPlanId}`,
    payload.data
  );

  return response.data;
}

export async function createFloorPlanInApi(
  payload: SaveFloorPlanRequest,
  config?: HttpRepoConfig
): Promise<FloorPlanState> {
  const client = createHttpClient(config);

  const response = await client.post<FloorPlanDto>(
    `/${payload.restaurantId}/${payload.floorPlanId}`,
    payload.data
  );

  return response.data;
}

export async function deleteFloorPlanFromApi(
  params: LoadFloorPlanRequest,
  config?: HttpRepoConfig
): Promise<void> {
  const client = createHttpClient(config);

  await client.delete(`/${params.restaurantId}/${params.floorPlanId}`);
}

import type { FloorData, FloorElement, FloorPlanHistoryEntry, FloorPlanState } from './types';

export const HISTORY_LIMIT = 80;

export function cloneElements(elements: FloorElement[]) {
  return elements.map((element) => ({ ...element }));
}

export function cloneFloors(floors: Record<string, FloorData>): Record<string, FloorData> {
  const result: Record<string, FloorData> = {};
  for (const [id, floor] of Object.entries(floors)) {
    result[id] = { ...floor, elements: cloneElements(floor.elements) };
  }
  return result;
}

export function snapshotFloorPlan(state: FloorPlanState): FloorPlanHistoryEntry {
  return {
    floors: cloneFloors(state.floors),
    activeFloorId: state.activeFloorId,
    selectedElementId: state.selectedElementId,
    viewportScale: state.viewportScale,
  };
}

export function restoreFromSnapshot(state: FloorPlanState, snapshot: FloorPlanHistoryEntry) {
  state.floors = cloneFloors(snapshot.floors);
  state.activeFloorId = snapshot.activeFloorId;
  state.selectedElementId = snapshot.selectedElementId;
  state.viewportScale = snapshot.viewportScale;
}

export function pushHistory(state: FloorPlanState) {
  state.history.past.push(snapshotFloorPlan(state));
  if (state.history.past.length > HISTORY_LIMIT) {
    state.history.past.shift();
  }
  state.history.future = [];
}

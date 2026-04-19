import type { FloorElement, FloorPlanHistoryEntry, FloorPlanState } from './types';

export const HISTORY_LIMIT = 80;

export function cloneMeta(meta: FloorPlanState['meta']) {
  return { ...meta };
}

export function cloneElements(elements: FloorElement[]) {
  return elements.map((element) => ({ ...element }));
}

export function snapshotFloorPlan(state: FloorPlanState): FloorPlanHistoryEntry {
  return {
    meta: cloneMeta(state.meta),
    elements: cloneElements(state.elements),
    selectedElementId: state.selectedElementId,
    viewportScale: state.viewportScale,
  };
}

export function restoreFromSnapshot(state: FloorPlanState, snapshot: FloorPlanHistoryEntry) {
  state.meta = cloneMeta(snapshot.meta);
  state.elements = cloneElements(snapshot.elements);
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

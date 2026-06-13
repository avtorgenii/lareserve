import { createSelector } from '@reduxjs/toolkit';

import type { FloorData, FloorElementType, FloorPlanState } from './types';

type RootStateLike = {
  floorPlan: FloorPlanState;
};

export const selectFloorPlanState = (state: RootStateLike) => state.floorPlan;

// ---------------------------------------------------------------------------
// Floor navigation
// ---------------------------------------------------------------------------

/** All floors keyed by id. */
export const selectFloors = createSelector([selectFloorPlanState], (floorPlan) => floorPlan.floors);

/** Sorted array of FloorData for use in FloorSelector components. */
export const selectFloorsList = createSelector([selectFloors], (floors) =>
  Object.values(floors).sort((a, b) => {
    const na = parseInt(a.id, 10);
    const nb = parseInt(b.id, 10);
    return isNaN(na) || isNaN(nb) ? a.id.localeCompare(b.id) : na - nb;
  })
);

export const selectActiveFloorId = createSelector(
  [selectFloorPlanState],
  (floorPlan) => floorPlan.activeFloorId
);

export const selectActiveFloor = createSelector(
  [selectFloors, selectActiveFloorId],
  (floors, activeId): FloorData | undefined => floors[activeId]
);

// ---------------------------------------------------------------------------
// Elements — active floor (used by canvas, editor, sidebar)
// ---------------------------------------------------------------------------

/** Elements on the currently active floor. */
export const selectFloorPlanElements = createSelector(
  [selectActiveFloor],
  (floor) => floor?.elements ?? []
);

/** All elements across every floor flattened — used for reservation table lookups. */
export const selectAllFloorElements = createSelector([selectFloors], (floors) =>
  Object.values(floors).flatMap((f) => f.elements)
);

// ---------------------------------------------------------------------------
// Selection
// ---------------------------------------------------------------------------

export const selectSelectedElementId = createSelector(
  [selectFloorPlanState],
  (floorPlan) => floorPlan.selectedElementId
);

export const selectSelectedElement = createSelector(
  [selectFloorPlanElements, selectSelectedElementId],
  (elements, selectedId) => elements.find((el) => el.id === selectedId) ?? null
);

// ---------------------------------------------------------------------------
// Viewport
// ---------------------------------------------------------------------------

export const selectViewportScale = createSelector(
  [selectFloorPlanState],
  (floorPlan) => floorPlan.viewportScale
);

export const selectViewportPan = createSelector(
  [selectFloorPlanState],
  (floorPlan) => floorPlan.viewportPan
);

export const selectViewportCenter = createSelector(
  [selectViewportPan, selectViewportScale],
  (pan, scale) => ({
    x: -pan.x / scale,
    y: -pan.y / scale,
  })
);

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

export const selectCanUndo = createSelector(
  [selectFloorPlanState],
  (floorPlan) => floorPlan.history.past.length > 0
);

export const selectCanRedo = createSelector(
  [selectFloorPlanState],
  (floorPlan) => floorPlan.history.future.length > 0
);

const selectNumericFloorIds = createSelector([selectFloorsList], (floors) =>
  floors.map((floor) => parseInt(floor.id, 10)).filter((id) => !isNaN(id))
);

export const selectCanDeleteFloor = createSelector([selectNumericFloorIds], (floorIds) =>
  floorIds.some((id) => id !== 1)
);

export const selectCanDeleteAboveGroundFloor = createSelector([selectNumericFloorIds], (floorIds) =>
  floorIds.some((id) => id > 1)
);

export const selectCanDeleteBelowGroundFloor = createSelector([selectNumericFloorIds], (floorIds) =>
  floorIds.some((id) => id < 1)
);

// ---------------------------------------------------------------------------
// Element helpers (active floor)
// ---------------------------------------------------------------------------

export const selectElementsByType = (type: FloorElementType) =>
  createSelector([selectFloorPlanElements], (elements) =>
    elements.filter((el) => el.type === type)
  );

export const selectRoundTables = selectElementsByType('roundTable');
export const selectRectTables = selectElementsByType('rectTable');
export const selectWalls = selectElementsByType('wall');
export const selectWindows = selectElementsByType('window');
export const selectDoors = selectElementsByType('door');
export const selectSeparators = selectElementsByType('separator');

export const selectElementCount = createSelector(
  [selectFloorPlanElements],
  (elements) => elements.length
);

export const selectElementCountByType = createSelector([selectFloorPlanElements], (elements) => {
  return elements.reduce<Record<FloorElementType, number>>(
    (acc, element) => {
      acc[element.type] += 1;
      return acc;
    },
    { roundTable: 0, rectTable: 0, wall: 0, window: 0, door: 0, separator: 0 }
  );
});

export const selectTableElements = createSelector(
  [selectRoundTables, selectRectTables],
  (roundTables, rectTables) => [...roundTables, ...rectTables]
);

import { createSelector } from '@reduxjs/toolkit';

import type { FloorElementType, FloorPlanState } from './types';

type RootStateLike = {
  floorPlan: FloorPlanState;
};

export const selectFloorPlanState = (state: RootStateLike) => state.floorPlan;

export const selectFloorPlanMeta = createSelector(
  [selectFloorPlanState],
  (floorPlan) => floorPlan.meta
);

export const selectFloorPlanElements = createSelector(
  [selectFloorPlanState],
  (floorPlan) => floorPlan.elements
);

export const selectSelectedElementId = createSelector(
  [selectFloorPlanState],
  (floorPlan) => floorPlan.selectedElementId
);

export const selectSelectedElement = createSelector(
  [selectFloorPlanElements, selectSelectedElementId],
  (elements, selectedId) => elements.find((el) => el.id === selectedId) ?? null
);

export const selectViewportScale = createSelector(
  [selectFloorPlanState],
  (floorPlan) => floorPlan.viewportScale
);

export const selectCanUndo = createSelector(
  [selectFloorPlanState],
  (floorPlan) => floorPlan.history.past.length > 0
);

export const selectCanRedo = createSelector(
  [selectFloorPlanState],
  (floorPlan) => floorPlan.history.future.length > 0
);

export const selectElementsByType = (type: FloorElementType) =>
  createSelector([selectFloorPlanElements], (elements) =>
    elements.filter((el) => el.type === type)
  );

export const selectRoundTables = selectElementsByType('roundTable');
export const selectRectTables = selectElementsByType('rectTable');
export const selectWalls = selectElementsByType('wall');

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
    { roundTable: 0, rectTable: 0, wall: 0 }
  );
});

export const selectTableElements = createSelector(
  [selectRoundTables, selectRectTables],
  (roundTables, rectTables) => [...roundTables, ...rectTables]
);

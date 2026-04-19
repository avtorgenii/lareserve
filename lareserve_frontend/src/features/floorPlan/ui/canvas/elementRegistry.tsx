import TableShape from './TableShape';
import WallShape from './WallShape';

import type { FloorElement, FloorElementType } from '../../model/types';
import type { ComponentType } from 'react';

export type ShapeProps<T extends FloorElement> = {
  element: T;
  selected: boolean;
  onSelect: () => void;
};

type ElementRegistry = {
  [K in FloorElementType]: ComponentType<ShapeProps<Extract<FloorElement, { type: K }>>>;
};

export const ELEMENT_REGISTRY: ElementRegistry = {
  roundTable: TableShape,
  rectTable: TableShape,
  wall: WallShape,
};

export const ELEMENT_RENDER_ORDER: Record<FloorElementType, number> = {
  wall: 0,
  roundTable: 1,
  rectTable: 2,
};

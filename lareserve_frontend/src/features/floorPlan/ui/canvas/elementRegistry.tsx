import DoorShape from './DoorShape';
import SeparatorShape from './SeparatorShape';
import TableShape from './TableShape';
import WallShape from './WallShape';
import WindowShape from './WindowShape';

import type { FloorElement, FloorElementType } from '../../model/types';
import type { ComponentType } from 'react';

export type ShapeProps<T extends FloorElement> = {
  element: T;
  selected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
};

type ElementRegistry = {
  [K in FloorElementType]: ComponentType<ShapeProps<Extract<FloorElement, { type: K }>>>;
};

export const ELEMENT_REGISTRY: ElementRegistry = {
  roundTable: TableShape,
  rectTable: TableShape,
  wall: WallShape,
  window: WindowShape,
  door: DoorShape,
  separator: SeparatorShape,
};

export const ELEMENT_RENDER_ORDER: Record<FloorElementType, number> = {
  window: 0,
  door: 0,
  separator: 0,
  wall: 1,
  roundTable: 2,
  rectTable: 3,
};

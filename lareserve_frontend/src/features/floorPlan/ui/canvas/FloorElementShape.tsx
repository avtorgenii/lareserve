import { ELEMENT_REGISTRY } from './elementRegistry';

import type { ShapeProps } from './elementRegistry';
import type { FloorElement } from '../../model/types';

export default function FloorElementShape({
  element,
  selected,
  onSelect,
  onDragEnd,
}: ShapeProps<FloorElement>) {
  const Component = ELEMENT_REGISTRY[element.type];
  return (
    <Component
      element={element as never}
      selected={selected}
      onSelect={onSelect}
      onDragEnd={onDragEnd}
    />
  );
}

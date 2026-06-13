import type { FloorElement } from '../floorPlan/model/types';

export function getElementCapacityLabel(element: FloorElement) {
  if (element.type === 'roundTable') {
    return element.radius >= 60 ? '6 miejsc' : '4 miejsca';
  }

  if (element.type === 'rectTable') {
    return element.width >= 130 ? '6 miejsc' : '4 miejsca';
  }

  if (element.type === 'wall' || element.type === 'separator' || element.type === 'window') {
    return `${Math.round(Math.hypot(element.x2 - element.x, element.y2 - element.y))} px`;
  }

  return `${Math.round(element.width)} px`;
}

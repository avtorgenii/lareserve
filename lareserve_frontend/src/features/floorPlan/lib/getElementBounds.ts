import type { RectTableElement, RoundTableElement } from '../model/types';

export type TableElement = RoundTableElement | RectTableElement;

export type ElementBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

const ROUND_TABLE_RADIUS_PADDING = 24;
const RECT_TABLE_MIN_HALF_WIDTH = 36;
const RECT_TABLE_SIDE_PADDING = 8;
const RECT_TABLE_VERTICAL_PADDING = 26;

export function getElementBounds(element: TableElement): ElementBounds {
  if (element.type === 'roundTable') {
    const radius = element.radius + ROUND_TABLE_RADIUS_PADDING;

    return {
      minX: element.x - radius,
      maxX: element.x + radius,
      minY: element.y - radius,
      maxY: element.y + radius,
    };
  }

  const halfWidth = Math.max(
    RECT_TABLE_MIN_HALF_WIDTH,
    element.width / 2 + RECT_TABLE_SIDE_PADDING
  );
  const halfHeight = element.height / 2 + RECT_TABLE_VERTICAL_PADDING;

  return {
    minX: element.x - halfWidth,
    maxX: element.x + halfWidth,
    minY: element.y - halfHeight,
    maxY: element.y + halfHeight,
  };
}

export function mergeBounds(left: ElementBounds | null, right: ElementBounds): ElementBounds {
  if (!left) {
    return right;
  }

  return {
    minX: Math.min(left.minX, right.minX),
    minY: Math.min(left.minY, right.minY),
    maxX: Math.max(left.maxX, right.maxX),
    maxY: Math.max(left.maxY, right.maxY),
  };
}

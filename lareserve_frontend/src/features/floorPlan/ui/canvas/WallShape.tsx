import { Group, Line } from 'react-konva';

import EndpointHandles from './EndpointHandles';
import { setCursor } from '../../lib/setCursor';
import { snapToGrid } from '../../lib/snapToGrid';

import type { CanvasMode, WallElement } from '../../model/types';

import { useCssVarColors } from '@/shared/lib/useCssVarColors';

type WallThemeColors = {
  stroke: string;
  selectedStroke: string;
};

const WALL_FALLBACK_COLORS: WallThemeColors = {
  stroke: '#878583',
  selectedStroke: '#10b981',
};

const WALL_COLOR_VARS: Record<keyof WallThemeColors, string> = {
  stroke: '--color-text-muted',
  selectedStroke: '--color-primary',
};

type WallShapeProps = {
  element: WallElement;
  selected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  mode?: CanvasMode;
};

export default function WallShape({
  element,
  selected,
  onSelect,
  onDragEnd,
  mode,
}: WallShapeProps) {
  const colors = useCssVarColors(WALL_COLOR_VARS, WALL_FALLBACK_COLORS);
  const isEditing = !mode || mode === 'edit';

  const dx = Number.isFinite(element.x2) ? element.x2 - element.x : 0;
  const dy = Number.isFinite(element.y2) ? element.y2 - element.y : 0;

  return (
    <Group
      draggable={isEditing}
      x={element.x}
      y={element.y}
      onMouseDown={onSelect}
      onTouchStart={onSelect}
      onMouseEnter={(e) => setCursor(e, isEditing ? 'grab' : 'default')}
      onMouseLeave={(e) => setCursor(e, 'default')}
      onDragStart={
        isEditing
          ? (e) => {
              onSelect();
              setCursor(e, 'grabbing');
            }
          : undefined
      }
      onDragEnd={
        isEditing
          ? (e) => {
              const snappedX = snapToGrid(e.target.x());
              const snappedY = snapToGrid(e.target.y());
              e.target.x(snappedX);
              e.target.y(snappedY);
              onDragEnd(snappedX, snappedY);
              setCursor(e, 'grab');
            }
          : undefined
      }
    >
      <Line
        points={[0, 0, dx, dy]}
        stroke={colors.stroke}
        strokeWidth={element.height}
        lineCap="round"
      />

      {selected ? (
        <Line
          points={[0, 0, dx, dy]}
          stroke={colors.selectedStroke}
          strokeWidth={Math.max(2, element.height * 0.2)}
          lineCap="round"
          listening={false}
        />
      ) : null}

      {selected ? (
        <EndpointHandles
          elementId={element.id}
          elementX={element.x}
          elementY={element.y}
          dx={dx}
          dy={dy}
          color={colors.selectedStroke}
          radius={8}
        />
      ) : null}
    </Group>
  );
}

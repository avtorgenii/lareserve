import { Group, Line } from 'react-konva';

import EndpointHandles from './EndpointHandles';
import { setCursor } from '../../lib/setCursor';
import { snapToGrid } from '../../lib/snapToGrid';

import type { CanvasMode, SeparatorElement } from '../../model/types';

import { useCssVarColors } from '@/shared/lib/useCssVarColors';

type SeparatorThemeColors = {
  stroke: string;
  selectedStroke: string;
};

const SEPARATOR_FALLBACK_COLORS: SeparatorThemeColors = {
  stroke: '#b0adab',
  selectedStroke: '#10b981',
};

const SEPARATOR_COLOR_VARS: Record<keyof SeparatorThemeColors, string> = {
  stroke: '--color-border',
  selectedStroke: '--color-primary',
};

type SeparatorShapeProps = {
  element: SeparatorElement;
  selected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  mode?: CanvasMode;
};

export default function SeparatorShape({
  element,
  selected,
  onSelect,
  onDragEnd,
  mode,
}: SeparatorShapeProps) {
  const colors = useCssVarColors(SEPARATOR_COLOR_VARS, SEPARATOR_FALLBACK_COLORS);
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
        lineCap="butt"
      />

      {selected ? (
        <Line
          points={[0, 0, dx, dy]}
          stroke={colors.selectedStroke}
          strokeWidth={Math.max(1.5, element.height * 0.3)}
          lineCap="butt"
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
          radius={7}
        />
      ) : null}
    </Group>
  );
}

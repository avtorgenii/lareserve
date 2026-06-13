import { Arc, Group, Line } from 'react-konva';

import { setCursor } from '../../lib/setCursor';
import { snapToGrid } from '../../lib/snapToGrid';

import type { CanvasMode, DoorElement } from '../../model/types';

import { useCssVarColors } from '@/shared/lib/useCssVarColors';

type DoorThemeColors = {
  stroke: string;
  selectedStroke: string;
};

const DOOR_FALLBACK_COLORS: DoorThemeColors = {
  stroke: '#878583',
  selectedStroke: '#10b981',
};

const DOOR_COLOR_VARS: Record<keyof DoorThemeColors, string> = {
  stroke: '--color-text-muted',
  selectedStroke: '--color-primary',
};

type DoorShapeProps = {
  element: DoorElement;
  selected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  mode?: CanvasMode;
};

export default function DoorShape({
  element,
  selected,
  onSelect,
  onDragEnd,
  mode,
}: DoorShapeProps) {
  const colors = useCssVarColors(DOOR_COLOR_VARS, DOOR_FALLBACK_COLORS);
  const isEditing = !mode || mode === 'edit';

  const strokeColor = selected ? colors.selectedStroke : colors.stroke;

  const handleGroupDragMove = (x: number, y: number) => {
    const snappedX = snapToGrid(x);
    const snappedY = snapToGrid(y);
    return { snappedX, snappedY };
  };

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
      onDragMove={
        isEditing
          ? (e) => {
              const { snappedX, snappedY } = handleGroupDragMove(e.target.x(), e.target.y());
              e.target.x(snappedX);
              e.target.y(snappedY);
            }
          : undefined
      }
      onDragEnd={
        isEditing
          ? (e) => {
              const { snappedX, snappedY } = handleGroupDragMove(e.target.x(), e.target.y());
              e.target.x(snappedX);
              e.target.y(snappedY);
              onDragEnd(snappedX, snappedY);
              setCursor(e, 'grab');
            }
          : undefined
      }
    >
      {/* Door leaf */}
      <Line
        points={[0, 0, element.width, 0]}
        stroke={strokeColor}
        strokeWidth={element.height}
        lineCap="butt"
      />

      {/* Door swing arc — hinge at left, sweeps 90° downward */}
      <Arc
        x={0}
        y={0}
        innerRadius={element.width - 1.5}
        outerRadius={element.width}
        angle={90}
        rotation={0}
        fill={strokeColor}
        listening={false}
      />
    </Group>
  );
}

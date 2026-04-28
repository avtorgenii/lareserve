import { Arc, Group, Line } from 'react-konva';

import { setCursor } from '../../lib/setCursor';

import type { DoorElement } from '../../model/types';

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
};

export default function DoorShape({ element, selected, onSelect, onDragEnd }: DoorShapeProps) {
  const colors = useCssVarColors(DOOR_COLOR_VARS, DOOR_FALLBACK_COLORS);

  const strokeColor = selected ? colors.selectedStroke : colors.stroke;

  return (
    <Group
      draggable
      x={element.x}
      y={element.y}
      onMouseDown={onSelect}
      onTouchStart={onSelect}
      onMouseEnter={(e) => setCursor(e, 'grab')}
      onMouseLeave={(e) => setCursor(e, 'default')}
      onDragStart={(e) => {
        onSelect();
        setCursor(e, 'grabbing');
      }}
      onDragEnd={(e) => {
        onDragEnd(e.target.x(), e.target.y());
        setCursor(e, 'grab');
      }}
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

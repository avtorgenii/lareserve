import { Group, Line } from 'react-konva';

import { snapToGrid } from '../../lib/snapToGrid';
import { setCursor } from '../../lib/setCursor';
import EndpointHandles from './EndpointHandles';

import type { SeparatorElement } from '../../model/types';

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
};

export default function SeparatorShape({
  element,
  selected,
  onSelect,
  onDragEnd,
}: SeparatorShapeProps) {
  const colors = useCssVarColors(SEPARATOR_COLOR_VARS, SEPARATOR_FALLBACK_COLORS);

  const dx = Number.isFinite(element.x2) ? element.x2 - element.x : 0;
  const dy = Number.isFinite(element.y2) ? element.y2 - element.y : 0;

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
        const snappedX = snapToGrid(e.target.x());
        const snappedY = snapToGrid(e.target.y());
        e.target.x(snappedX);
        e.target.y(snappedY);
        onDragEnd(snappedX, snappedY);
        setCursor(e, 'grab');
      }}
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


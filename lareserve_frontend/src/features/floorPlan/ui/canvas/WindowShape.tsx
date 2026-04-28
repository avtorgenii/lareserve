import { Group, Line, Rect } from 'react-konva';

import { snapToGrid } from '../../lib/snapToGrid';
import { setCursor } from '../../lib/setCursor';
import EndpointHandles from './EndpointHandles';

import type { WindowElement } from '../../model/types';

import { useCssVarColors } from '@/shared/lib/useCssVarColors';

type WindowThemeColors = {
  fill: string;
  stroke: string;
  selectedStroke: string;
};

const WINDOW_FALLBACK_COLORS: WindowThemeColors = {
  fill: 'rgba(147, 197, 253, 0.35)',
  stroke: '#60a5fa',
  selectedStroke: '#10b981',
};

const WINDOW_COLOR_VARS: Record<keyof WindowThemeColors, string> = {
  fill: '--color-primary-subtle',
  stroke: '--color-primary-muted',
  selectedStroke: '--color-primary',
};

type WindowShapeProps = {
  element: WindowElement;
  selected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
};

export default function WindowShape({ element, selected, onSelect, onDragEnd }: WindowShapeProps) {
  const colors = useCssVarColors(WINDOW_COLOR_VARS, WINDOW_FALLBACK_COLORS);

  const dx = Number.isFinite(element.x2) ? element.x2 - element.x : 0;
  const dy = Number.isFinite(element.y2) ? element.y2 - element.y : 0;
  const length = Math.hypot(dx, dy);
  const rotation = Math.atan2(dy, dx) * (180 / Math.PI);

  const halfH = element.height / 2;
  const paneCount = Math.max(2, Math.round(length / 35));
  const paneWidth = length / paneCount;

  const strokeColor = selected ? colors.selectedStroke : colors.stroke;

  return (
    <Group
      draggable
      x={element.x}
      y={element.y}
      rotation={rotation}
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
      {/* Window frame */}
      <Rect
        x={0}
        y={-halfH}
        width={length}
        height={element.height}
        fill={colors.fill}
        stroke={strokeColor}
        strokeWidth={selected ? 2 : 1.5}
        cornerRadius={1}
      />

      {/* Pane dividers */}
      {Array.from({ length: paneCount - 1 }, (_, i) => (
        <Line
          key={i}
          points={[(i + 1) * paneWidth, -halfH, (i + 1) * paneWidth, halfH]}
          stroke={strokeColor}
          strokeWidth={1}
          listening={false}
        />
      ))}

      {selected ? (
        <EndpointHandles
          elementId={element.id}
          elementX={element.x}
          elementY={element.y}
          dx={length}
          dy={0}
          rotationDeg={rotation}
          color={colors.selectedStroke}
          radius={7}
        />
      ) : null}
    </Group>
  );
}

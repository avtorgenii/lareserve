import { useEffect, useState } from 'react';
import { Group, Line, Rect } from 'react-konva';

import EndpointHandles from './EndpointHandles';
import { setCursor } from '../../lib/setCursor';
import { snapToGrid } from '../../lib/snapToGrid';

import type { CanvasMode, WindowElement } from '../../model/types';

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
  mode?: CanvasMode;
};

export default function WindowShape({
  element,
  selected,
  onSelect,
  onDragEnd,
  mode,
}: WindowShapeProps) {
  const colors = useCssVarColors(WINDOW_COLOR_VARS, WINDOW_FALLBACK_COLORS);
  const isEditing = !mode || mode === 'edit';
  const [preview, setPreview] = useState<{
    start: { x: number; y: number } | null;
    end: { x: number; y: number } | null;
  }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    if (!selected) {
      setPreview({ start: null, end: null });
    }
  }, [selected]);

  const startX = preview.start?.x ?? element.x;
  const startY = preview.start?.y ?? element.y;
  const endX = preview.end?.x ?? element.x2;
  const endY = preview.end?.y ?? element.y2;

  const dx = Number.isFinite(endX - startX) ? endX - startX : 0;
  const dy = Number.isFinite(endY - startY) ? endY - startY : 0;
  const length = Math.hypot(dx, dy);
  const rotation = Math.atan2(dy, dx) * (180 / Math.PI);

  const halfH = element.height / 2;
  const paneCount = Math.max(2, Math.round(length / 35));
  const paneWidth = length / paneCount;

  const strokeColor = selected ? colors.selectedStroke : colors.stroke;

  const updateEndpointPreview = ({
    endpoint,
    x,
    y,
  }: {
    endpoint: 'start' | 'end';
    x: number;
    y: number;
  }) => {
    setPreview((prev) => ({
      ...prev,
      [endpoint]: prev[endpoint]?.x === x && prev[endpoint]?.y === y ? prev[endpoint] : { x, y },
    }));
  };

  const clearEndpointPreview = () => {
    setPreview({ start: null, end: null });
  };

  const handleGroupDragMove = (x: number, y: number) => {
    const snappedX = snapToGrid(x);
    const snappedY = snapToGrid(y);
    return { snappedX, snappedY };
  };

  return (
    <Group
      draggable={isEditing}
      x={startX}
      y={startY}
      rotation={rotation}
      onMouseDown={onSelect}
      onTouchStart={onSelect}
      onMouseEnter={(e) => setCursor(e, isEditing ? 'grab' : 'default')}
      onMouseLeave={(e) => setCursor(e, 'default')}
      onDragStart={
        isEditing
          ? (e) => {
              onSelect();
              clearEndpointPreview();
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
          elementX={startX}
          elementY={startY}
          dx={length}
          dy={0}
          rotationDeg={rotation}
          color={colors.selectedStroke}
          radius={7}
          onEndpointPreview={updateEndpointPreview}
          onEndpointPreviewEnd={clearEndpointPreview}
        />
      ) : null}
    </Group>
  );
}

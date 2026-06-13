import { useEffect, useState } from 'react';
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
          elementX={startX}
          elementY={startY}
          dx={dx}
          dy={dy}
          color={colors.selectedStroke}
          radius={7}
          onEndpointPreview={updateEndpointPreview}
          onEndpointPreviewEnd={clearEndpointPreview}
        />
      ) : null}
    </Group>
  );
}

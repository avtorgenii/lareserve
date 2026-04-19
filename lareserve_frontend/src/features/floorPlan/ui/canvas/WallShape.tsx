import { Line } from 'react-konva';

import type { WallElement } from '../../model/types';

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
};

export default function WallShape({ element, selected, onSelect }: WallShapeProps) {
  const colors = useCssVarColors(WALL_COLOR_VARS, WALL_FALLBACK_COLORS);

  return (
    <>
      <Line
        points={[element.x, element.y, element.x + element.width, element.y]}
        stroke={colors.stroke}
        strokeWidth={element.height}
        lineCap="round"
        onMouseDown={onSelect}
        onTouchStart={onSelect}
      />

      {selected ? (
        <Line
          points={[element.x, element.y, element.x + element.width, element.y]}
          stroke={colors.selectedStroke}
          strokeWidth={Math.max(2, element.height * 0.2)}
          lineCap="round"
          listening={false}
        />
      ) : null}
    </>
  );
}

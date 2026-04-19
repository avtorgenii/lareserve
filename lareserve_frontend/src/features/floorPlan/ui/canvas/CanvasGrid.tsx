import { Group, Line } from 'react-konva';

import { useCssVarColors } from '@/shared/lib/useCssVarColors';

type GridThemeColors = {
  stroke: string;
};

const GRID_FALLBACK_COLORS: GridThemeColors = {
  stroke: '#9ca3af',
};

const GRID_COLOR_VARS: Record<keyof GridThemeColors, string> = {
  stroke: '--color-border',
};

type CanvasGridProps = {
  spacing?: number;
};

const SIZE = 10000;

export default function CanvasGrid({ spacing = 20 }: CanvasGridProps) {
  const colors = useCssVarColors(GRID_COLOR_VARS, GRID_FALLBACK_COLORS);
  const verticalLineCount = Math.ceil(SIZE / spacing);
  const horizontalLineCount = Math.ceil(SIZE / spacing);

  return (
    <Group x={-SIZE / 2} y={-SIZE / 2}>
      {Array.from({ length: verticalLineCount }).map((_, index) => {
        const x = index * spacing;
        return (
          <Line
            key={`grid-v-${x}`}
            points={[x, 0, x, SIZE]}
            stroke={colors.stroke}
            strokeWidth={1}
            opacity={0.14}
            listening={false}
          />
        );
      })}

      {Array.from({ length: horizontalLineCount }).map((_, index) => {
        const y = index * spacing;
        return (
          <Line
            key={`grid-h-${y}`}
            points={[0, y, SIZE, y]}
            stroke={colors.stroke}
            strokeWidth={1}
            opacity={0.14}
            listening={false}
          />
        );
      })}
    </Group>
  );
}

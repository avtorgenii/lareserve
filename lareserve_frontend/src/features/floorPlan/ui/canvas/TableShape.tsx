import { Circle, Group, Rect, Text } from 'react-konva';

import { setCursor } from '../../lib/setCursor';

import type {
  CanvasMode,
  RectTableElement,
  RoundTableElement,
  TableStatus,
} from '../../model/types';

import { useCssVarColors } from '@/shared/lib/useCssVarColors';

type TableShapeProps = {
  element: RoundTableElement | RectTableElement;
  selected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  mode?: CanvasMode;
  status?: TableStatus;
};

type TableThemeColors = {
  selectedStroke: string;
  defaultStroke: string;
  fill: string;
  text: string;
  selectedText: string;
};

const FALLBACK_COLORS: TableThemeColors = {
  selectedStroke: '#10b981',
  defaultStroke: '#c4c0bb',
  fill: '#f8f8f7',
  text: '#7a7672',
  selectedText: '#0f766e',
};

const TABLE_COLOR_VARS: Record<keyof TableThemeColors, string> = {
  selectedStroke: '--color-primary',
  defaultStroke: '--color-border',
  fill: '--color-surface',
  text: '--color-text-subtle',
  selectedText: '--color-primary-hover',
};

type StatusColors = {
  availableStroke: string;
  availableFill: string;
  availableText: string;
  reservedStroke: string;
  reservedFill: string;
  reservedText: string;
  occupiedStroke: string;
  occupiedFill: string;
  occupiedText: string;
};

const STATUS_COLOR_VARS: Record<keyof StatusColors, string> = {
  availableStroke: '--color-status-available-stroke',
  availableFill: '--color-status-available-fill',
  availableText: '--color-status-available-text',
  reservedStroke: '--color-status-reserved-stroke',
  reservedFill: '--color-status-reserved-fill',
  reservedText: '--color-status-reserved-text',
  occupiedStroke: '--color-status-occupied-stroke',
  occupiedFill: '--color-status-occupied-fill',
  occupiedText: '--color-status-occupied-text',
};

const STATUS_FALLBACK_COLORS: StatusColors = {
  availableStroke: '#a3a3a3',
  availableFill: '#f5f5f5',
  availableText: '#737373',
  reservedStroke: '#10b981',
  reservedFill: '#ecfdf5',
  reservedText: '#065f46',
  occupiedStroke: '#fb7185',
  occupiedFill: '#fff1f2',
  occupiedText: '#9f1239',
};

function renderRoundTable(element: RoundTableElement, selected: boolean, colors: TableThemeColors) {
  const chairWidth = 16;
  const chairHeight = 32;
  const chairDistance = element.radius + 12;

  return (
    <>
      <Circle
        radius={element.radius}
        fill={colors.fill}
        stroke={selected ? colors.selectedStroke : colors.defaultStroke}
        strokeWidth={selected ? 3 : 2}
      />

      <Rect
        x={-chairWidth}
        y={-chairDistance - chairWidth / 2}
        width={chairHeight}
        height={chairWidth}
        cornerRadius={5}
        fill={colors.fill}
        stroke={selected ? colors.selectedStroke : colors.defaultStroke}
        strokeWidth={selected ? 3 : 2}
      />
      <Rect
        x={-chairWidth}
        y={chairDistance - chairWidth / 2}
        width={chairHeight}
        height={chairWidth}
        cornerRadius={5}
        fill={colors.fill}
        stroke={selected ? colors.selectedStroke : colors.defaultStroke}
        strokeWidth={selected ? 3 : 2}
      />
      <Rect
        x={-chairDistance - chairWidth / 2}
        y={-chairWidth}
        width={chairWidth}
        height={chairHeight}
        cornerRadius={5}
        fill={colors.fill}
        stroke={selected ? colors.selectedStroke : colors.defaultStroke}
        strokeWidth={selected ? 3 : 2}
      />
      <Rect
        x={chairDistance - chairWidth / 2}
        y={-chairWidth}
        width={chairWidth}
        height={chairHeight}
        cornerRadius={5}
        fill={colors.fill}
        stroke={selected ? colors.selectedStroke : colors.defaultStroke}
        strokeWidth={selected ? 3 : 2}
      />
    </>
  );
}

function renderRectTable(element: RectTableElement, selected: boolean, colors: TableThemeColors) {
  const chairWidth = 32;
  const chairHeight = 16;
  const chairsPerSide = element.width >= 130 ? 3 : 2;
  const sideStep = element.width / (chairsPerSide + 1);

  return (
    <>
      <Rect
        x={-element.width / 2}
        y={-element.height / 2}
        width={element.width}
        height={element.height}
        cornerRadius={8}
        fill={colors.fill}
        stroke={selected ? colors.selectedStroke : colors.defaultStroke}
        strokeWidth={selected ? 3 : 2}
      />

      {Array.from({ length: chairsPerSide }).map((_, index) => {
        const x = -element.width / 2 + sideStep * (index + 1) - chairWidth / 2;
        return (
          <Rect
            key={`chair-top-${index}`}
            x={x}
            y={-element.height / 2 - chairHeight - 6}
            width={chairWidth}
            height={chairHeight}
            cornerRadius={4}
            fill={colors.fill}
            stroke={selected ? colors.selectedStroke : colors.defaultStroke}
            strokeWidth={selected ? 3 : 2}
          />
        );
      })}

      {Array.from({ length: chairsPerSide }).map((_, index) => {
        const x = -element.width / 2 + sideStep * (index + 1) - chairWidth / 2;
        return (
          <Rect
            key={`chair-bottom-${index}`}
            x={x}
            y={element.height / 2 + 6}
            width={chairWidth}
            height={chairHeight}
            cornerRadius={4}
            fill={colors.fill}
            stroke={selected ? colors.selectedStroke : colors.defaultStroke}
            strokeWidth={selected ? 3 : 2}
          />
        );
      })}
    </>
  );
}

export default function TableShape({
  element,
  selected,
  onSelect,
  onDragEnd,
  mode,
  status,
}: TableShapeProps) {
  const baseColors = useCssVarColors(TABLE_COLOR_VARS, FALLBACK_COLORS);
  const sc = useCssVarColors(STATUS_COLOR_VARS, STATUS_FALLBACK_COLORS);
  const statusOverrides: Record<
    TableStatus,
    Pick<TableThemeColors, 'fill' | 'defaultStroke' | 'selectedStroke' | 'text' | 'selectedText'>
  > = {
    available: {
      fill: sc.availableFill,
      defaultStroke: sc.availableStroke,
      selectedStroke: sc.availableStroke,
      text: sc.availableText,
      selectedText: sc.availableText,
    },
    reserved: {
      fill: sc.reservedFill,
      defaultStroke: sc.reservedStroke,
      selectedStroke: sc.reservedStroke,
      text: sc.reservedText,
      selectedText: sc.reservedText,
    },
    occupied: {
      fill: sc.occupiedFill,
      defaultStroke: sc.occupiedStroke,
      selectedStroke: sc.occupiedStroke,
      text: sc.occupiedText,
      selectedText: sc.occupiedText,
    },
  };
  const colors = status ? { ...baseColors, ...statusOverrides[status] } : baseColors;
  const isEditing = !mode || mode === 'edit';

  return (
    <Group
      draggable={isEditing}
      x={element.x}
      y={element.y}
      onMouseDown={onSelect}
      onTouchStart={onSelect}
      onMouseEnter={(e) => setCursor(e, isEditing ? 'grab' : 'pointer')}
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
              onDragEnd(e.target.x(), e.target.y());
              setCursor(e, 'grab');
            }
          : undefined
      }
    >
      {element.type === 'roundTable' ? renderRoundTable(element, selected, colors) : null}
      {element.type === 'rectTable' ? renderRectTable(element, selected, colors) : null}

      <Text
        text={element.label}
        x={-32}
        y={-10}
        width={64}
        align="center"
        fontSize={16}
        fontStyle="700"
        fill={selected ? colors.selectedText : colors.text}
        listening={false}
      />
    </Group>
  );
}

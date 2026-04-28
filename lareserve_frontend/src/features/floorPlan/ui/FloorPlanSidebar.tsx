'use client';

import {
  addRectTable,
  addRoundTable,
  duplicateElement,
  addWall,
  addWindow,
  addDoor,
  addSeparator,
  removeElement,
} from '../model/floorPlanSlice';
import { selectSelectedElement, selectViewportCenter } from '../model/selectors';

import type { FloorElement } from '../model/types';

import { Button, Panel, SectionLabel } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

type PaletteItem = {
  id: string;
  label: string;
  onClick: () => void;
};

type PaletteSectionProps = {
  title: string;
  items: PaletteItem[];
};

function getElementTypeLabel(element: FloorElement) {
  switch (element.type) {
    case 'roundTable':
      return 'Okragly stol';
    case 'rectTable':
      return 'Kwadratowy stol';
    case 'wall':
      return 'Sciana';
    case 'window':
      return 'Okno';
    case 'door':
      return 'Drzwi';
    case 'separator':
      return 'Separator';
    default:
      return 'Element';
  }
}

function getElementCapacityLabel(element: FloorElement) {
  if (element.type === 'roundTable') {
    return element.radius >= 60 ? '6 miejsc' : '4 miejsca';
  }

  if (element.type === 'rectTable') {
    return element.width >= 130 ? '4-6 miejsc' : '4 miejsca';
  }

  if (element.type === 'wall' || element.type === 'separator' || element.type === 'window') {
    return `${Math.round(Math.hypot(element.x2 - element.x, element.y2 - element.y))} px`;
  }

  return `${Math.round(element.width)} px`;
}

function PaletteSection({ title, items }: PaletteSectionProps) {
  return (
    <section className="space-y-2">
      <SectionLabel className="px-2">{title}</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <Button
            key={item.id}
            variant="secondary"
            size="sm"
            className="h-auto justify-start rounded-lg p-2 text-left text-xs font-normal text-text-subtle hover:border-border-hover hover:text-text"
            onClick={item.onClick}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </section>
  );
}

export default function FloorPlanSidebar() {
  const dispatch = useAppDispatch();
  const selectedElement = useAppSelector(selectSelectedElement);
  const center = useAppSelector(selectViewportCenter);

  const tableItems: PaletteItem[] = [
    {
      id: 'round-4',
      label: 'Okragly - 4 miejsca',
      onClick: () => dispatch(addRoundTable({ x: center.x, y: center.y, radius: 52 })),
    },
    {
      id: 'round-6',
      label: 'Okragly - 6 miejsc',
      onClick: () => dispatch(addRoundTable({ x: center.x, y: center.y, radius: 64 })),
    },
    {
      id: 'rect-4',
      label: 'Kwadrat - 4 miejsca',
      onClick: () => dispatch(addRectTable({ x: center.x, y: center.y, width: 118, height: 70 })),
    },
    {
      id: 'rect-46',
      label: 'Kwadrat - 4-6 miejsc',
      onClick: () => dispatch(addRectTable({ x: center.x, y: center.y, width: 144, height: 82 })),
    },
  ];

  const buildingItems: PaletteItem[] = [
    {
      id: 'wall',
      label: 'Sciana',
      onClick: () =>
        dispatch(addWall({ x: center.x - 110, y: center.y, x2: center.x + 110, y2: center.y, height: 20 })),
    },
    {
      id: 'window',
      label: 'Okno',
      onClick: () =>
        dispatch(addWindow({ x: center.x - 70, y: center.y, x2: center.x + 70, y2: center.y, height: 12 })),
    },
    {
      id: 'door',
      label: 'Drzwi',
      onClick: () => dispatch(addDoor({ x: center.x - 50, y: center.y, width: 100, height: 12 })),
    },
    {
      id: 'divider',
      label: 'Separator',
      onClick: () =>
        dispatch(addSeparator({ x: center.x - 60, y: center.y, x2: center.x + 60, y2: center.y, height: 8 })),
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <PaletteSection title="Stoly" items={tableItems} />
      <PaletteSection title="Budowa" items={buildingItems} />

      <Panel tone="subtle" className="mt-auto space-y-2">
        <SectionLabel>Wybrany element</SectionLabel>

        {selectedElement ? (
          <>
            <p className="text-sm font-semibold text-text">{selectedElement.label}</p>
            <p className="text-sm text-text-subtle">Typ: {getElementTypeLabel(selectedElement)}</p>
            <p className="text-sm text-text-subtle">
              {selectedElement.type === 'wall' ? 'Dlugosc' : 'Pojemnosc'}:{' '}
              {getElementCapacityLabel(selectedElement)}
            </p>
          </>
        ) : (
          <p className="text-sm text-text-muted">
            Kliknij element na planie, aby zobaczyc szczegoly.
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="px-2 text-xs"
            disabled={!selectedElement}
            onClick={() => {
              if (!selectedElement) return;
              dispatch(duplicateElement(selectedElement.id));
            }}
          >
            Duplikuj
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="px-2 text-xs"
            disabled={!selectedElement}
            onClick={() => {
              if (!selectedElement) return;
              dispatch(removeElement(selectedElement.id));
            }}
          >
            Usun
          </Button>
        </div>
      </Panel>
    </div>
  );
}

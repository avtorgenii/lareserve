'use client';

import Link from 'next/link';

import {
  createBelowGroundFloor,
  createFloor,
  deleteLeftmostFloor,
  deleteRightmostFloor,
  redoFloorPlan,
  saveFloorPlanRequested,
  setActiveFloor,
  undoFloorPlan,
} from '../model/floorPlanSlice';
import {
  selectActiveFloorId,
  selectCanDeleteAboveGroundFloor,
  selectCanDeleteBelowGroundFloor,
  selectCanRedo,
  selectCanUndo,
  selectFloorsList,
} from '../model/selectors';
import FloorSelector from './shared/FloorSelector';

import { Button, IconButton } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function FloorPlanTopBar() {
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
  const canDeleteBelowGroundFloor = useAppSelector(selectCanDeleteBelowGroundFloor);
  const canDeleteAboveGroundFloor = useAppSelector(selectCanDeleteAboveGroundFloor);
  const floors = useAppSelector(selectFloorsList);
  const activeFloorId = useAppSelector(selectActiveFloorId);

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
          R
        </div>
        <p className="text-sm font-semibold text-text">Restauracja</p>
        <p className="text-sm text-text-muted">- Edytor</p>
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          size="md"
          aria-label="Dodaj poziom podziemny"
          title="Dodaj poziom podziemny"
          className="text-base leading-none"
          onClick={() => dispatch(createBelowGroundFloor())}
        >
          +
        </IconButton>
        {canDeleteBelowGroundFloor ? (
          <IconButton
            size="md"
            aria-label="Usuń najniższy poziom podziemny"
            title="Usuń najniższy poziom podziemny"
            className="text-base leading-none"
            onClick={() => dispatch(deleteLeftmostFloor())}
          >
            -
          </IconButton>
        ) : null}
        <FloorSelector
          floors={floors.map((f) => ({ id: f.id, label: f.name }))}
          activeFloorId={activeFloorId}
          onChange={(id) => dispatch(setActiveFloor(id))}
          variant="tabs"
        />
        <IconButton
          size="md"
          aria-label="Dodaj poziom nadziemny"
          title="Dodaj poziom nadziemny"
          className="text-base leading-none"
          onClick={() => dispatch(createFloor())}
        >
          +
        </IconButton>
        {canDeleteAboveGroundFloor ? (
          <IconButton
            size="md"
            aria-label="Usuń najwyższy poziom nadziemny"
            title="Usuń najwyższy poziom nadziemny"
            className="text-base leading-none"
            onClick={() => dispatch(deleteRightmostFloor())}
          >
            -
          </IconButton>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Link href="/staff">
          <IconButton
            size="md"
            aria-label="Wróć do strony personelu"
            title="Wróć do strony personelu"
          >
            ↩
          </IconButton>
        </Link>
        <Button size="sm" disabled={!canUndo} onClick={() => dispatch(undoFloorPlan())}>
          Undo
        </Button>
        <Button size="sm" disabled={!canRedo} onClick={() => dispatch(redoFloorPlan())}>
          Redo
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            dispatch(saveFloorPlanRequested());
          }}
        >
          Zapisz
        </Button>
      </div>
    </header>
  );
}

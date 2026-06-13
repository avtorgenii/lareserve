'use client';

import {
  createFloor,
  redoFloorPlan,
  saveFloorPlanRequested,
  setActiveFloor,
  undoFloorPlan,
} from '../model/floorPlanSlice';
import { selectActiveFloorId, selectCanRedo, selectCanUndo, selectFloorsList } from '../model/selectors';
import FloorSelector from './shared/FloorSelector';

import { Button, IconButton } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Link from 'next/link';

export default function FloorPlanTopBar() {
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
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
        <FloorSelector
          floors={floors.map((f) => ({ id: f.id, label: f.name }))}
          activeFloorId={activeFloorId}
          onChange={(id) => dispatch(setActiveFloor(id))}
          variant="tabs"
        />
        <IconButton
          size="md"
          aria-label="Dodaj piętro"
          className="text-base leading-none"
          onClick={() => dispatch(createFloor())}
        >
          +
        </IconButton>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/staff">
          <IconButton size="md" aria-label="Wróć do strony personelu" title="Wróć do strony personelu">
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
          {'Zapisz'}
        </Button>
      </div>
    </header>
  );
}

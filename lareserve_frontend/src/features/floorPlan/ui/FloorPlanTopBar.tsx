'use client';

import { useState } from 'react';

import { redoFloorPlan, saveFloorPlanRequested, undoFloorPlan } from '../model/floorPlanSlice';
import { selectCanRedo, selectCanUndo } from '../model/selectors';

import { Button, IconButton } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function FloorPlanTopBar() {
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
  const [saveTick, setSaveTick] = useState(0);

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
        <Button size="sm">Parter</Button>
        <Button size="sm" className="bg-surface-subtle text-text-subtle">
          Pietro 1
        </Button>
        <IconButton size="md" aria-label="Dodaj pietro" className="text-base leading-none">
          +
        </IconButton>
      </div>

      <div className="flex items-center gap-2">
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
            setSaveTick((value) => value + 1);
          }}
        >
          {saveTick > 0 ? 'Zapisz ponownie' : 'Zapisz'}
        </Button>
      </div>
    </header>
  );
}

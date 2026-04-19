'use client';

import { zoomIn, zoomOut } from '../model/floorPlanSlice';
import { selectViewportScale } from '../model/selectors';
import { MAX_VIEWPORT_SCALE, MIN_VIEWPORT_SCALE } from '../model/viewport';

import { IconButton } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function FloorPlanBottomBar() {
  const dispatch = useAppDispatch();
  const viewportScale = useAppSelector(selectViewportScale);
  const zoomPercent = Math.round(viewportScale * 100);

  return (
    <footer className="flex h-10 items-center justify-between border-t border-border bg-surface px-4">
      <p className="text-xs text-text-muted">
        Przesun element z panelu bocznego - kliknij aby wybrac - Del aby usunac
      </p>

      <div className="flex items-center gap-2">
        <IconButton
          size="sm"
          aria-label="Oddal"
          onClick={() => dispatch(zoomOut())}
          disabled={viewportScale <= MIN_VIEWPORT_SCALE}
        >
          -
        </IconButton>
        <span className="rounded border border-border bg-surface px-2 py-0.5 text-xs text-text-subtle">
          {zoomPercent}%
        </span>
        <IconButton
          size="sm"
          aria-label="Przybliz"
          onClick={() => dispatch(zoomIn())}
          disabled={viewportScale >= MAX_VIEWPORT_SCALE}
        >
          +
        </IconButton>
      </div>
    </footer>
  );
}

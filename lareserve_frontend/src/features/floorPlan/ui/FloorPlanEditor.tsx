'use client';

import { useEffect } from 'react';

import FloorPlanBottomBar from './FloorPlanBottomBar';
import FloorPlanCanvas from './FloorPlanCanvas';
import FloorPlanSidebar from './FloorPlanSidebar';
import FloorPlanTopBar from './FloorPlanTopBar';
import { removeElement } from '../model/floorPlanSlice';
import { selectSelectedElementId } from '../model/selectors';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function FloorPlanEditor() {
  const dispatch = useAppDispatch();
  const selectedElementId = useAppSelector(selectSelectedElementId);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedElementId || event.key !== 'Delete') return;

      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if (isTypingTarget) return;

      dispatch(removeElement(selectedElementId));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, selectedElementId]);

  return (
    <main className="flex min-h-screen flex-col bg-neutral-100">
      <FloorPlanTopBar />

      <section className="flex min-h-0 flex-1">
        <aside className="w-60 border-r border-neutral-200 bg-white">
          <FloorPlanSidebar />
        </aside>

        <div className="min-w-0 flex-1">
          <FloorPlanCanvas />
        </div>
      </section>

      <FloorPlanBottomBar />
    </main>
  );
}

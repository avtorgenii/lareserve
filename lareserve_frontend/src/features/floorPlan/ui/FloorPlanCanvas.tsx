'use client';

import { useMemo, useRef, useState } from 'react';
import { Group, Layer, Stage } from 'react-konva';

import useViewTransform from '../lib/useViewTransform';
import { clearSelection, moveElement, selectElement, setPan } from '../model/floorPlanSlice';
import {
  selectFloorPlanElements,
  selectSelectedElementId,
  selectViewportPan,
  selectViewportScale,
} from '../model/selectors';
import CanvasGrid from './canvas/CanvasGrid';
import { ELEMENT_RENDER_ORDER } from './canvas/elementRegistry';
import FloorElementShape from './canvas/FloorElementShape';

import type { KonvaEventObject } from 'konva/lib/Node';

import useContainerSize from '@/shared/lib/useContainerSize';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function FloorPlanCanvas() {
  const dispatch = useAppDispatch();
  const elements = useAppSelector(selectFloorPlanElements);
  const selectedElementId = useAppSelector(selectSelectedElementId);
  const viewportScale = useAppSelector(selectViewportScale);
  const storedPan = useAppSelector(selectViewportPan);

  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);

  const panStartPos = useRef<{ pointerX: number; pointerY: number } | null>(null);
  const [liveDelta, setLiveDelta] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const effectivePan = useMemo(
    () => ({ x: storedPan.x + liveDelta.x, y: storedPan.y + liveDelta.y }),
    [storedPan, liveDelta]
  );

  const viewTransform = useViewTransform(size, viewportScale, effectivePan);

  const orderedElements = useMemo(
    () => [...elements].sort((a, b) => ELEMENT_RENDER_ORDER[a.type] - ELEMENT_RENDER_ORDER[b.type]),
    [elements]
  );

  const getPointerPos = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = event.target.getStage();
    return stage ? stage.getPointerPosition() : null;
  };

  const handleStagePointerDown = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (event.target !== event.target.getStage()) return;
    dispatch(clearSelection());
    const pos = getPointerPos(event);
    if (!pos) return;
    panStartPos.current = { pointerX: pos.x, pointerY: pos.y };
    setIsPanning(true);
  };

  const handleStagePointerMove = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!panStartPos.current) return;
    const pos = getPointerPos(event);
    if (!pos) return;
    setLiveDelta({
      x: pos.x - panStartPos.current.pointerX,
      y: pos.y - panStartPos.current.pointerY,
    });
  };

  const handleStagePointerUp = () => {
    if (!panStartPos.current) return;
    dispatch(setPan(effectivePan));
    panStartPos.current = null;
    setLiveDelta({ x: 0, y: 0 });
    setIsPanning(false);
  };

  return (
    <section className="h-full bg-surface-subtle p-4">
      <div
        ref={containerRef}
        className="h-full w-full overflow-hidden rounded-lg border border-border bg-surface"
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        {size.width > 0 && size.height > 0 && (
          <Stage
            width={size.width}
            height={size.height}
            onMouseDown={handleStagePointerDown}
            onTouchStart={handleStagePointerDown}
            onMouseMove={handleStagePointerMove}
            onTouchMove={handleStagePointerMove}
            onMouseUp={handleStagePointerUp}
            onTouchEnd={handleStagePointerUp}
          >
            <Layer>
              <Group
                x={viewTransform.x}
                y={viewTransform.y}
                scaleX={viewTransform.scale}
                scaleY={viewTransform.scale}
              >
                <CanvasGrid />
                {orderedElements.map((element) => (
                  <FloorElementShape
                    key={element.id}
                    element={element}
                    selected={selectedElementId === element.id}
                    onSelect={() => dispatch(selectElement(element.id))}
                    onDragEnd={(x, y) => dispatch(moveElement({ id: element.id, x, y }))}
                  />
                ))}
              </Group>
            </Layer>
          </Stage>
        )}
      </div>
    </section>
  );
}

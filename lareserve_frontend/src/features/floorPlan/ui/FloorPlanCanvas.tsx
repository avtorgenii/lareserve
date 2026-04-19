'use client';

import { useMemo, useRef } from 'react';
import { Group, Layer, Stage } from 'react-konva';

import useViewTransform from '../lib/useViewTransform';
import { clearSelection, selectElement } from '../model/floorPlanSlice';
import {
  selectFloorPlanElements,
  selectSelectedElementId,
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

  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);
  const viewTransform = useViewTransform(size, viewportScale);

  const orderedElements = useMemo(
    () => [...elements].sort((a, b) => ELEMENT_RENDER_ORDER[a.type] - ELEMENT_RENDER_ORDER[b.type]),
    [elements]
  );

  const handleStagePointerDown = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (event.target === event.target.getStage()) dispatch(clearSelection());
  };

  return (
    <section className="h-full bg-surface-subtle p-4">
      <div
        ref={containerRef}
        className="h-full w-full overflow-hidden rounded-lg border border-border bg-surface"
      >
        {size.width > 0 && size.height > 0 && (
          <Stage
            width={size.width}
            height={size.height}
            onMouseDown={handleStagePointerDown}
            onTouchStart={handleStagePointerDown}
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

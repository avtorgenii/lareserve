import { Circle } from 'react-konva';

import { snapToGrid } from '../../lib/snapToGrid';
import { moveWallEndpoint } from '../../model/floorPlanSlice';

import type { KonvaEventObject } from 'konva/lib/Node';

import { useAppDispatch } from '@/store/hooks';

type EndpointHandlesProps = {
  elementId: string;
  elementX: number;
  elementY: number;
  /** End-handle local x in the parent Group's coordinate space. */
  dx: number;
  /** End-handle local y in the parent Group's coordinate space. */
  dy: number;
  /**
   * Parent Group's rotation in degrees (default 0).
   * Required when the Group has a non-zero Konva `rotation` prop so that
   * dragged circle positions can be mapped back to floor-plan coordinates.
   */
  rotationDeg?: number;
  color: string;
  radius: number;
  onEndpointPreview?: (payload: { endpoint: 'start' | 'end'; x: number; y: number }) => void;
  onEndpointPreviewEnd?: () => void;
};

export default function EndpointHandles({
  elementId,
  elementX,
  elementY,
  dx,
  dy,
  rotationDeg = 0,
  color,
  radius,
  onEndpointPreview,
  onEndpointPreviewEnd,
}: EndpointHandlesProps) {
  const dispatch = useAppDispatch();

  const rad = (rotationDeg * Math.PI) / 180;
  const cosR = Math.cos(rad);
  const sinR = Math.sin(rad);

  const toWorld = (lx: number, ly: number) => ({
    x: elementX + lx * cosR - ly * sinR,
    y: elementY + lx * sinR + ly * cosR,
  });

  const toLocal = (wx: number, wy: number) => {
    const relX = wx - elementX;
    const relY = wy - elementY;
    return {
      x: relX * cosR + relY * sinR,
      y: -relX * sinR + relY * cosR,
    };
  };

  const handleEndpointDragMove = (endpoint: 'start' | 'end', e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    const circle = e.target;
    const world = toWorld(circle.x(), circle.y());
    const snappedX = snapToGrid(world.x);
    const snappedY = snapToGrid(world.y);
    const local = toLocal(snappedX, snappedY);

    if (circle.x() !== local.x || circle.y() !== local.y) {
      circle.x(local.x);
      circle.y(local.y);
    }

    onEndpointPreview?.({
      endpoint,
      x: snappedX,
      y: snappedY,
    });
  };

  const handleEndpointDragEnd = (endpoint: 'start' | 'end', e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    const circle = e.target;
    const world = toWorld(circle.x(), circle.y());
    const snappedX = snapToGrid(world.x);
    const snappedY = snapToGrid(world.y);

    // Reset the Konva node's position before dispatching so react-konva does not
    // skip the update when the prop value is unchanged (start stays at 0/0).
    circle.x(endpoint === 'start' ? 0 : dx);
    circle.y(endpoint === 'start' ? 0 : dy);

    dispatch(
      moveWallEndpoint({
        id: elementId,
        endpoint,
        x: snappedX,
        y: snappedY,
      })
    );

    onEndpointPreviewEnd?.();
  };

  return (
    <>
      <Circle
        x={0}
        y={0}
        radius={radius}
        fill={color}
        draggable
        onMouseDown={(e) => {
          e.cancelBubble = true;
        }}
        onDragMove={(e) => handleEndpointDragMove('start', e)}
        onDragEnd={(e) => handleEndpointDragEnd('start', e)}
      />
      <Circle
        x={dx}
        y={dy}
        radius={radius}
        fill={color}
        draggable
        onMouseDown={(e) => {
          e.cancelBubble = true;
        }}
        onDragMove={(e) => handleEndpointDragMove('end', e)}
        onDragEnd={(e) => handleEndpointDragEnd('end', e)}
      />
    </>
  );
}

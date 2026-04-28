import { Circle } from 'react-konva';

import { moveWallEndpoint } from '../../model/floorPlanSlice';
import { snapToGrid } from '../../lib/snapToGrid';
import { useAppDispatch } from '@/store/hooks';

import type { KonvaEventObject } from 'konva/lib/Node';

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
}: EndpointHandlesProps) {
  const dispatch = useAppDispatch();

  const handleEndpointDragEnd = (
    endpoint: 'start' | 'end',
    e: KonvaEventObject<MouseEvent>
  ) => {
    e.cancelBubble = true;
    const circle = e.target;
    const lx = circle.x();
    const ly = circle.y();

    // Transform from the parent Group's local (possibly rotated) space back to
    // floor-plan world space: world = groupOrigin + R(rotationDeg) * [lx, ly]
    const rad = (rotationDeg * Math.PI) / 180;
    const cosR = Math.cos(rad);
    const sinR = Math.sin(rad);
    const rawX = elementX + lx * cosR - ly * sinR;
    const rawY = elementY + lx * sinR + ly * cosR;

    // Reset the Konva node's position before dispatching so react-konva does not
    // skip the update when the prop value is unchanged (start stays at 0/0).
    circle.x(endpoint === 'start' ? 0 : dx);
    circle.y(endpoint === 'start' ? 0 : dy);

    dispatch(
      moveWallEndpoint({
        id: elementId,
        endpoint,
        x: snapToGrid(rawX),
        y: snapToGrid(rawY),
      })
    );
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
        onDragEnd={(e) => handleEndpointDragEnd('end', e)}
      />
    </>
  );
}

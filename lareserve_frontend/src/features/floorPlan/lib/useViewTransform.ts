import { useMemo } from 'react';

type Size = {
  width: number;
  height: number;
};

type Pan = {
  x: number;
  y: number;
};

type ViewTransform = {
  x: number;
  y: number;
  scale: number;
};

/**
 * Returns the Konva Stage transform so that canvas origin (0, 0) sits at the
 * centre of the container and the scale equals the user-controlled viewportScale
 * directly (1.0 = 100%).  Pan offsets the origin from the centre.
 */
export default function useViewTransform(
  size: Size,
  viewportScale: number,
  pan: Pan
): ViewTransform {
  return useMemo(
    () => ({
      x: size.width / 2 + pan.x,
      y: size.height / 2 + pan.y,
      scale: viewportScale,
    }),
    [size.width, size.height, viewportScale, pan.x, pan.y]
  );
}

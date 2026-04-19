import { useMemo } from 'react';

type Size = {
  width: number;
  height: number;
};

type ViewTransform = {
  x: number;
  y: number;
  scale: number;
};

/**
 * Returns the Konva Stage transform so that canvas origin (0, 0) sits at the
 * centre of the container and the scale equals the user-controlled viewportScale
 * directly (1.0 = 100%).  No auto-fit is applied — the view is stable when
 * elements are added or removed.
 */
export default function useViewTransform(size: Size, viewportScale: number): ViewTransform {
  return useMemo(
    () => ({
      x: size.width / 2,
      y: size.height / 2,
      scale: viewportScale,
    }),
    [size.width, size.height, viewportScale]
  );
}

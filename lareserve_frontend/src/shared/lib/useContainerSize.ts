import { useEffect, useState } from 'react';

import type { RefObject } from 'react';

type Size = {
  width: number;
  height: number;
};

export default function useContainerSize(containerRef: RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setSize({
        width: Math.max(320, Math.floor(container.clientWidth)),
        height: Math.max(240, Math.floor(container.clientHeight)),
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  return size;
}

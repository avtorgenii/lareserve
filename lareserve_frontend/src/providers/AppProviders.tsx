'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';

import type React from 'react';

import { hydrateFloorPlan } from '@/features/floorPlan/model/floorPlanSlice';
import { DEFAULT_VIEWPORT_SCALE } from '@/features/floorPlan/model/types';
import { loadFloorPlanFromApi } from '@/features/floorPlan/persistence/httpRepo';
import { RESTAURANT_ID } from '@/shared/lib/constants';
import { useAppStore } from '@/store/hooks';
import { store } from '@/store/store';

type Props = {
  children: React.ReactNode;
};

function FloorPlanHydrator() {
  const appStore = useAppStore();

  useEffect(() => {
    loadFloorPlanFromApi(RESTAURANT_ID)
      .then((elements) => {
        if (elements.length > 0) {
          appStore.dispatch(
            hydrateFloorPlan({
              meta: {
                id: 'default-floor',
                name: 'Main Hall',
                updatedAt: new Date().toISOString(),
              },
              elements,
              selectedElementId: null,
              viewportScale: DEFAULT_VIEWPORT_SCALE,
              viewportPan: { x: 0, y: 0 },
            })
          );
        }
      })
      .catch((error) => {
        console.error('[FloorPlan] API load failed:', error);
      });
  }, [appStore]);

  return null;
}

export default function AppProviders({ children }: Props) {
  return (
    <Provider store={store}>
      <FloorPlanHydrator />
      {children}
    </Provider>
  );
}

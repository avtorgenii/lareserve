'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

import type React from 'react';

import { hydrateFloorPlan } from '@/features/floorPlan/model/floorPlanSlice';
import { DEFAULT_VIEWPORT_SCALE } from '@/features/floorPlan/model/types';
import { loadFloorPlanFromApi } from '@/features/floorPlan/persistence/httpRepo';
import { loadFloorPlanFromLocalStorage } from '@/features/floorPlan/persistence/localStorageRepo';
import { RESTAURANT_ID } from '@/shared/lib/constants';
import { useAppStore } from '@/store/hooks';
import { store } from '@/store/store';

type Props = {
  children: React.ReactNode;
};

function FloorPlanHydrator() {
  const appStore = useAppStore();

  useEffect(() => {
    // 1. Hydrate immediately from localStorage (fast, no network)
    const savedLocally = loadFloorPlanFromLocalStorage();
    if (savedLocally) {
      appStore.dispatch(hydrateFloorPlan(savedLocally));
    }

    // 2. Load from API (authoritative — overrides local data if elements are present)
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
              viewportScale: savedLocally?.viewportScale ?? DEFAULT_VIEWPORT_SCALE,
              viewportPan: savedLocally?.viewportPan ?? { x: 0, y: 0 },
            })
          );
        }
      })
      .catch((error) => {
        console.error('[FloorPlan] API load failed, using local data:', error);
      });
  }, [appStore]);

  return null;
}

export default function AppProviders({ children }: Props) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <Provider store={store}>
        <FloorPlanHydrator />
        {children}
      </Provider>
    </GoogleOAuthProvider>
  );
}

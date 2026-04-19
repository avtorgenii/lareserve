'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';

import type React from 'react';

import { hydrateFloorPlan } from '@/features/floorPlan/model/floorPlanSlice';
import { loadFloorPlanFromLocalStorage } from '@/features/floorPlan/persistence/localStorageRepo';
import { useAppStore } from '@/store/hooks';
import { store } from '@/store/store';

type Props = {
  children: React.ReactNode;
};

function FloorPlanHydrator() {
  const appStore = useAppStore();

  useEffect(() => {
    const savedFloorPlan = loadFloorPlanFromLocalStorage();
    if (!savedFloorPlan) return;

    appStore.dispatch(hydrateFloorPlan(savedFloorPlan));
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

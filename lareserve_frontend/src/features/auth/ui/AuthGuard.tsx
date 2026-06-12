'use client';

import { useEffect, useState } from 'react';

import { tokenStorage } from '../model/tokenStorage';
import { AuthActionButton } from './GoogleSignInButton';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    setStatus(tokenStorage.get() !== null ? 'authenticated' : 'unauthenticated');
  }, []);

  if (status === 'loading') return null;

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border border-border p-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-base font-bold text-white">
            R
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-text">Restauracja</h1>
            <p className="mt-1 text-sm text-text-muted">Zaloguj się, aby kontynuować</p>
          </div>
          <AuthActionButton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

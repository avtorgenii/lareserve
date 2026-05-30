'use client';

import { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

import { signInWithGoogle } from '../model/authApi';
import { tokenStorage } from '../model/tokenStorage';

export function GoogleSignInButton() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    setIsSignedIn(tokenStorage.get() !== null);
  }, []);

  const login = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      const key = await signInWithGoogle(access_token);
      tokenStorage.set(key);
      window.location.reload();
    },
    onError: (error) => console.error('[Auth] Google login failed', error),
  });

  if (isSignedIn) {
    return (
      <button
        onClick={() => {
          tokenStorage.clear();
          window.location.reload();
        }}
        className="text-sm text-text-muted hover:text-text transition-colors"
      >
        Wyloguj
      </button>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="text-sm text-text-muted hover:text-text transition-colors"
    >
      Zaloguj
    </button>
  );
}

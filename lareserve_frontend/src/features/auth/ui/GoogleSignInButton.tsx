'use client';

import { useEffect, useState } from 'react';

import { signInWithCredentials, signOut } from '../model/authApi';
import { tokenStorage } from '../model/tokenStorage';

export function AuthActionButton() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsSignedIn(tokenStorage.get() !== null);
  }, []);

  if (isSignedIn) {
    return (
      <button
        onClick={async () => {
          setIsSubmitting(true);
          setErrorMessage(null);
          try {
            await signOut();
          } catch (error) {
            console.error('[Auth] Logout failed', error);
          } finally {
            setIsSubmitting(false);
          }
          tokenStorage.clear();
          window.location.reload();
        }}
        disabled={isSubmitting}
        className="text-sm text-text-muted hover:text-text transition-colors"
      >
        Wyloguj
      </button>
    );
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (!identifier || !password) {
          setErrorMessage('Podaj login i haslo.');
          return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        try {
          const token = await signInWithCredentials(identifier.trim(), password);
          tokenStorage.set(token);
          window.location.reload();
        } catch (error) {
          console.error('[Auth] Login failed', error);
          setErrorMessage('Niepoprawne dane logowania.');
        } finally {
          setIsSubmitting(false);
        }
      }}
      className="flex w-full max-w-sm flex-col gap-2"
    >
      <input
        type="text"
        value={identifier}
        onChange={(event) => setIdentifier(event.target.value)}
        placeholder="Login lub email"
        autoComplete="username"
        className="h-10 rounded-lg border border-border px-3 text-sm text-text outline-none transition-colors focus:border-primary"
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Haslo"
        autoComplete="current-password"
        className="h-10 rounded-lg border border-border px-3 text-sm text-text outline-none transition-colors focus:border-primary"
      />
      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-10 rounded-lg bg-primary text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Logowanie...' : 'Zaloguj'}
      </button>
    </form>
  );
}

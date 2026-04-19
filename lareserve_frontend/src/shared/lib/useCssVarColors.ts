import { useEffect, useState } from 'react';

type ColorMap = Record<string, string>;

function readCssVariable(variableName: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  return value || fallback;
}

function resolveCssVarMap<T extends ColorMap>(
  variableMap: Record<keyof T, string>,
  fallbacks: T
): T {
  const resolved = {} as T;

  (Object.keys(variableMap) as Array<keyof T>).forEach((key) => {
    resolved[key] = readCssVariable(variableMap[key], fallbacks[key]) as T[keyof T];
  });

  return resolved;
}

export function useCssVarColors<T extends ColorMap>(
  variableMap: Record<keyof T, string>,
  fallbacks: T
): T {
  const [colors, setColors] = useState<T>(fallbacks);

  useEffect(() => {
    const sync = () => setColors(resolveCssVarMap(variableMap, fallbacks));
    sync();

    if (typeof window === 'undefined') return;
  }, [variableMap, fallbacks]);

  return colors;
}

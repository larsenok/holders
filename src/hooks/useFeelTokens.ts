import { useState } from 'react';

let globalTokens = 1000;
const listeners: ((val: number) => void)[] = [];

export function useFeelTokens(): [number, (val: number) => void] {
  const [tokens, setTokens] = useState(globalTokens);

  const updateTokens = (val: number) => {
    globalTokens = val;
    listeners.forEach(fn => fn(val));
  };

  // Sync this hook’s state when tokens change elsewhere
  if (!listeners.includes(setTokens)) {
    listeners.push(setTokens);
  }

  return [tokens, updateTokens];
}

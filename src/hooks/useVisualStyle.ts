import { useCallback, useSyncExternalStore } from 'react';

export type VisualStyle = 'a' | 'b' | 'c' | 'd';

const STORAGE_KEY = 'visual_style_variant';
const VALID_STYLES: VisualStyle[] = ['a', 'b', 'c', 'd'];

type VisualStyleListener = () => void;

function normalizeStyle(value: string | null): VisualStyle {
  return VALID_STYLES.includes(value as VisualStyle) ? (value as VisualStyle) : 'a';
}

let currentStyle: VisualStyle = normalizeStyle(localStorage.getItem(STORAGE_KEY));
const listeners = new Set<VisualStyleListener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setGlobalStyle(nextStyle: VisualStyle) {
  const normalized = normalizeStyle(nextStyle);
  if (currentStyle === normalized) {
    return;
  }

  currentStyle = normalized;
  localStorage.setItem(STORAGE_KEY, normalized);
  emit();
}

function subscribe(listener: VisualStyleListener) {
  listeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    const nextStyle = normalizeStyle(event.newValue);
    if (nextStyle === currentStyle) {
      return;
    }

    currentStyle = nextStyle;
    emit();
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
}

function getSnapshot() {
  return currentStyle;
}

export function useVisualStyle() {
  const style = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setStyle = useCallback((nextStyle: VisualStyle) => {
    setGlobalStyle(nextStyle);
  }, []);

  return { style, setStyle, styleClassName: `visual-style-${style}` };
}

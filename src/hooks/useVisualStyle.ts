import { useCallback, useEffect, useMemo, useState } from 'react';

export type VisualStyle = 'a' | 'b' | 'c' | 'd';

const STORAGE_KEY = 'visual_style_variant';
const VALID_STYLES: VisualStyle[] = ['a', 'b', 'c', 'd'];

function normalizeStyle(value: string | null): VisualStyle {
  return VALID_STYLES.includes(value as VisualStyle) ? (value as VisualStyle) : 'a';
}

export function useVisualStyle() {
  const [style, setStyleState] = useState<VisualStyle>(() => normalizeStyle(localStorage.getItem(STORAGE_KEY)));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, style);
  }, [style]);

  const setStyle = useCallback((nextStyle: VisualStyle) => {
    setStyleState(nextStyle);
  }, []);

  const styleClassName = useMemo(() => `visual-style-${style}`, [style]);

  return { style, setStyle, styleClassName };
}


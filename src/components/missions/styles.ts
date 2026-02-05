import { CSSProperties } from 'react';

export const sizeStyles = {
  sm: { padding: '6px 12px', fontSize: '14px', borderRadius: '6px', textSize: '12px', subTextSize: '10px' },
  md: { padding: '12px 16px', fontSize: '16px', borderRadius: '8px', textSize: '14px', subTextSize: '12px' },
  lg: { padding: '16px 20px', fontSize: '18px', borderRadius: '10px', textSize: '16px', subTextSize: '14px' },
  xl: { padding: '20px 24px', fontSize: '20px', borderRadius: '12px', textSize: '18px', subTextSize: '16px' },
};

export const getCardStyles = (
  size: 'sm' | 'md' | 'lg' | 'xl',
  isDone: boolean,
  ACTIVE_COLOR: string
): CSSProperties => ({
  display: 'block',
  width: '100%',
  padding: sizeStyles[size].padding,
  fontSize: sizeStyles[size].fontSize,
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: isDone ? '#fef9c3' : '#78350f', // yellow-100 for completed, yellow-900 for active
  background: isDone
    ? 'linear-gradient(135deg, #b45309, #78350f)' // yellow-700 to yellow-900 for completed
    : ACTIVE_COLOR, // #ffa774 for active
  border: '4px solid #451a03', // Tailwind's yellow-900, fixed
  borderRadius: sizeStyles[size].borderRadius,
  cursor: isDone ? 'pointer' : 'default',
  boxShadow: isDone
    ? '0 6px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 0 8px 2px rgba(234, 179, 8, 0.5)' // yellow-500 glow
    : '0 6px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
  outline: 'none',
  WebkitTapHighlightColor: 'transparent',
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  position: 'relative',
  fontFamily: 'monospace',
  animation: isDone ? 'glow 3s ease-in-out infinite' : 'none',
});

export const getButtonStyles = (size: 'sm' | 'md' | 'lg' | 'xl'): CSSProperties => ({
  padding: size === 'sm' ? '2px 6px' : '4px 8px',
  fontSize: sizeStyles[size].subTextSize,
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#fef9c3', // yellow-100
  background: 'linear-gradient(135deg, #d97706, #92400e)', // yellow-600
  border: '2px solid #451a03', // yellow-900, thinner
  borderRadius: '4px',
  cursor: 'pointer',
  boxShadow: '0 4px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
  transition: 'background 0.1s ease-in-out, box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out',
  outline: 'none',
  WebkitTapHighlightColor: 'transparent',
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  animation: 'pulse 1.5s infinite',
});

export const panelStyles = (size: 'sm' | 'md' | 'lg' | 'xl'): CSSProperties => ({
  display: 'block', // Changed from inline-block to fill width
  width: '100%',
  padding: sizeStyles[size].padding,
  fontSize: sizeStyles[size].fontSize,
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#fef9c3', // Tailwind's yellow-100
  background: 'linear-gradient(135deg, #b45309, #78350f)', // Use accent if available, else yellow-700 to yellow-900
  border: '4px solid #451a03', // Tailwind's yellow-900, fixed
  borderRadius: sizeStyles[size].borderRadius,
  cursor: 'pointer',
  boxShadow: '0 6px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
  transition: 'background 0.1s ease-in-out, box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out',
  outline: 'none',
  WebkitTapHighlightColor: 'transparent',
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  position: 'relative',
  fontFamily: 'monospace', // Retain font-mono
});

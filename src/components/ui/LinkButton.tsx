// components/ui/LinkButton.tsx
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  label: string;
  active: boolean;
};

export default function LinkButton({ to, label, active }: Props) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-block',
    padding: '8px 12px', // Compact for footer
    fontSize: '16px', // Slightly smaller than HeavyButton
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: active ? '#fef3c7' : '#fef3c7', // amber-100 for consistency
    background: active
      ? '#d89671ff' // Tailwind's amber-900 for active state
      : 'linear-gradient(135deg, #d97706, #b45309)', // amber-600 to yellow-700
    border: '4px solid #451a03', // Tailwind's yellow-900, fixed
    borderRadius: '6px', // Tighter than HeavyButton's 8px
    cursor: 'pointer',
    appearance: 'none',
    boxShadow: '0 5px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
    transition: 'background 0.1s ease-in-out, box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out, color 0.1s ease-in-out',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    MozAppearance: 'none',
    WebkitAppearance: 'none',
    textDecoration: 'none',
  };

  return (
    <Link
      to={to}
      style={baseStyles}
      className="link-button"
      onMouseOver={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)'; // amber-500 to amber-600
          e.currentTarget.style.boxShadow = '0 3px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.5)'; // Subtle glow
        }
      }}
      onMouseOut={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'linear-gradient(135deg, #d97706, #b45309)'; // amber-600 to yellow-700
          e.currentTarget.style.boxShadow = '0 5px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)';
        }
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(2px)';
        e.currentTarget.style.boxShadow = '0 2px 0 0 rgba(0, 0, 0, 0.4), inset 0 3px 4px rgba(0, 0, 0, 0.5)';
        if (!active) {
          e.currentTarget.style.background = 'linear-gradient(135deg, #b45309, #92400e)'; // yellow-700 to yellow-600
        }
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 5px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)';
        if (!active) {
          e.currentTarget.style.background = 'linear-gradient(135deg, #d97706, #b45309)';
        }
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = 'none';
        e.currentTarget.style.border = '4px solid #451a03';
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
        e.currentTarget.style.border = '4px solid #451a03';
      }}
    >
      {label}
    </Link>
  );
}
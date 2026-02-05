// components/ui/HeavyButton.tsx
import React from 'react';

type Props = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Optional size prop
};

export default function HeavyButton({ children, onClick, size = 'md' }: Props) {
  // Define size-specific styles
  const sizeStyles = {
    sm: { padding: '6px 16px', fontSize: '14px', borderRadius: '6px' },
    md: { padding: '12px 24px', fontSize: '18px', borderRadius: '8px' },
    lg: { padding: '16px 32px', fontSize: '20px', borderRadius: '10px' },
    xl: { padding: '20px 40px', fontSize: '24px', borderRadius: '12px' },
  };

  const buttonStyles: React.CSSProperties = {
    display: 'inline-block',
    padding: sizeStyles[size].padding,
    fontSize: sizeStyles[size].fontSize,
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#fef9c3', // Tailwind's yellow-100
    background: 'linear-gradient(135deg, #b45309, #78350f)', // Tailwind's yellow-700 to yellow-900
    border: '4px solid #451a03', // Tailwind's yellow-900, fixed for all states
    borderRadius: sizeStyles[size].borderRadius,
    cursor: 'pointer',
    appearance: 'none',
    boxShadow: '0 6px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
    transition: 'background 0.1s ease-in-out, box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    MozAppearance: 'none',
    WebkitAppearance: 'none',
  };

  return (
    <button
      style={buttonStyles}
      className="heavy-button"
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, #d97706, #92400e)'; // yellow-600
        e.currentTarget.style.boxShadow = '0 4px 0 0 rgba(0, 0, 0, 0.4)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, #b45309, #78350f)'; // yellow-700 to yellow-900
        e.currentTarget.style.boxShadow = '0 6px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(2px)';
        e.currentTarget.style.boxShadow = '0 2px 0 0 rgba(0, 0, 0, 0.4), inset 0 3px 4px rgba(0, 0, 0, 0.6)';
        e.currentTarget.style.background = 'linear-gradient(135deg, #854d0e, #713f12)'; // yellow-800
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 6px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.background = 'linear-gradient(135deg, #b45309, #78350f)';
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
      {children}
    </button>
  );
}
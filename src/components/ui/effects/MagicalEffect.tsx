import { useState, useEffect } from 'react';

export default function MagicalEffect({ trigger }: { trigger: boolean }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setActive(true);
      const timeout = setTimeout(() => setActive(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  if (!active) return null;

  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 2 * Math.PI;
    const x = Math.cos(angle) * 60;
    const y = Math.sin(angle) * 60;
    return (
      <div
        key={i}
        className="absolute w-2 h-2 bg-white rounded-full"
        style={{
          transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
          animation: 'particle 0.8s ease-out forwards',
          left: '50%',
          top: '50%',
        }}
      />
    );
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative w-full h-full">{particles}</div>
    </div>
  );
}

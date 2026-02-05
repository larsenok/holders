import { useEffect, useState } from 'react';

type Props = { onDone: () => void };

export default function ConfettiBurst({ onDone }: Props) {
  const [pieces, setPieces] = useState<number[]>([]);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      onDone();
      return;
    }
    setPieces(Array.from({ length: 20 }, (_, i) => i));
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [onDone]);

  if (pieces.length === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p}
          className="confetti-piece"
          style={{
            left: Math.random() * 100 + '%',
            backgroundColor: `hsl(${Math.random() * 360},70%,60%)`,
          }}
        />
      ))}
    </div>
  );
}

export default function StartHint() {
  return (
    <div className="absolute left-0 right-0 mt-4 flex flex-col items-center text-yellow-200 pointer-events-none">
      <div className="text-3xl mb-1">↑</div>
      <div className="text-lg font-semibold px-2 py-1 rounded border border-yellow-700 animate-glow">
        Start your journey by sending adventurers on missions
      </div>

      <style>{`
        @keyframes glowCard {
          0% {
            box-shadow: 0 0 8px 2px rgba(255, 215, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 14px 6px rgba(255, 215, 0, 0.7);
          }
          100% {
            box-shadow: 0 0 8px 2px rgba(255, 215, 0, 0.3);
          }
        }

        .animate-glow {
          animation: glowCard 3s infinite;
        }
      `}</style>
    </div>
  );
}

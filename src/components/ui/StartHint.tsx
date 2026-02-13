export default function StartHint() {
  return (
    <div className="fixed left-2 right-2 bottom-20 sm:absolute sm:left-0 sm:right-0 sm:bottom-auto sm:mt-4 z-30 flex flex-col items-center text-yellow-200 pointer-events-none">
      <div className="text-3xl mb-1">↑</div>
      <div className="text-sm sm:text-lg font-semibold px-2 py-1 rounded border border-yellow-700 bg-slate-900/90 text-center max-w-[22rem] animate-glow">
        Start your journey: send adventurers on missions
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

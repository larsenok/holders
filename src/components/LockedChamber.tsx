import { useState } from 'react';

export default function LockedChamber() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="w-full h-full border border-yellow-800 bg-black rounded p-4 font-mono text-sm text-yellow-300 relative overflow-hidden">
      <div className="text-xs text-pink-500 mb-2">🔒 chamber</div>

      {!unlocked ? (
        <div className="italic text-pink-400">
          Access denied.
          <br />
          Stability levels insufficient for entry.
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-yellow-100 font-bold">🧬 chamber: core interface</div>
          <p className="text-yellow-200">
            Welcome inside.
            <br />
            Core parameters unlocked.
          </p>
          <div className="mt-2 border border-yellow-600 rounded p-2 text-yellow-400">
            Placeholder controls. System response uninitialized.
          </div>
        </div>
      )}

      {/* Temporary toggle for testing */}
      <button
        onClick={() => setUnlocked(!unlocked)}
        className="absolute top-2 right-2 px-2 py-1 text-xs bg-yellow-700 hover:bg-yellow-800 text-black rounded"
      >
        {unlocked ? 'Lock' : 'Unlock'}
      </button>
    </div>
  );
}

import { useState } from 'react';
import { fakeDefs } from '../data/fakeSettings';

export default function FakeSettings() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, number>>({
    emotionalGravity: 5,
    chanceOfRainIndoors: 50,
    fontMood: 2,
    quantumEcho: 1,
    sidebarFlicker: 6,
  });

  const handleChange = (key: string, val: number) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const activeUnlocks = fakeDefs
    .filter(f => values[f.key] >= f.unlockThreshold)
    .map(f => f.label);

  return (
    <>
      <div
        className="hover:border-pink-50 w-full h-full p-4 text-sm text-yellow-300 font-mono cursor-pointer border border-pink-800 rounded relative"
        onClick={() => setOpen(true)}
      >
        <div className="text-xs text-pink-400 mb-1">false settings</div>
        <div className="text-lg">
          {activeUnlocks.length > 0 ? activeUnlocks.join(', ') : 'System Stable'}
        </div>
        <div className="absolute bottom-2 left-4 text-xs text-pink-400">
          tap to modify settings
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-gray-900 border border-pink-700 rounded-lg p-6 w-[28rem] max-h-[80vh] overflow-auto space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg text-yellow-300 font-bold mb-2">Edit False Settings</h2>

            {fakeDefs.map((entry, i) => (
              <div key={i} className="space-y-1">
                <label className="block text-pink-400 text-sm">{entry.label}</label>
                <input
                  type="range"
                  min={entry.min}
                  max={entry.max}
                  step="1"
                  value={values[entry.key]}
                  onChange={e => handleChange(entry.key, Number(e.target.value))}
                  className="w-full accent-pink-600"
                />
                <div className="text-xs text-gray-400">
                  Current: {values[entry.key]}
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-1 bg-pink-600 hover:bg-pink-700 rounded text-white text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

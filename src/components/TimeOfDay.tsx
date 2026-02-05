import { useState } from 'react'
import type { TimeLabel } from '../types/Events'
import { defaultLabels } from '../data/events'

export default function TimeOfDay() {
  const [open, setOpen] = useState(false)
  const [labels, setLabels] = useState<TimeLabel[]>(defaultLabels)
  const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  const currentIndex = labels.reduce((acc, entry, idx) => {
    return now >= entry.time ? idx : acc
  }, 0)

  const current = labels[currentIndex]
  const next = labels[currentIndex + 1] ?? labels[0] // wrap if last

  const handleChange = (index: number, field: 'time' | 'label', value: string) => {
    const updated = [...labels]
    updated[index][field] = value
    setLabels(updated)
  }

  const handleRemove = (index: number) => {
    if (labels.length > 1) {
      setLabels(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleAdd = () => {
    setLabels(prev => [
      ...prev,
      { time: '00:00', label: 'new' },
    ])
  }

  return (
    <>
      <div
        className="hover:border-pink-50 w-full h-full p-4 text-sm text-yellow-300 font-mono cursor-pointer border border-pink-800 rounded relative"
        onClick={() => setOpen(true)}
      >
        <div className="text-xs text-pink-400 mb-1">time of day</div>
        <div className="text-lg">{current.label}</div>
        <div className="absolute bottom-2 left-4 text-xs text-pink-400">
          {`${current.time} → ${next.time}`}
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
            <h2 className="text-lg text-yellow-300 font-bold mb-2">Edit Time Labels</h2>

            {labels.map((entry, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="time"
                  value={entry.time}
                  onChange={e => handleChange(i, 'time', e.target.value)}
                  className="bg-gray-800 border border-pink-500 px-2 py-1 text-white w-28 rounded"
                />
                <input
                  type="text"
                  value={entry.label}
                  onChange={e => handleChange(i, 'label', e.target.value)}
                  className="flex-1 bg-gray-800 border border-pink-500 px-2 py-1 text-white rounded"
                />
                {labels.length > 1 && (
                  <button
                    onClick={() => handleRemove(i)}
                    className="text-xs text-red-400 hover:text-red-200 px-2"
                    title="Remove row"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {labels.length < 6 && (
              <div className="pt-2">
                <button
                  onClick={handleAdd}
                  className="px-3 py-1 text-sm text-pink-400 border border-pink-600 rounded hover:bg-pink-700/10"
                >
                  + Add Row
                </button>
              </div>
            )}

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
  )
}

'use client'

import { useState } from "react"
import type { RuleBox, Frequency, Rule } from "../../types/Rules"

export function RuleBoxPopup({
  box,
  onClose,
  onUpdate,
  onDelete,
}: {
  box: RuleBox
  onClose: () => void
  onUpdate: (updated: Partial<RuleBox>) => void
  onDelete: () => void
}) {
  const [newTrigger, setNewTrigger] = useState('')
  const [newText, setNewText] = useState('')

  const handleFrequencyChange = (newFreq: Frequency) => {
    onUpdate({ frequency: newFreq })
  }

  const addRule = () => {
    if (!newTrigger.trim() || !newText.trim()) return

    const newRule: Rule = {
      id: crypto.randomUUID(),
      trigger: newTrigger.trim(),
      text: newText.trim(),
    }

    const updatedRules = [...box.rules, newRule]
    onUpdate({ rules: updatedRules })

    setNewTrigger('')
    setNewText('')
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-pink-700 rounded-lg p-6 w-[30rem] max-h-[80vh] overflow-auto space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg text-yellow-300 font-bold mb-2">Edit Rule Box</h2>

        <label className="block text-pink-400 text-sm">Frequency</label>
        <select
          value={box.frequency}
          onChange={e => handleFrequencyChange(e.target.value as Frequency)}
          className="w-full bg-gray-800 border border-pink-600 rounded px-2 py-1 text-sm text-yellow-200"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <label className="block text-pink-400 text-sm pt-2">Trigger</label>
        <input
          value={newTrigger}
          onChange={e => setNewTrigger(e.target.value)}
          placeholder="e.g. 1st, Monday, Last Sunday"
          className="w-full bg-gray-800 border border-pink-600 rounded px-2 py-1 text-sm text-yellow-200"
        />

        <label className="block text-pink-400 text-sm pt-2">Rule Description</label>
        <input
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="e.g. 24 hr fasting"
          className="w-full bg-gray-800 border border-pink-600 rounded px-2 py-1 text-sm text-yellow-200"
        />

        <button
          onClick={addRule}
          className="mt-3 px-3 py-1 bg-pink-600 hover:bg-pink-700 rounded text-white text-sm"
        >
          + Add Rule
        </button>

        {box.rules.length > 0 && (
          <div className="pt-4 space-y-3">
            <h3 className="text-pink-400 text-sm font-bold">Current Rules</h3>
            {box.rules.map(rule => (
              <div
                key={rule.id}
                className="border-l-2 border-pink-500 pl-3 py-1 text-yellow-100 text-sm"
              >
                <span className="text-blue-300 font-mono">{rule.trigger}</span>: {rule.text}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between pt-6">
          <button
            onClick={onDelete}
            className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
          >
            Delete Box
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-pink-600 hover:bg-pink-700 rounded text-white text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

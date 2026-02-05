'use client'

import { useEffect, useState, useRef } from 'react'
import type { RuleBox } from '../../types/Rules'
import { RuleBoxPopup } from './RuleBoxPopup'
import { RuleList } from './RuleList'

export default function RuleBoxManager() {
  const [boxes, setBoxes] = useState<RuleBox[]>([])
  const [openBoxId, setOpenBoxId] = useState<string | null>(null)
  const loaded = useRef(false)

  // Load from localStorage ONCE
  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    try {
      const stored = localStorage.getItem('ruleBoxes')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setBoxes(parsed)
        }
      }
    } catch (err) {
      console.warn('Failed to load ruleBoxes:', err)
    }
  }, [])

  // Save on every change (after load)
  useEffect(() => {
    if (!loaded.current) return
    localStorage.setItem('ruleBoxes', JSON.stringify(boxes))
  }, [boxes])

  const createBox = () => {
    const newBox: RuleBox = {
      id: crypto.randomUUID(),
      frequency: 'daily',
      rules: [],
    }
    setBoxes(prev => [...prev, newBox])
    setOpenBoxId(newBox.id)
  }

  const updateBox = (id: string, updated: Partial<RuleBox>) => {
    setBoxes(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updated } : b))
    )
  }

  const deleteBox = (id: string) => {
    setBoxes(prev => prev.filter(b => b.id !== id))
    setOpenBoxId(null)
  }

  return (
    <div className="space-y-6">
      {boxes.map(box => (
        <div
          key={box.id}
          className="hover:border-pink-50 p-4 text-sm text-yellow-300 font-mono cursor-pointer border border-pink-800 rounded relative"
          onClick={() => setOpenBoxId(box.id)}
        >
          <div className="text-sm text-pink-100 mb-1">{box.frequency}</div>
          <div className="text-lg">
            {box.rules.length === 0 && 'empty'}
          </div>
          <div className="absolute bottom-2 left-4 text-xs text-pink-400">
            tap to edit
          </div>

          <div className="pb-4">
            <RuleList rules={box.rules} />
          </div>
        </div>
      ))}

      <button
        onClick={createBox}
        className="text-sm px-4 py-2 border border-pink-600 text-pink-400 hover:bg-pink-700/20 rounded"
      >
        + Create Rule Box
      </button>

      {boxes.map(box =>
        box.id === openBoxId ? (
          <RuleBoxPopup
            key={box.id}
            box={box}
            onClose={() => setOpenBoxId(null)}
            onUpdate={(partial) => updateBox(box.id, partial)}
            onDelete={() => deleteBox(box.id)}
          />
        ) : null
      )}
    </div>
  )
}

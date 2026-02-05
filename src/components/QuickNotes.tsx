import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import NoteBuddy from '../assets/note_buddy_1.png';

const STORAGE_KEY = 'feelos_quick_notes';

type NoteEntry = {
  id: string;
  content: string;
};

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function QuickNotes() {
  const [notes, setNotes] = useState<NoteEntry[]>([{ id: generateId(), content: '' }]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setNotes(parsed);
      } catch (err) {
        console.error('[QuickNotes] Failed to parse saved notes', err)
      }
    }
  }, []);

  const saveNotes = (next: NoteEntry[]) => {
    setNotes(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setLastSaved(new Date().toLocaleTimeString());
  };

  const updateNote = (index: number, value: string) => {
    const updated = [...notes];
    updated[index].content = value;
    saveNotes(updated);
  };

  const addNote = () => {
    saveNotes([...notes, { id: generateId(), content: '' }]);
  };

  const removeNote = (index: number) => {
    if (notes.length <= 1) return;
    const next = [...notes];
    next.splice(index, 1);
    saveNotes(next);
  };

  return (
    <div className="w-full h-full p-4 text-sm text-yellow-300 font-mono border border-pink-800 rounded overflow-hidden">
      <div className="text-xs text-pink-400 flex justify-between items-center mb-2">
        <span>quick notes</span>
        {lastSaved && <span className="text-[12px] text-gray-400">saved {lastSaved}</span>}
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[calc(100%-2.5rem)] pr-1">
        {notes.map((note, i) => (
          <div key={note.id} className="space-y-2">
            <textarea
              value={note.content}
              onChange={e => updateNote(i, e.target.value)}
              className="w-full h-[5.5rem] resize-none bg-gray-900 text-yellow-100 p-2 rounded border border-gray-700 focus:outline-none"
              placeholder={`Note ${i + 1}`}
            />

            <div className="flex justify-between items-center">
              {i > 0 ? (
                <button
                  onClick={() => removeNote(i)}
                  className="text-pink-500 hover:text-red-500 text-xs flex items-center gap-1"
                >
                  <X size={12} />
                </button>
              ) : <div />}

              {i === notes.length - 1 && (
                <button
                  onClick={addNote}
                  className="text-pink-400 hover:text-pink-200 flex items-center gap-1 text-xs"
                >
                  <Plus size={12} /> New
                </button>
              )}
            </div>
          </div>
        ))}
        {notes.length === 1 && (
            <div className="mt-6 flex justify-center">
                <img src={NoteBuddy} alt="Note Buddy" className="h-24 opacity-80" />
            </div>
        )}
      </div>
    </div>
  );
}

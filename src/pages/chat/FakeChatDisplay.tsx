import { motion, AnimatePresence } from 'framer-motion';
import { Settings2 } from 'lucide-react';

type Props = {
  messages: string[];
  loading: boolean;
  input: string;
  alwaysSayYes: boolean;
  showSettings: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  storeBg: string;
  setInput: (val: string) => void;
  setShowSettings: (val: boolean | ((prev: boolean) => boolean)) => void;
  setAlwaysSayYes: (val: boolean | ((prev: boolean) => boolean)) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function FakeChatDisplay({
  messages,
  loading,
  input,
  alwaysSayYes,
  showSettings,
  containerRef,
  storeBg,
  setInput,
  setShowSettings,
  setAlwaysSayYes,
  handleSubmit,
}: Props) {
  return (
    <div
      className="h-full text-white px-8 py-8 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: storeBg }}
    >
      <div className="flex items-center justify-between mb-4 max-w-xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-yellow-400">🧠 Super Smart Chat</h1>
        <button onClick={() => setShowSettings(prev => !prev)} className="text-pink-300 hover:text-pink-400">
          <Settings2 size={18} />
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="mb-4 max-w-xl mx-auto w-full border border-white/20 rounded bg-gray-800 px-4 py-3 text-sm"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={alwaysSayYes}
                onChange={() => setAlwaysSayYes(prev => !prev)}
                className="accent-pink-500"
              />
              Yes-mode.
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto border border-white/20 rounded-lg p-4 space-y-4 bg-white/5 max-w-xl mx-auto w-full"
      >
        {messages.map((text, index) => (
          <motion.div
            key={index}
            className={`px-4 py-2 rounded-md w-fit max-w-md ${
              text.startsWith('🧍') ? 'bg-pink-600/40 self-end ml-auto' : 'bg-white/10'
            }`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {text.replace(/^🧍 /, '').replace(/^🤖 /, '')}
          </motion.div>
        ))}

        {loading && (
          <motion.div
            className="text-sm text-gray-400 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🤖 thinking...
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2 max-w-xl mx-auto w-full flex-none">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400"
          placeholder="Ask a deep, sincere question..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded font-mono text-sm"
          disabled={loading}
        >
          Ask
        </button>
      </form>
    </div>
  );
}

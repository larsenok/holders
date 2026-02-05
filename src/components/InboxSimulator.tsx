import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  content: string;
};

const MESSAGES = [
  '🕳️ Incoming ping from the null zone',
  '📡 Signal detected from ghost instance',
  '🗂️ Packet archived: /memory/042',
  '🔒 Unlock protocol echoed back',
  '📭 Inbox ghosted a reply',
  '✉️ Message unreadable (fragmented)',
  '📁 Log sync loop completed',
  '🔔 Notification dismissed itself',
];

export default function InboxSimulator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [counter, setCounter] = useState(0);

  const addMessage = () => {
    const newMsg: Message = {
      id: uuid(),
      content: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
    };
    setMessages(prev => [...prev, newMsg]);
    setCounter(c => c + 1);

    // Auto-remove after 3.5s
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== newMsg.id));
      setCounter(c => c - 1);
    }, 3500);
  };

  return (
    <div
      onClick={addMessage}
      className="w-full h-full max-h-[150px] p-4 text-sm text-yellow-300 font-mono border border-pink-800 rounded cursor-pointer hover:bg-pink-900/10 transition relative overflow-hidden"
    >
      <div className="text-xs text-pink-400 mb-1 flex justify-between">
        <span>inbox simulator</span>
        <span className="text-gray-400">{counter} new</span>
      </div>

      <div className="space-y-2 overflow-hidden">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-pink-300"
            >
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>

        {messages.length === 0 && (
          <motion.div
            key="zero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400"
          >
            📭 Inbox Zero
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import FakeChatDisplay from './FakeChatDisplay';
import { botRepliesNo, botRepliesYes, initialMessages } from '../../data/replies';
import { getCurrentUserId, unlockAchievement } from '../../api/achievements';
import { useUnlocks } from '../../hooks/useUnlocks';
import { usePopup } from '../../providers/PopupProvider';

export default function FakeChatPage() {
  const [messages, setMessages] = useState<string[]>(initialMessages.map(m => m.text));
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [alwaysSayYes, setAlwaysSayYes] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { getEquipped } = useUnlocks();
  const storeBg = getEquipped();
  const containerRef = useRef<HTMLDivElement>(null!) as React.RefObject<HTMLDivElement>;
  const { showPopup } = usePopup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, `🧍 ${userMsg}`]);
    setInput('');
    setLoading(true);

    const delay = 1500 + Math.random() * 1500;

    setTimeout(async () => {
      const pool = alwaysSayYes ? botRepliesYes : botRepliesNo;
      const reply = pool[Math.floor(Math.random() * pool.length)];
      setMessages(prev => [...prev, `🤖 ${reply}`]);
      setLoading(false);

      const raw = localStorage.getItem('bot_interactions') || '0';
      const count = parseInt(raw, 10) + 1;
      localStorage.setItem('bot_interactions', count.toString());
      console.log(`[Chat] Bot interaction count: ${count}`);

      const unlocks = [
        { id: 'chatterStart', threshold: 1 },
        { id: 'chatterBronze', threshold: 10 },
        { id: 'chatterSilver', threshold: 50 },
        { id: 'chatterGold', threshold: 100 },
      ];

      const userId = await getCurrentUserId();
      if (!userId) {
        console.warn('[Chat] No user ID available');
        return;
      }

      for (const { id, threshold } of unlocks) {
        const unlockedKey = `unlocked_${id}`;
        const already = localStorage.getItem(unlockedKey) === '1';

        console.log(`[Chat] Checking ${id} — count: ${count}, required: ${threshold}, unlocked: ${already}`);

        if (!already && count >= threshold) {
          console.log(`[Chat] Attempting to unlock ${id}...`);
          const success = await unlockAchievement(userId, id);

          if (success) {
            console.log(`[Chat] Unlocked ${id} successfully at ${count}`);
            localStorage.setItem(unlockedKey, '1');

            // Todo: show popup frmo inside achi-provider.
            showPopup({
              title: unlockedKey,
              description: "description",
              duration: 4000,
            });
          } else {
            console.warn(`[Chat] Failed to unlock ${id}`);
          }
        }
      }
    }, delay);
  };

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <FakeChatDisplay
      messages={messages}
      loading={loading}
      input={input}
      alwaysSayYes={alwaysSayYes}
      showSettings={showSettings}
      containerRef={containerRef}
      storeBg={storeBg}
      setInput={setInput}
      setShowSettings={setShowSettings}
      setAlwaysSayYes={setAlwaysSayYes}
      handleSubmit={handleSubmit}
    />
  );
}

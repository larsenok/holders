import { motion } from 'framer-motion';
import { useUnlocks } from '../hooks/useUnlocks';
import { storeItems } from '../data/storeItems';
import { goldStoreItems } from '../data/goldStoreItems';
import ShowBalance from '../components/ShowBalance';
import { useUser } from '../providers/UserProvider';
import HeavyButton from '../components/ui/HeavyButton';
import { useState } from 'react';
import { useGuild } from '../providers/GuildProvider';

const GOLD_STORE_PURCHASED_KEY = 'goldStorePurchases';

export default function StorePage() {
  const { setUnlocked, unlockedStatuses, getEquipped, setEquipped } = useUnlocks();
  const mainBg = getEquipped();
  const { setCredits } = useUser();
  const { guildStats, updateGuildStats, addGold, increaseXp, increasePower } = useGuild();
  const [errorItem, setErrorItem] = useState<string | null>(null);
  const [purchasedGoldItems, setPurchasedGoldItems] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(GOLD_STORE_PURCHASED_KEY) || '[]');
    } catch {
      return [];
    }
  });

  function handlePurchaseFeel(key: string, cost: number): void {
    const success = setUnlocked(key, cost, true, "credits");
    if (!success) {
      setErrorItem(key);
      setTimeout(() => setErrorItem(null), 400);
    }
  }

  function handlePurchaseGold(key: string, cost: number): void {
    const item = goldStoreItems.find(entry => entry.key === key);
    if (!item) return;
    if (!item.repeatable && purchasedGoldItems.includes(item.key)) {
      return;
    }
    if (guildStats.gold < cost) {
      setErrorItem(key);
      setTimeout(() => setErrorItem(null), 400);
      return;
    }

    updateGuildStats({ gold: guildStats.gold - cost });

    switch (item.effect.type) {
      case 'gold':
        addGold(item.effect.amount);
        break;
      case 'xp':
        increaseXp(item.effect.amount);
        break;
      case 'power':
        for (let i = 0; i < item.effect.amount; i += 1) increasePower();
        break;
      case 'passiveGoldBonus':
        updateGuildStats({ passiveGoldBonus: (guildStats.passiveGoldBonus || 0) + item.effect.amount });
        break;
      case 'unlock':
        setUnlocked(key, 0, true);
        break;
    }

    if (!item.repeatable) {
      const nextPurchased = [...purchasedGoldItems, item.key];
      setPurchasedGoldItems(nextPurchased);
      localStorage.setItem(GOLD_STORE_PURCHASED_KEY, JSON.stringify(nextPurchased));
    }

    const success = true;
    if (!success) {
      setErrorItem(key);
      setTimeout(() => setErrorItem(null), 400);
    }
  }

  function handleEquip(key: string): void {
    setEquipped(key);
  }

  return (
    <div className="min-h-screen text-white px-6 py-8 space-y-12" style={{ backgroundColor: mainBg }}>
      <ShowBalance />

      {/* Gold Store First */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-yellow-400 text-center">💰 Store (Gold)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goldStoreItems.map(item => (
            <motion.div
              key={item.key}
              className="p-4 rounded-lg border border-amber-400 bg-amber-800/30 shadow hover:shadow-lg transition"
              whileHover={{ scale: 1.015 }}
            >
              <h3 className="text-xl font-semibold text-white">{item.name}</h3>
              <p className="text-sm text-gray-300 mb-2">{item.description}</p>
              <p className="mb-2 text-amber-300 font-mono">Cost: {item.cost} Gold</p>
              {!item.repeatable && purchasedGoldItems.includes(item.key) && (
                <p className="mb-2 text-xs text-emerald-300 font-semibold">Purchased</p>
              )}

              <button
                disabled={!item.repeatable && purchasedGoldItems.includes(item.key)}
                className={`mt-1 px-4 py-1 text-sm rounded text-white bg-amber-500 hover:bg-amber-600 ${
                  !item.repeatable && purchasedGoldItems.includes(item.key)
                    ? 'opacity-50 cursor-not-allowed hover:bg-amber-500'
                    : errorItem === item.key ? 'border-2 border-red-500 bg-red-600 animate-shake' : ''
                }`}
                onClick={() => handlePurchaseGold(item.key, item.cost)}
              >
                {!item.repeatable && purchasedGoldItems.includes(item.key) ? 'Owned' : 'Purchase'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FEEL Store Below */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-yellow-300 text-center">🪙 Store (FEEL)</h1>
        
        <HeavyButton onClick={() => setCredits(1000)} size="sm">C+</HeavyButton>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {storeItems.map(item => {
            const unlocked = unlockedStatuses.find(u => u.key === item.key)?.unlocked ?? false;
            const equipped = unlockedStatuses.find(u => u.key === item.key)?.equipped ?? false;

            return (
              <motion.div
                key={item.key}
                className={`p-4 rounded-lg transition-colors duration-150 border shadow-md ${
                  unlocked
                    ? 'border-green-300 bg-green-800/40'
                    : 'border-gray-600 bg-gray-700/40'
                }`}
                whileHover={{ scale: 1.015 }}
              >
                <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                <p className="text-sm text-gray-300 mb-2">{item.description}</p>
                <p className="mb-2 text-yellow-200 font-mono">Cost: {item.cost} FEEL</p>

                {unlocked ? (
                  equipped ? (
                    <span className="text-green-300 font-semibold">✅ Equipped</span>
                  ) : (
                    <button
                      className="mt-1 mr-2 px-4 py-1 text-sm bg-pink-400 hover:bg-pink-500 rounded text-white"
                      onClick={() => handleEquip(item.key)}
                    >
                      Equip
                    </button>
                  )
                ) : (
                  <button
                    className={`mt-1 px-4 py-1 text-sm rounded text-white bg-pink-500 hover:bg-pink-600 ${
                      errorItem === item.key ? 'border-2 border-red-500 bg-red-600 animate-shake' : ''
                    }`}
                    onClick={() => handlePurchaseFeel(item.key, item.cost)}
                  >
                    Unlock
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

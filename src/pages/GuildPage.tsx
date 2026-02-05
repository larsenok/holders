import GuildMaterials from '../components/guild/GuildMaterials';
import MissionsPanel from '../components/missions/MissionsPanel';
import { useUnlocks } from '../hooks/useUnlocks';
import { useGuild } from '../providers/GuildProvider'
import RecruitModal from '../components/character/RecruitModal'
import { useState, useEffect } from 'react'
import { usePreloadImages } from '../hooks/usePreloadImages'
import { inventoryIcons } from '../data/inventory'
import GuildHeader from '../components/guild/GuildHeader';
import HeavyButton from '../components/ui/HeavyButton';
import CharacterList from '../components/character/CharacterList';
import StartHint from '../components/ui/StartHint';
import TomeShelf from '../components/guild/TomeShelf';
import GuildBonuses from '../components/GuildBonuses';
import StatsStrip from '../components/guild/StatsStrip';
import { useGuildTheme } from '../hooks/useGuildTheme';
import ConfettiBurst from '../components/effects/ConfettiBurst';
import Visitor from '../components/guild/Visitor';

export default function GuildPage() {
  const { adventurers, maxAdventurers, visitor } = useGuild();
  const { getEquipped } = useUnlocks();
  const accent = getEquipped(true);
  const [showRecruit, setShowRecruit] = useState(false);
  const { guildStats } = useGuild();
  const tier = useGuildTheme();
  const [visitorFx, setVisitorFx] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const shouldShowStartHint = guildStats.rank === 1 && guildStats.xp === 0;

  usePreloadImages(Object.values(inventoryIcons));

  useEffect(() => {
    if (visitor?.id) {
      setVisitorFx(true);
      const t = setTimeout(() => setVisitorFx(false), 1000);
      return () => clearTimeout(t);
    }
  }, [visitor?.id]);

  useEffect(() => {
    const handler = () => {
      setCelebrate(true);
    };
    window.addEventListener('guild:uniqueMission', handler);
    return () => window.removeEventListener('guild:uniqueMission', handler);
  }, []);

  useEffect(() => {
    if (!celebrate) return;
    const t = setTimeout(() => setCelebrate(false), 2000);
    return () => clearTimeout(t);
  }, [celebrate]);

  return (
    <div className={`guild-page tier-${tier} ${visitorFx ? 'visitor-effect' : ''} ${celebrate ? 'celebrate' : ''} flex flex-col xl:flex-row w-full h-full text-white p-4 gap-4`}>
      <div className="flex flex-col flex-1 gap-4">
        <div className="border border-gray-700 rounded-xl p-4 shadow-md" style={{ backgroundColor: accent || 'var(--accent-color)' }}>
          <GuildHeader />

          <div className="mb-3">
            <GuildMaterials />
          </div>

          <GuildBonuses />

          <div className="flex flex-row items-start gap-4">
            <CharacterList />
          </div>

          {adventurers.length < maxAdventurers && (
            <div className="flex flex-wrap gap-2">
              <HeavyButton onClick={() => setShowRecruit(true)} size="sm">
                Recruit New Adventurer
              </HeavyButton>
            </div>
          )}
        </div>
      </div>

      {/* Column: Missions */}
      <div className="xl:w-1/3 w-full relative">
        <TomeShelf />
        <StatsStrip />
        <MissionsPanel />
        {shouldShowStartHint && <StartHint />}
      </div>
      <Visitor />
      {showRecruit && <RecruitModal onClose={() => setShowRecruit(false)} />}
      {celebrate && <ConfettiBurst onDone={() => setCelebrate(false)} />}
      {celebrate && <div className="banner pointer-events-none" />}
    </div>
  );
}

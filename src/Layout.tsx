import { Outlet, useLocation } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import LinkButton from './components/ui/LinkButton';
import { useUnlocks } from './hooks/useUnlocks';
import { useGuild } from './providers/GuildProvider';
import LevelUpModal from './components/ui/LevelUpModal';

export default function Layout() {
  const location = useLocation();
  const { getEquipped } = useUnlocks();
  const { guildStats, rankUpVisible, setRankUpVisible } = useGuild();
  const guildName = guildStats.name?.trim() || 'Iron Sigil';

  const mainBg = useMemo(() => getEquipped(), [getEquipped]);
  const accent = useMemo(() => getEquipped(true), [getEquipped]);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  const handleCloseRankUp = useCallback(() => {
    setRankUpVisible(false);
  }, [setRankUpVisible]);

  const containerStyle = useMemo(() => {
    const style = {
      ...(mainBg && { backgroundColor: mainBg }),
      ...(accent && { '--accent-color': accent }),
    } as React.CSSProperties;

    return style;
  }, [mainBg, accent]);

  const navigationItems = useMemo(() => [
    { path: '/', label: 'Guild' },
    { path: '/store', label: 'Store' },
    { path: '/achievements', label: 'Achievements' },
    { path: '/leaderboard', label: 'Leaderboard' }
  ], []);

  return (
    <div
      className="w-full min-h-[100dvh] text-white flex flex-col overflow-x-hidden"
      style={containerStyle}
    >
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>

      <footer className="w-full px-3 py-1.5 md:px-4 md:pb-2 md:pt-1 flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between text-sm text-pink-300 bg-gray-800/95">
        <h1 className="text-base md:text-lg font-bold text-yellow-300 flex items-center gap-2">
          <img src="/iron-sigil.svg" alt="Guild crest" className="w-6 h-6" />
          {guildName}
        </h1>
        <div className="flex flex-wrap justify-center md:justify-end gap-1.5 md:gap-3 w-full md:w-auto">
          {navigationItems.map(({ path, label }) => (
            <LinkButton 
              key={path}
              to={path} 
              label={label} 
              active={isActive(path)} 
            />
          ))}
        </div>
      </footer>
      
      {rankUpVisible && (
        <LevelUpModal 
          rank={guildStats.rank}
          onClose={handleCloseRankUp} 
        />
      )}
    </div>
  );
}

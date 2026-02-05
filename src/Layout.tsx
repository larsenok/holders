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
      className="w-screen h-screen text-white flex flex-col overflow-hidden"
      style={containerStyle}
    >
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>

      <footer className="w-full px-4 pb-2 pt-1 flex items-center justify-between text-sm text-pink-300 bg-gray-800">
        <h1 className="text-lg font-bold text-yellow-300 flex items-center gap-2">
          <img src="/iron-sigil.svg" alt="Guild crest" className="w-6 h-6" />
          {guildName}
        </h1>
        <div className="flex justify-center gap-4">
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

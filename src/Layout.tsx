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
      <div className="flex-1 min-h-0 pb-24 md:pb-20">
        <Outlet />
      </div>

      <footer
        className="fixed bottom-0 left-0 right-0 z-40 w-full px-2 pt-1.5 md:px-4 md:py-2 text-sm text-pink-300 bg-gray-800/95 border-t border-slate-700/80 backdrop-blur-sm"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.375rem)' }}
      >
        <div className="hidden md:flex items-center justify-between gap-3">
          <h1 className="text-base md:text-lg font-bold text-yellow-300 flex items-center gap-2 whitespace-nowrap">
            <img src="/iron-sigil.svg" alt="Guild crest" className="w-6 h-6" />
            {guildName}
          </h1>
          <div className="grid grid-cols-4 gap-2 w-full max-w-2xl">
            {navigationItems.map(({ path, label }) => (
              <LinkButton
                key={path}
                to={path}
                label={label}
                active={isActive(path)}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1 md:hidden w-full">
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

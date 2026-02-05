import { Routes, Route } from 'react-router-dom';
import { useEffect, useMemo, useCallback } from 'react'
import Layout from './Layout';
import StorePage from './pages/StorePage';
import AchiPage from './pages/AchiPage';
import GuildPage from './pages/GuildPage';
import LeaderboardPage from './pages/LeaderboardPage';
import StarterPage from './pages/StarterPage'
import StatsPage from './pages/StatsPage'
import { useGuild } from './providers/GuildProvider';

export default function App() {
  const { adventurers } = useGuild()
  
  const hasStarter = useMemo(() => adventurers.length > 0, [adventurers.length]);

  const saveExitTime = useCallback(() => {
    try {
      localStorage.setItem('lastSeen', Date.now().toString());
    } catch (error) {
      console.error('Failed to save exit time:', error);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', saveExitTime);
    return () => window.removeEventListener('beforeunload', saveExitTime);
  }, [saveExitTime]);

  const authenticatedRoutes = useMemo(() => (
    <>
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<GuildPage />} />
        <Route path="store" element={<StorePage />} />
        <Route path="achievements" element={<AchiPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
      </Route>
    </>
  ), []);

  const starterRoute = useMemo(() => (
    <Route path="*" element={<StarterPage />} />
  ), []);

  return (
    <Routes>
      {hasStarter ? authenticatedRoutes : starterRoute}
    </Routes>
  )
}
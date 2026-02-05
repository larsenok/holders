import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AchievementsProvider } from './providers/AchievementsProvider';
import { UnlockProvider } from './hooks/useUnlocks';
import { PopupProvider } from './providers/PopupProvider';
import { GuildProvider } from './providers/GuildProvider';
import { UserProvider } from './providers/UserProvider';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <UserProvider>
          <GuildProvider>
            <UnlockProvider>
              <PopupProvider>
                <AchievementsProvider>
                    <App />
                </AchievementsProvider>
              </PopupProvider>
            </UnlockProvider>
          </GuildProvider>
        </UserProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

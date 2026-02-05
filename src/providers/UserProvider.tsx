import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { User } from '../api/users'
import { getCredits } from '../api/credits'

type UserContextType = {
  user: User | null
  setUser: (user: User | null) => void
  credits: number
  setCredits: (amount: number) => void
  isLoading: boolean
  error: string | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const USER_STORAGE_KEY = 'user'
const CREDITS_STORAGE_KEY = 'userCredits'

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const parsedUser = JSON.parse(stored) as User;
        setUser(parsedUser);
        return parsedUser;
      }
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err);
      setError('Failed to load user data');
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    return null;
  }, []);

  const saveUserToStorage = useCallback((userData: User | null) => {
    try {
      if (userData) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to save user to localStorage:', err);
      setError('Failed to save user data');
    }
  }, []);

  const loadCredits = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const userCredits = await getCredits(userId);
      setCredits(userCredits);
      localStorage.setItem(CREDITS_STORAGE_KEY, String(userCredits));
    } catch (err) {
      console.error('Failed to load credits:', err);
      setError('Failed to load credits');
      // Fallback to stored credits if available
      const storedCredits = localStorage.getItem(CREDITS_STORAGE_KEY);
      if (storedCredits) {
        setCredits(Number(storedCredits));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSetUser = useCallback((userData: User | null) => {
    setUser(userData);
    saveUserToStorage(userData);
    
    if (userData) {
      loadCredits(userData.id);
    } else {
      setCredits(0);
      localStorage.removeItem(CREDITS_STORAGE_KEY);
    }
  }, [saveUserToStorage, loadCredits]);

  const handleSetCredits = useCallback((amount: number) => {
    if (amount < 0) {
      console.warn('Attempted to set negative credits:', amount);
      return;
    }
    setCredits(amount);
    localStorage.setItem(CREDITS_STORAGE_KEY, String(amount));
  }, []);

  // Load initial user data
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const contextValue = useMemo(() => ({
    user,
    setUser: handleSetUser,
    credits,
    setCredits: handleSetCredits,
    isLoading,
    error
  }), [user, handleSetUser, credits, handleSetCredits, isLoading, error]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}

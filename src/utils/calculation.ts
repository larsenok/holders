import { Adventurer } from "../types/Guild"

4// Cache for power colors to avoid repeated object creation
const POWER_COLOR_CACHE = new Map<string, string>([
  ['S', 'text-red-500'],
  ['A', 'text-amber-300'],
  ['B', 'text-purple-400'],
  ['C', 'text-blue-400'],
  ['D', 'text-sky-300'],
  ['E', 'text-slate-300']
]);

export function getPowerColor(power: string): string {
  if (!power || typeof power !== 'string') {
    return 'text-gray-400';
  }
  
  return POWER_COLOR_CACHE.get(power) || 'text-gray-400';
}

export const computePower = (advs: Adventurer[], guildRank: number): number => {
  if (!Array.isArray(advs) || advs.length === 0) {
    return Math.max(1, guildRank);
  }
  
  if (guildRank < 1) {
    console.warn('Invalid guild rank:', guildRank);
    return 1;
  }

  const totalLevel = advs.reduce((sum, adv) => {
    const level = adv?.level || 0;
    return sum + Math.max(0, level);
  }, 0);
  
  const avgAdventurerLevel = totalLevel / advs.length;
  return Math.round(guildRank + avgAdventurerLevel);
}

export function shuffle<T>(array: T[]): T[] {
  if (!Array.isArray(array) || array.length <= 1) {
    return array;
  }
  
  // Fisher-Yates shuffle algorithm for better randomization
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

export function calculateMaxAdventurers(rank: number, power: number): number {
  if (rank < 1 || power < 0) {
    console.warn('Invalid rank or power values:', { rank, power });
    return 2; // Minimum default
  }
  
  const base = 2;
  const rankBonus = Math.floor(rank / 3);
  const powerBonus = Math.floor(power / 10);
  return Math.max(2, base + rankBonus + powerBonus);
}

export function formatRemaining(seconds: number): string {
  if (seconds < 0 || !Number.isFinite(seconds)) {
    return '0s';
  }
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(' ');
}

// New utility function for debouncing expensive calculations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Utility for memoizing expensive calculations
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

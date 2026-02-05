import { useState, useEffect, useCallback } from 'react';

interface UseLocalStorageOptions<T> {
  defaultValue: T;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  onError?: (error: Error) => void;
}

export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T>
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    defaultValue,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    onError = console.error
  } = options;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return deserializer(item);
    } catch (error) {
      onError(error as Error);
      return defaultValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, serializer(valueToStore));
      }
    } catch (error) {
      onError(error as Error);
    }
  }, [key, serializer, storedValue, onError]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      onError(error as Error);
    }
  }, [key, defaultValue, onError]);

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserializer(e.newValue));
        } catch (error) {
          onError(error as Error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserializer, onError]);

  return [storedValue, setValue, removeValue];
}

// Specialized hooks for common data types
export function useLocalStorageString(key: string, defaultValue: string = '') {
  return useLocalStorage(key, {
    defaultValue,
    serializer: (value) => value,
    deserializer: (value) => value
  });
}

export function useLocalStorageNumber(key: string, defaultValue: number = 0) {
  return useLocalStorage(key, {
    defaultValue,
    serializer: (value) => String(value),
    deserializer: (value) => Number(value)
  });
}

export function useLocalStorageBoolean(key: string, defaultValue: boolean = false) {
  return useLocalStorage(key, {
    defaultValue,
    serializer: (value) => String(value),
    deserializer: (value) => value === 'true'
  });
}

// Hook for managing localStorage with expiration
export function useLocalStorageWithExpiry<T>(
  key: string,
  defaultValue: T,
  ttl: number // Time to live in milliseconds
): [T | null, (value: T) => void, () => void] {
  const [value, setValue, removeValue] = useLocalStorage<{ data: T; expiry: number }>(key, {
    defaultValue: { data: defaultValue, expiry: 0 }
  });

  const isExpired = value.expiry < Date.now();
  const currentValue = isExpired ? null : value.data;

  const setValueWithExpiry = useCallback((newValue: T) => {
    setValue({
      data: newValue,
      expiry: Date.now() + ttl
    });
  }, [setValue, ttl]);

  return [currentValue, setValueWithExpiry, removeValue];
}

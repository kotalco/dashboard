import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string): T | null {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setStoredValue(null);
    const handleStorageChange = (event: CustomEvent) => {
      if (event.detail.key === key) {
        setStoredValue(null);
        setTimeout(() => {
          setStoredValue(JSON.parse(event.detail.value));
        }, 0);
      }
    };

    window.addEventListener(
      "local-storage",
      handleStorageChange as EventListener
    );

    return () =>
      window.removeEventListener(
        "local-storage",
        handleStorageChange as EventListener
      );
  }, [key]);

  return storedValue;
}

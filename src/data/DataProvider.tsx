import { createContext, use, useEffect, useState, type ReactNode } from 'react';
import type { Dish, Restaurant } from './types'; // change to wherever your types live

type AppData = { dishes: Dish[]; restaurants: Restaurant[] };

const DataContext = createContext<AppData | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/dishes').then((r) => r.json()),
      fetch('/api/restaurants').then((r) => r.json()),
    ])
      .then(([dishes, restaurants]) => setData({ dishes, restaurants }))
      .catch(() => setError('Could not load data. Is the API server running?'));
  }, []);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading…</p>;

  return <DataContext value={data}>{children}</DataContext>;
}

export function useData() {
  const ctx = use(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
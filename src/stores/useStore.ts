'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Animal, Seller } from '@/lib/types';

interface StoreState {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  currentSeller: Seller | null;
  setCurrentSeller: (seller: Seller | null) => void;

  filterCategory: string;
  filterCity: string;
  filterMinPrice: number;
  filterMaxPrice: number;
  filterVaccinated: boolean;
  filterPedigree: boolean;
  filterGender: string;
  sortBy: string;
  searchQuery: string;
  setFilter: (key: string, value: string | number | boolean) => void;
  resetFilters: () => void;

  pendingAnimals: Animal[];
  addPendingAnimal: (animal: Animal) => void;
  updateAnimal: (id: string, updates: Partial<Animal>) => void;
  markAsSold: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (id) => {
        const favs = get().favorites;
        set({ favorites: favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id] });
      },
      isFavorite: (id) => get().favorites.includes(id),

      currentSeller: null,
      setCurrentSeller: (seller) => set({ currentSeller: seller }),

      filterCategory: '',
      filterCity: '',
      filterMinPrice: 0,
      filterMaxPrice: 0,
      filterVaccinated: false,
      filterPedigree: false,
      filterGender: '',
      sortBy: 'newest',
      searchQuery: '',
      setFilter: (key, value) => set({ [key]: value } as Partial<StoreState>),
      resetFilters: () => set({ filterCategory: '', filterCity: '', filterMinPrice: 0, filterMaxPrice: 0, filterVaccinated: false, filterPedigree: false, filterGender: '', sortBy: 'newest', searchQuery: '' }),

      pendingAnimals: [],
      addPendingAnimal: (animal) => set((state) => ({ pendingAnimals: [...state.pendingAnimals, animal] })),
      updateAnimal: (id, updates) =>
        set((state) => ({
          pendingAnimals: state.pendingAnimals.map((a) =>
            a.id === id ? { ...a, ...updates, status: 'pending', updatedAt: new Date() } : a
          ),
        })),
      markAsSold: (id) =>
        set((state) => ({
          pendingAnimals: state.pendingAnimals.map((a) =>
            a.id === id ? { ...a, status: 'sold', updatedAt: new Date() } : a
          ),
        })),
    }),
    {
      name: 'animalsouk-store',
      partialize: (state) => ({ favorites: state.favorites, currentSeller: state.currentSeller, pendingAnimals: state.pendingAnimals }),
    }
  )
);

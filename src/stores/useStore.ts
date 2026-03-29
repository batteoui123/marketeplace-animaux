'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Animal, Seller, Promotion } from '@/lib/types';

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

  // Admin actions
  deletedSellerIds: string[];
  deleteSeller: (id: string) => void;
  verifiedSellerIds: string[];
  toggleSellerVerified: (id: string) => void;
  adminApprovedIds: string[];
  adminRejected: Record<string, string>; // id -> reason
  adminApprove: (id: string) => void;
  adminReject: (id: string, reason: string) => void;
  adminDeleteAnimal: (id: string) => void;
  adminDeletedAnimalIds: string[];

  // Promotions
  promotions: Promotion[];
  addPromotion: (promo: Promotion) => void;
  togglePromotion: (id: string) => void;
  deletePromotion: (id: string) => void;
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

      // Admin
      deletedSellerIds: [],
      deleteSeller: (id) =>
        set((state) => ({ deletedSellerIds: [...state.deletedSellerIds, id] })),
      verifiedSellerIds: [],
      toggleSellerVerified: (id) =>
        set((state) => ({
          verifiedSellerIds: state.verifiedSellerIds.includes(id)
            ? state.verifiedSellerIds.filter((s) => s !== id)
            : [...state.verifiedSellerIds, id],
        })),
      adminApprovedIds: [],
      adminRejected: {},
      adminApprove: (id) =>
        set((state) => ({ adminApprovedIds: [...state.adminApprovedIds, id] })),
      adminReject: (id, reason) =>
        set((state) => ({ adminRejected: { ...state.adminRejected, [id]: reason } })),
      adminDeleteAnimal: (id) =>
        set((state) => ({ adminDeletedAnimalIds: [...state.adminDeletedAnimalIds, id] })),
      adminDeletedAnimalIds: [],

      // Promotions
      promotions: [],
      addPromotion: (promo) =>
        set((state) => ({ promotions: [...state.promotions, promo] })),
      togglePromotion: (id) =>
        set((state) => ({
          promotions: state.promotions.map((p) =>
            p.id === id ? { ...p, active: !p.active } : p
          ),
        })),
      deletePromotion: (id) =>
        set((state) => ({ promotions: state.promotions.filter((p) => p.id !== id) })),
    }),
    {
      name: 'animalsouk-store',
      partialize: (state) => ({
        favorites: state.favorites,
        currentSeller: state.currentSeller,
        pendingAnimals: state.pendingAnimals,
        deletedSellerIds: state.deletedSellerIds,
        verifiedSellerIds: state.verifiedSellerIds,
        adminApprovedIds: state.adminApprovedIds,
        adminRejected: state.adminRejected,
        adminDeletedAnimalIds: state.adminDeletedAnimalIds,
        promotions: state.promotions,
      }),
    }
  )
);

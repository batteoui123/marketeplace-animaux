'use client';

import { useTranslations } from 'next-intl';
import { useStore } from '@/stores/useStore';
import { MOCK_ANIMALS } from '@/lib/mock-data';
import AnimalGrid from '@/components/animals/AnimalGrid';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function FavoritesPage() {
  const t = useTranslations();
  const favorites = useStore((s) => s.favorites);
  const animals = MOCK_ANIMALS.filter((a) => favorites.includes(a.id) && a.status === 'approved');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">❤️</span>
          <h1 className="text-xl font-bold text-gray-900">{t('nav.favorites')}</h1>
          <span className="text-sm text-gray-400">({favorites.length})</span>
        </div>
        <AnimalGrid animals={animals} emptyMessage={t('animal.no_results_desc')} />
      </main>
      <Footer />
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { useStore } from '@/stores/useStore';
import { MOCK_ANIMALS } from '@/lib/mock-data';
import AnimalGrid from '@/components/animals/AnimalGrid';
import AnimalFilters from '@/components/animals/AnimalFilters';
import SearchBar from '@/components/common/SearchBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Locale } from '@/lib/types';
import { getLocalizedText } from '@/lib/utils';
import { Suspense } from 'react';
import { AnimalGridSkeleton } from '@/components/animals/AnimalCardSkeleton';

function AnimalsContent() {
  const t = useTranslations();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params.locale as Locale) ?? 'ar';
  const {
    filterCategory, filterCity, filterMinPrice, filterMaxPrice,
    filterVaccinated, filterPedigree, filterGender, sortBy,
  } = useStore();

  const q = searchParams.get('q') ?? '';

  const filtered = MOCK_ANIMALS
    .filter((a) => {
      if (a.status !== 'approved') return false;
      if (filterCategory && a.category !== filterCategory) return false;
      if (filterCity && a.city !== filterCity) return false;
      if (filterMinPrice > 0 && a.price < filterMinPrice) return false;
      if (filterMaxPrice > 0 && a.price > filterMaxPrice) return false;
      if (filterVaccinated && !a.vaccinated) return false;
      if (filterPedigree && !a.pedigree) return false;
      if (filterGender && a.gender !== filterGender) return false;
      if (q) {
        const query = q.toLowerCase();
        const title = getLocalizedText(a.title, locale).toLowerCase();
        const desc = getLocalizedText(a.description, locale).toLowerCase();
        if (!title.includes(query) && !desc.includes(query) && !(a.breed ?? '').toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <>
      <div className="mb-6">
        <SearchBar initialValue={q} />
      </div>
      <AnimalFilters />
      <div className="text-sm text-gray-500 mb-4">
        {filtered.length} {locale === 'ar' ? 'إعلان' : locale === 'fr' ? 'annonce(s)' : 'listing(s)'}
      </div>
      <AnimalGrid animals={filtered} emptyMessage={t('animal.no_results_desc')} />
    </>
  );
}

export default function AnimalsPage() {
  const t = useTranslations();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-xl font-bold text-gray-900 mb-6">{t('nav.animals')}</h1>
        <Suspense fallback={<AnimalGridSkeleton count={8} />}>
          <AnimalsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

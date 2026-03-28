'use client';

import { useTranslations } from 'next-intl';
import { useStore } from '@/stores/useStore';
import { CATEGORIES, CITIES } from '@/lib/constants';
import { useParams } from 'next/navigation';
import type { Locale } from '@/lib/types';
import { getLocalizedText } from '@/lib/utils';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

export default function AnimalFilters() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as Locale) ?? 'ar';
  const { filterCategory, filterCity, filterMinPrice, filterMaxPrice, setFilter, resetFilters } =
    useStore();
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    filterCategory || filterCity || filterMinPrice > 0 || filterMaxPrice > 0;

  return (
    <div className="mb-6">
      {/* Mobile toggle */}
      <div className="flex items-center justify-between mb-3 md:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl px-4 py-2 bg-white"
        >
          <SlidersHorizontal size={16} />
          {t('common.filter')}
          {hasActiveFilters && (
            <span className="bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              !
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-red-500 font-medium"
          >
            <X size={14} /> {t('common.cancel')}
          </button>
        )}
      </div>

      <div className={`${showFilters ? 'block' : 'hidden'} md:flex flex-col md:flex-row gap-3`}>
        {/* Category */}
        <select
          value={filterCategory}
          onChange={(e) => setFilter('filterCategory', e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">
            {t('common.all')} {t('nav.categories')}
          </option>
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.emoji} {getLocalizedText(cat.label, locale)}
            </option>
          ))}
        </select>

        {/* City */}
        <select
          value={filterCity}
          onChange={(e) => setFilter('filterCity', e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">
            {t('common.all')}{' '}
            {locale === 'ar' ? 'المدن' : locale === 'fr' ? 'les villes' : 'cities'}
          </option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* Min price */}
        <input
          type="number"
          placeholder={
            locale === 'ar'
              ? 'سعر أدنى (MAD)'
              : locale === 'fr'
              ? 'Prix min (MAD)'
              : 'Min price (MAD)'
          }
          value={filterMinPrice || ''}
          onChange={(e) => setFilter('filterMinPrice', Number(e.target.value))}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          min={0}
        />

        {/* Max price */}
        <input
          type="number"
          placeholder={
            locale === 'ar'
              ? 'سعر أقصى (MAD)'
              : locale === 'fr'
              ? 'Prix max (MAD)'
              : 'Max price (MAD)'
          }
          value={filterMaxPrice || ''}
          onChange={(e) => setFilter('filterMaxPrice', Number(e.target.value))}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          min={0}
        />

        {/* Reset — desktop only */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="hidden md:flex items-center gap-1 px-4 py-2.5 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            <X size={16} /> {t('common.cancel')}
          </button>
        )}
      </div>
    </div>
  );
}

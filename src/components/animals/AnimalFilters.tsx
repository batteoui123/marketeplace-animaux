'use client';

import { useTranslations } from 'next-intl';
import { useStore } from '@/stores/useStore';
import { CATEGORIES, CITIES } from '@/lib/constants';
import { useParams } from 'next/navigation';
import type { Locale } from '@/lib/types';
import { getLocalizedText } from '@/lib/utils';
import { SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

export default function AnimalFilters() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as Locale) ?? 'ar';
  const {
    filterCategory, filterCity, filterMinPrice, filterMaxPrice,
    filterVaccinated, filterPedigree, filterGender, sortBy,
    setFilter, resetFilters,
  } = useStore();
  const [showFilters, setShowFilters] = useState(false);

  const activeCount = [
    filterCategory, filterCity,
    filterMinPrice > 0, filterMaxPrice > 0,
    filterVaccinated, filterPedigree, filterGender,
  ].filter(Boolean).length;

  const selectCls = "flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500";
  const inputCls = "flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div className="mb-6">
      {/* ── Category chips — horizontal scroll on mobile ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scroll-hide mb-3">
        <button
          onClick={() => setFilter('filterCategory', '')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            !filterCategory
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
          }`}
        >
          {t('common.all')}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setFilter('filterCategory', filterCategory === cat.slug ? '' : cat.slug)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterCategory === cat.slug
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{getLocalizedText(cat.label, locale)}</span>
          </button>
        ))}
      </div>

      {/* ── Controls row: Sort + Filter toggle ── */}
      <div className="flex items-center gap-2 mb-3">
        {/* Sort dropdown */}
        <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 bg-white text-sm">
          <ArrowUpDown size={14} className="text-gray-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value)}
            className="bg-transparent text-gray-700 text-sm focus:outline-none cursor-pointer"
            aria-label={t('common.sort')}
          >
            <option value="newest">{t('common.newest')}</option>
            <option value="price_asc">{t('common.price_asc')}</option>
            <option value="price_desc">{t('common.price_desc')}</option>
          </select>
        </div>

        {/* Filter toggle — mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl px-4 py-2 bg-white hover:border-green-400 transition-colors"
          aria-expanded={showFilters}
        >
          <SlidersHorizontal size={16} />
          {t('common.filter')}
          {activeCount > 0 && (
            <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-red-500 font-medium ms-auto"
            aria-label="Réinitialiser les filtres"
          >
            <X size={14} /> {t('common.cancel')}
          </button>
        )}
      </div>

      {/* ── Advanced filters panel ── */}
      <div className={`${showFilters ? 'block' : 'hidden'} space-y-3`}>
        <div className="flex flex-col md:flex-row gap-3">
          {/* City */}
          <select
            value={filterCity}
            onChange={(e) => setFilter('filterCity', e.target.value)}
            className={selectCls}
            aria-label={locale === 'ar' ? 'المدينة' : locale === 'fr' ? 'Ville' : 'City'}
          >
            <option value="">
              {t('common.all')}{' '}
              {locale === 'ar' ? 'المدن' : locale === 'fr' ? 'les villes' : 'cities'}
            </option>
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {/* Gender */}
          <select
            value={filterGender}
            onChange={(e) => setFilter('filterGender', e.target.value)}
            className={selectCls}
            aria-label={t('animal.gender')}
          >
            <option value="">{t('animal.gender')}</option>
            <option value="male">{t('animal.male')}</option>
            <option value="female">{t('animal.female')}</option>
          </select>

          {/* Min price */}
          <input
            type="number"
            placeholder={locale === 'ar' ? 'سعر أدنى (MAD)' : locale === 'fr' ? 'Prix min (MAD)' : 'Min price (MAD)'}
            value={filterMinPrice || ''}
            onChange={(e) => setFilter('filterMinPrice', Number(e.target.value))}
            className={inputCls}
            min={0}
            aria-label="Prix minimum"
          />

          {/* Max price */}
          <input
            type="number"
            placeholder={locale === 'ar' ? 'سعر أقصى (MAD)' : locale === 'fr' ? 'Prix max (MAD)' : 'Max price (MAD)'}
            value={filterMaxPrice || ''}
            onChange={(e) => setFilter('filterMaxPrice', Number(e.target.value))}
            className={inputCls}
            min={0}
            aria-label="Prix maximum"
          />
        </div>

        {/* Toggle chips: Vacciné / Pedigree */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('filterVaccinated', !filterVaccinated)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterVaccinated
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'
            }`}
          >
            💉 {t('animal.vaccinated_filter')}
          </button>
          <button
            onClick={() => setFilter('filterPedigree', !filterPedigree)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterPedigree
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400'
            }`}
          >
            🏆 {t('animal.pedigree_filter')}
          </button>
        </div>
      </div>
    </div>
  );
}

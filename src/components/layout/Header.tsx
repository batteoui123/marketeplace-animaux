'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Heart, PlusCircle, User } from 'lucide-react';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useStore } from '@/stores/useStore';

export default function Header() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [menuOpen, setMenuOpen] = useState(false);
  const currentSeller = useStore((s) => s.currentSeller);
  const favorites = useStore((s) => s.favorites);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🐾</span>
          <span className="font-bold text-green-700 text-lg hidden sm:block">AnimalSouk</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href={`/${locale}/animals`} className="hover:text-green-700 transition-colors">
            {t('nav.animals')}
          </Link>
          <Link href={`/${locale}/categories`} className="hover:text-green-700 transition-colors">
            {t('nav.categories')}
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/favorites`}
            className="relative p-2 text-gray-600 hover:text-green-700 transition-colors"
            aria-label={t('nav.favorites')}
          >
            <Heart size={20} />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -end-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          <LanguageSwitcher />

          {currentSeller ? (
            <Link
              href={`/${locale}/seller/dashboard`}
              className="hidden md:flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <User size={16} />
              {t('nav.dashboard')}
            </Link>
          ) : (
            <Link
              href={`/${locale}/seller/login`}
              className="hidden md:flex items-center gap-1.5 border border-green-600 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              {t('nav.login')}
            </Link>
          )}

          <Link
            href={`/${locale}/seller/dashboard/new`}
            className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <PlusCircle size={16} />
            <span className="hidden sm:block">{t('nav.postAd')}</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium text-gray-700">
          <Link href={`/${locale}/animals`} onClick={() => setMenuOpen(false)} className="hover:text-green-700">
            {t('nav.animals')}
          </Link>
          <Link href={`/${locale}/categories`} onClick={() => setMenuOpen(false)} className="hover:text-green-700">
            {t('nav.categories')}
          </Link>
          {currentSeller ? (
            <Link href={`/${locale}/seller/dashboard`} onClick={() => setMenuOpen(false)} className="hover:text-green-700">
              {t('nav.dashboard')}
            </Link>
          ) : (
            <Link href={`/${locale}/seller/login`} onClick={() => setMenuOpen(false)} className="hover:text-green-700">
              {t('nav.login')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

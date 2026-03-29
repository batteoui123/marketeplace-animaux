'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Heart, PlusCircle, User, LogOut, ChevronDown } from 'lucide-react';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useStore } from '@/stores/useStore';

export default function Header() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [promoDismissed, setPromoDismissed] = useState(false);
  const currentSeller = useStore((s) => s.currentSeller);
  const setCurrentSeller = useStore((s) => s.setCurrentSeller);
  const favorites = useStore((s) => s.favorites);

  const logout = () => {
    setCurrentSeller(null);
    setUserOpen(false);
    router.push(`/${locale}`);
  };

  return (
    <>
      {/* Promo banner — static, dismissible */}
      {!promoDismissed && (
        <div className="bg-green-700 text-white text-xs font-medium py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <p className="flex-1 text-center">
              🎉 {t('home.promo_text')}
            </p>
            <button
              onClick={() => setPromoDismissed(true)}
              className="shrink-0 p-0.5 hover:bg-white/20 rounded transition-colors"
              aria-label="Fermer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-500">
              <span className="text-lg">🐾</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-[#1B2A4A] text-lg tracking-tight">Animal</span>
              <span className="font-extrabold text-green-600 text-lg tracking-tight">Souk</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: `/${locale}`, label: t('nav.home') },
              { href: `/${locale}/animals`, label: t('nav.animals') },
              { href: `/${locale}/categories`, label: t('nav.categories') },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/favorites`}
              className="relative p-2 text-slate-500 hover:text-red-500 transition-colors"
              aria-label={t('nav.favorites')}
            >
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -end-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <LanguageSwitcher />

            {currentSeller ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#1B2A4A] border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold">
                    {currentSeller.name.charAt(0)}
                  </div>
                  <span className="max-w-24 truncate">{currentSeller.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {userOpen && (
                  <div className="absolute end-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                    <Link href={`/${locale}/seller/dashboard`} onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700">
                      <User size={15} /> {t('nav.dashboard')}
                    </Link>
                    <button onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                      <LogOut size={15} /> {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href={`/${locale}/seller/login`}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 border border-green-600 rounded-xl hover:bg-green-50 transition-colors">
                <User size={15} /> {t('nav.login')}
              </Link>
            )}

            <Link
              href={`/${locale}/seller/dashboard/new`}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm bg-green-600 hover:bg-green-700"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:block">{t('nav.postAd')}</span>
            </Link>

            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-2 text-sm font-medium">
            <Link href={`/${locale}`} onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-slate-700 hover:text-green-700 hover:bg-green-50 rounded-xl">{t('nav.home')}</Link>
            <Link href={`/${locale}/animals`} onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-slate-700 hover:text-green-700 hover:bg-green-50 rounded-xl">{t('nav.animals')}</Link>
            <Link href={`/${locale}/categories`} onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-slate-700 hover:text-green-700 hover:bg-green-50 rounded-xl">{t('nav.categories')}</Link>
            {currentSeller ? (
              <>
                <Link href={`/${locale}/seller/dashboard`} onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-slate-700 hover:text-green-700 hover:bg-green-50 rounded-xl">{t('nav.dashboard')}</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="text-start px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl">{t('nav.logout')}</button>
              </>
            ) : (
              <Link href={`/${locale}/seller/login`} onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-slate-700 hover:text-green-700 hover:bg-green-50 rounded-xl">{t('nav.login')}</Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}

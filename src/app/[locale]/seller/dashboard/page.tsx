'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PlusCircle, Clock, CheckCircle, XCircle, Package, LogOut } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { MOCK_ANIMALS } from '@/lib/mock-data';
import type { Locale } from '@/lib/types';
import { getLocalizedText, formatPrice } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const STATUS_ICON = {
  pending: <Clock size={14} className="text-amber-500" />,
  approved: <CheckCircle size={14} className="text-green-500" />,
  rejected: <XCircle size={14} className="text-red-500" />,
  sold: <Package size={14} className="text-gray-400" />,
};

const STATUS_BG = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  sold: 'bg-gray-100 text-gray-600',
};

export default function DashboardPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as Locale) ?? 'ar';
  const router = useRouter();
  const currentSeller = useStore((s) => s.currentSeller);
  const setCurrentSeller = useStore((s) => s.setCurrentSeller);
  const pendingAnimals = useStore((s) => s.pendingAnimals);

  useEffect(() => {
    if (!currentSeller) router.push(`/${locale}/seller/login`);
  }, [currentSeller, locale, router]);

  if (!currentSeller) return null;

  const myAnimals = [
    ...MOCK_ANIMALS.filter((a) => a.sellerId === currentSeller.id),
    ...pendingAnimals.filter((a) => a.sellerId === currentSeller.id),
  ];

  const counts = {
    total: myAnimals.length,
    approved: myAnimals.filter((a) => a.status === 'approved').length,
    pending: myAnimals.filter((a) => a.status === 'pending').length,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Profile card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl shrink-0">
            {currentSeller.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-900 text-lg">{currentSeller.name}</div>
            <div className="text-sm text-gray-500">{currentSeller.phone} · {currentSeller.city}</div>
          </div>
          <button
            onClick={() => { setCurrentSeller(null); router.push(`/${locale}`); }}
            className="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors shrink-0"
          >
            <LogOut size={15} /> {t('nav.logout')}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">{counts.total}</div>
            <div className="text-xs text-gray-500 mt-1">{t('seller.total_ads')}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-green-600">{counts.approved}</div>
            <div className="text-xs text-gray-500 mt-1">{t('seller.active_ads')}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-amber-500">{counts.pending}</div>
            <div className="text-xs text-gray-500 mt-1">{t('seller.pending_ads')}</div>
          </div>
        </div>

        {/* Ads list header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">{t('seller.dashboard_title')}</h2>
          <Link
            href={`/${locale}/seller/dashboard/new`}
            className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <PlusCircle size={16} /> {t('seller.new_ad')}
          </Link>
        </div>

        {myAnimals.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-4">📭</div>
            <p>{locale === 'ar' ? 'لا توجد إعلانات بعد' : locale === 'fr' ? "Aucune annonce pour l'instant" : 'No listings yet'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myAnimals.map((animal) => (
              <div key={animal.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {animal.photos[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={animal.photos[0]} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm line-clamp-1">
                    {getLocalizedText(animal.title, locale)}
                  </div>
                  <div className="text-green-700 font-bold text-sm mt-0.5">{formatPrice(animal.price)}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {STATUS_ICON[animal.status]}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BG[animal.status]}`}>
                      {t(`animal.status_${animal.status}`)}
                    </span>
                  </div>
                </div>
                {animal.status === 'approved' && (
                  <Link
                    href={`/${locale}/animals/${animal.id}`}
                    className="text-xs text-green-700 border border-green-200 px-3 py-1.5 rounded-xl hover:bg-green-50 transition-colors shrink-0"
                  >
                    {locale === 'ar' ? 'عرض' : locale === 'fr' ? 'Voir' : 'View'}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

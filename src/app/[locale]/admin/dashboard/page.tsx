'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { CheckCircle, XCircle, Users, BarChart3, Clock } from 'lucide-react';
import { MOCK_ANIMALS, MOCK_SELLERS } from '@/lib/mock-data';
import { useStore } from '@/stores/useStore';
import type { Animal, Locale } from '@/lib/types';
import { getLocalizedText, formatPrice } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AdminDashboard() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as Locale) ?? 'ar';
  const pendingAnimals = useStore((s) => s.pendingAnimals);
  const [tab, setTab] = useState<'pending' | 'sellers' | 'stats'>('pending');
  const [localAnimals, setLocalAnimals] = useState<Animal[]>([...MOCK_ANIMALS, ...pendingAnimals]);
  const [rejectId, setRejectId] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const pending = localAnimals.filter((a) => a.status === 'pending');
  const approved = localAnimals.filter((a) => a.status === 'approved');

  const approve = (id: string) => {
    setLocalAnimals((prev) => prev.map((a) => a.id === id ? { ...a, status: 'approved' } : a));
  };

  const reject = (id: string) => {
    setLocalAnimals((prev) => prev.map((a) => a.id === id ? { ...a, status: 'rejected', rejectionReason: rejectReason } : a));
    setRejectId('');
    setRejectReason('');
  };

  const tabs = [
    { id: 'pending', label: `${t('admin.pending')} (${pending.length})`, icon: <Clock size={15} /> },
    { id: 'sellers', label: `${t('admin.all_sellers')} (${MOCK_SELLERS.length})`, icon: <Users size={15} /> },
    { id: 'stats', label: locale === 'ar' ? 'إحصائيات' : locale === 'fr' ? 'Statistiques' : 'Stats', icon: <BarChart3 size={15} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🛡️</span>
          <h1 className="text-xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">{localAnimals.length}</div>
            <div className="text-xs text-gray-500 mt-1">{t('admin.total_ads')}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-amber-500">{pending.length}</div>
            <div className="text-xs text-gray-500 mt-1">{t('admin.pending_review')}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-green-600">{approved.length}</div>
            <div className="text-xs text-gray-500 mt-1">{t('admin.active_sellers')}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab_) => (
            <button
              key={tab_.id}
              onClick={() => setTab(tab_.id as 'pending' | 'sellers' | 'stats')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                tab === tab_.id ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab_.icon} {tab_.label}
            </button>
          ))}
        </div>

        {/* Pending tab */}
        {tab === 'pending' && (
          <div className="space-y-3">
            {pending.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">✅</div>
                <p>{locale === 'ar' ? 'لا توجد إعلانات في الانتظار' : locale === 'fr' ? 'Aucune annonce en attente' : 'No pending listings'}</p>
              </div>
            ) : pending.map((animal) => (
              <div key={animal.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {animal.photos[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={animal.photos[0]} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">
                      {getLocalizedText(animal.title, locale)}
                    </div>
                    <div className="text-green-700 font-bold text-sm">{formatPrice(animal.price)}</div>
                    <div className="text-xs text-gray-400">{animal.city} · {animal.category}</div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => approve(animal.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-xs font-medium hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle size={13} /> {t('admin.approve')}
                    </button>
                    <button
                      onClick={() => setRejectId(animal.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-medium hover:bg-red-100 transition-colors"
                    >
                      <XCircle size={13} /> {t('admin.reject')}
                    </button>
                  </div>
                </div>

                {/* Reject reason input */}
                {rejectId === animal.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder={t('admin.rejection_reason')}
                      className="flex-1 px-3 py-2 border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                    />
                    <button onClick={() => reject(animal.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">
                      {t('common.confirm')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Sellers tab */}
        {tab === 'sellers' && (
          <div className="space-y-3">
            {MOCK_SELLERS.map((seller) => {
              const sellerAds = localAnimals.filter((a) => a.sellerId === seller.id);
              return (
                <div key={seller.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold shrink-0">
                    {seller.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{seller.name}</div>
                    <div className="text-xs text-gray-500">{seller.phone} · {seller.city}</div>
                  </div>
                  <div className="text-end shrink-0">
                    <div className="font-bold text-gray-900 text-sm">{sellerAds.length}</div>
                    <div className="text-xs text-gray-400">{locale === 'ar' ? 'إعلان' : locale === 'fr' ? 'annonce(s)' : 'listing(s)'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats tab */}
        {tab === 'stats' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['cats', 'dogs', 'birds', 'fish', 'horses', 'livestock', 'rodents', 'reptiles', 'turtles', 'parrots', 'other'].map((slug) => {
              const count = localAnimals.filter((a) => a.category === slug && a.status === 'approved').length;
              return (
                <div key={slug} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                  <span className="text-2xl">
                    {['🐱','🐶','🐦','🐟','🐴','🐄','🐰','🦎','🐢','🦜','🐝'][['cats','dogs','birds','fish','horses','livestock','rodents','reptiles','turtles','parrots','other'].indexOf(slug)]}
                  </span>
                  <div>
                    <div className="font-bold text-gray-900">{count}</div>
                    <div className="text-xs text-gray-400 capitalize">{slug}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

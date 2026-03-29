'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  LayoutDashboard, Clock, List, Users, Megaphone,
  CheckCircle, XCircle, Trash2, Eye, Search,
  ShieldCheck, ShieldOff, ChevronLeft, ChevronRight,
  Plus, ToggleLeft, ToggleRight, Tag, Gift, Star,
  TrendingUp, AlertCircle, Package, Phone, Mail, MapPin, Calendar,
  X,
} from 'lucide-react';
import { MOCK_ANIMALS, MOCK_SELLERS } from '@/lib/mock-data';
import { CATEGORIES } from '@/lib/constants';
import { useStore } from '@/stores/useStore';
import type { Animal, Locale, Promotion } from '@/lib/types';
import { getLocalizedText, formatPrice, getSellerBadges } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type Tab = 'overview' | 'pending' | 'listings' | 'sellers' | 'promotions';

/* ───────────────────── helpers ───────────────────── */
function statusColor(status: string) {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-700';
    case 'pending': return 'bg-amber-100 text-amber-700';
    case 'rejected': return 'bg-red-100 text-red-700';
    case 'sold': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function statusLabel(status: string, locale: Locale) {
  const labels: Record<string, Record<Locale, string>> = {
    approved: { ar: 'معتمد', fr: 'Approuvé', en: 'Approved' },
    pending: { ar: 'قيد المراجعة', fr: 'En attente', en: 'Pending' },
    rejected: { ar: 'مرفوض', fr: 'Rejeté', en: 'Rejected' },
    sold: { ar: 'مباع', fr: 'Vendu', en: 'Sold' },
  };
  return labels[status]?.[locale] ?? status;
}

function formatDate(date: Date, locale: Locale) {
  return new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

/* ───────────────────── MAIN COMPONENT ───────────────────── */
export default function AdminDashboard() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as Locale) ?? 'ar';

  const pendingAnimals = useStore((s) => s.pendingAnimals);
  const deletedSellerIds = useStore((s) => s.deletedSellerIds);
  const verifiedSellerIds = useStore((s) => s.verifiedSellerIds);
  const adminApprovedIds = useStore((s) => s.adminApprovedIds);
  const adminRejected = useStore((s) => s.adminRejected);
  const adminDeletedAnimalIds = useStore((s) => s.adminDeletedAnimalIds);
  const promotions = useStore((s) => s.promotions);

  const adminApprove = useStore((s) => s.adminApprove);
  const adminReject = useStore((s) => s.adminReject);
  const adminDeleteAnimal = useStore((s) => s.adminDeleteAnimal);
  const deleteSeller = useStore((s) => s.deleteSeller);
  const toggleSellerVerified = useStore((s) => s.toggleSellerVerified);
  const addPromotion = useStore((s) => s.addPromotion);
  const togglePromotion = useStore((s) => s.togglePromotion);
  const deletePromotion = useStore((s) => s.deletePromotion);

  const [tab, setTab] = useState<Tab>('overview');
  const [detailAnimal, setDetailAnimal] = useState<Animal | null>(null);
  const [detailSellerId, setDetailSellerId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [listingSearch, setListingSearch] = useState('');
  const [listingStatus, setListingStatus] = useState('');
  const [sellerSearch, setSellerSearch] = useState('');
  const [confirmDeleteSeller, setConfirmDeleteSeller] = useState('');
  const [confirmDeleteAnimal, setConfirmDeleteAnimal] = useState('');
  const [toast, setToast] = useState('');
  const [showPromoForm, setShowPromoForm] = useState(false);

  // Merge mock + store animals, apply admin overrides
  const allAnimals = useMemo(() => {
    const merged = [...MOCK_ANIMALS, ...pendingAnimals];
    return merged
      .filter((a) => !adminDeletedAnimalIds.includes(a.id))
      .map((a) => {
        if (adminApprovedIds.includes(a.id)) return { ...a, status: 'approved' as const };
        if (adminRejected[a.id]) return { ...a, status: 'rejected' as const, rejectionReason: adminRejected[a.id] };
        return a;
      });
  }, [pendingAnimals, adminApprovedIds, adminRejected, adminDeletedAnimalIds]);

  const sellers = useMemo(() =>
    MOCK_SELLERS.filter((s) => !deletedSellerIds.includes(s.id)),
    [deletedSellerIds]
  );

  const pending = allAnimals.filter((a) => a.status === 'pending');
  const approved = allAnimals.filter((a) => a.status === 'approved');
  const rejected = allAnimals.filter((a) => a.status === 'rejected');
  const sold = allAnimals.filter((a) => a.status === 'sold');

  // Toast helper
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Action handlers
  const handleApprove = (id: string) => {
    adminApprove(id);
    showToast(t('admin.listing_approved'));
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) return;
    adminReject(id, rejectReason);
    setRejectId('');
    setRejectReason('');
    showToast(t('admin.listing_rejected'));
  };

  const handleDeleteAnimal = (id: string) => {
    adminDeleteAnimal(id);
    setConfirmDeleteAnimal('');
    setDetailAnimal(null);
    showToast(t('admin.listing_deleted'));
  };

  const handleDeleteSeller = (id: string) => {
    deleteSeller(id);
    setConfirmDeleteSeller('');
    setDetailSellerId(null);
    showToast(t('admin.seller_deleted'));
  };

  const handleVerify = (id: string) => {
    toggleSellerVerified(id);
  };

  const isVerified = (seller: { id: string; isVerified?: boolean }) =>
    verifiedSellerIds.includes(seller.id) ? !seller.isVerified : !!seller.isVerified;

  // Filter listings
  const filteredListings = useMemo(() => {
    let list = allAnimals;
    if (listingStatus) list = list.filter((a) => a.status === listingStatus);
    if (listingSearch.trim()) {
      const q = listingSearch.toLowerCase();
      list = list.filter((a) =>
        getLocalizedText(a.title, locale).toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allAnimals, listingStatus, listingSearch, locale]);

  // Filter sellers
  const filteredSellers = useMemo(() => {
    if (!sellerSearch.trim()) return sellers;
    const q = sellerSearch.toLowerCase();
    return sellers.filter((s) =>
      s.name.toLowerCase().includes(q) || s.phone.includes(q) || s.city.toLowerCase().includes(q)
    );
  }, [sellers, sellerSearch]);

  // Tabs config
  const tabItems: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: t('admin.overview'), icon: <LayoutDashboard size={16} /> },
    { id: 'pending', label: t('admin.pending'), icon: <Clock size={16} />, badge: pending.length },
    { id: 'listings', label: t('admin.all_listings'), icon: <List size={16} /> },
    { id: 'sellers', label: t('admin.all_sellers'), icon: <Users size={16} /> },
    { id: 'promotions', label: t('admin.promotions'), icon: <Megaphone size={16} /> },
  ];

  const getSeller = (sellerId: string) => MOCK_SELLERS.find((s) => s.id === sellerId);
  const getSellerAnimals = (sellerId: string) => allAnimals.filter((a) => a.sellerId === sellerId);

  const ChevronBack = locale === 'ar' ? ChevronRight : ChevronLeft;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">

        {/* ── Page title ── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
            <p className="text-xs text-gray-400">AnimalSouk</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 scroll-hide">
          {tabItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setDetailAnimal(null); setDetailSellerId(null); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === item.id
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              {item.icon}
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`ms-1 text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ${
                  tab === item.id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ════════════════ OVERVIEW TAB ════════════════ */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: t('admin.total_ads'), value: allAnimals.length, icon: <Package size={18} />, color: 'bg-blue-50 text-blue-600' },
                { label: t('admin.pending_review'), value: pending.length, icon: <Clock size={18} />, color: 'bg-amber-50 text-amber-600' },
                { label: t('admin.approved_count'), value: approved.length, icon: <CheckCircle size={18} />, color: 'bg-green-50 text-green-600' },
                { label: t('admin.sold_count'), value: sold.length, icon: <TrendingUp size={18} />, color: 'bg-purple-50 text-purple-600' },
                { label: t('admin.active_sellers'), value: sellers.length, icon: <Users size={18} />, color: 'bg-teal-50 text-teal-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>{stat.icon}</div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-[11px] text-gray-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions + Category breakdown */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Quick actions */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm mb-4">{t('admin.quick_actions')}</h3>
                <div className="space-y-2">
                  <button onClick={() => setTab('pending')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors text-start">
                    <Clock size={18} className="text-amber-600 shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{t('admin.review_pending')}</div>
                      <div className="text-xs text-gray-400">{pending.length} {t('admin.pending_review')}</div>
                    </div>
                    {locale === 'ar' ? <ChevronLeft size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                  </button>
                  <button onClick={() => setTab('sellers')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-start">
                    <Users size={18} className="text-blue-600 shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{t('admin.manage_sellers')}</div>
                      <div className="text-xs text-gray-400">{sellers.length} {t('admin.active_sellers')}</div>
                    </div>
                    {locale === 'ar' ? <ChevronLeft size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                  </button>
                  <button onClick={() => { setTab('promotions'); setShowPromoForm(true); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-start">
                    <Megaphone size={18} className="text-green-600 shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{t('admin.create_promo')}</div>
                      <div className="text-xs text-gray-400">{promotions.filter((p) => p.active).length} {t('admin.promo_active').toLowerCase()}</div>
                    </div>
                    {locale === 'ar' ? <ChevronLeft size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Category breakdown */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm mb-4">
                  {locale === 'ar' ? 'إحصائيات الفئات' : locale === 'fr' ? 'Répartition par catégorie' : 'Category Breakdown'}
                </h3>
                <div className="space-y-2.5">
                  {CATEGORIES.map((cat) => {
                    const count = approved.filter((a) => a.category === cat.slug).length;
                    const pct = approved.length > 0 ? (count / approved.length) * 100 : 0;
                    return (
                      <div key={cat.slug} className="flex items-center gap-2.5">
                        <Image src={cat.image} alt="" width={24} height={24} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <span className="text-xs text-gray-600 w-20 truncate">{getLocalizedText(cat.label, locale)}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-6 text-end">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent listings */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm mb-4">{t('admin.recent_activity')}</h3>
              <div className="space-y-2">
                {allAnimals.slice(0, 5).map((animal) => {
                  const seller = getSeller(animal.sellerId);
                  return (
                    <div key={animal.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => { setDetailAnimal(animal); setTab('listings'); }}>
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {animal.photos[0] && <Image src={animal.photos[0]} alt="" width={40} height={40} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{getLocalizedText(animal.title, locale)}</div>
                        <div className="text-[11px] text-gray-400">{seller?.name} · {animal.city}</div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor(animal.status)}`}>
                        {statusLabel(animal.status, locale)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ PENDING TAB ════════════════ */}
        {tab === 'pending' && !detailAnimal && (
          <div className="space-y-3">
            {pending.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle size={28} className="text-green-400" />
                </div>
                <p className="font-medium">{t('admin.no_pending')}</p>
              </div>
            ) : pending.map((animal) => {
              const seller = getSeller(animal.sellerId);
              return (
                <div key={animal.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 cursor-pointer" onClick={() => setDetailAnimal(animal)}>
                      {animal.photos[0] && <Image src={animal.photos[0]} alt="" width={80} height={80} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <button onClick={() => setDetailAnimal(animal)} className="font-semibold text-gray-900 text-sm hover:text-green-700 transition-colors text-start">
                        {getLocalizedText(animal.title, locale)}
                      </button>
                      <div className="text-green-700 font-bold text-sm mt-0.5">{formatPrice(animal.price, locale)}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{animal.city} · {animal.category}</div>
                      {seller && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-[10px] font-bold">{seller.name.charAt(0)}</div>
                          <span className="text-[11px] text-gray-500">{seller.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => setDetailAnimal(animal)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-100 transition-colors">
                        <Eye size={13} /> {t('admin.view_details')}
                      </button>
                      <button onClick={() => handleApprove(animal.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-xs font-medium hover:bg-green-100 transition-colors">
                        <CheckCircle size={13} /> {t('admin.approve')}
                      </button>
                      <button onClick={() => setRejectId(rejectId === animal.id ? '' : animal.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-medium hover:bg-red-100 transition-colors">
                        <XCircle size={13} /> {t('admin.reject')}
                      </button>
                    </div>
                  </div>
                  {rejectId === animal.id && (
                    <div className="mt-3 flex gap-2">
                      <input type="text" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder={t('admin.rejection_reason')} className="flex-1 px-3 py-2 border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                      <button onClick={() => handleReject(animal.id)} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">{t('common.confirm')}</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ════════════════ ALL LISTINGS TAB ════════════════ */}
        {tab === 'listings' && !detailAnimal && (
          <div className="space-y-4">
            {/* Search + filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={listingSearch} onChange={(e) => setListingSearch(e.target.value)} placeholder={t('admin.search_listings')} className="w-full ps-9 pe-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <select value={listingStatus} onChange={(e) => setListingStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">{t('admin.all_statuses')}</option>
                <option value="approved">{statusLabel('approved', locale)}</option>
                <option value="pending">{statusLabel('pending', locale)}</option>
                <option value="rejected">{statusLabel('rejected', locale)}</option>
                <option value="sold">{statusLabel('sold', locale)}</option>
              </select>
            </div>

            {/* Listing count */}
            <div className="text-xs text-gray-400">{filteredListings.length} {locale === 'ar' ? 'إعلان' : locale === 'fr' ? 'annonce(s)' : 'listing(s)'}</div>

            {filteredListings.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <AlertCircle size={28} className="mx-auto mb-3 text-gray-300" />
                <p>{t('admin.no_listings')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredListings.map((animal) => {
                  const seller = getSeller(animal.sellerId);
                  return (
                    <div key={animal.id} className="bg-white rounded-2xl p-3.5 border border-gray-100 flex items-center gap-3 hover:border-green-200 transition-colors">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 cursor-pointer" onClick={() => setDetailAnimal(animal)}>
                        {animal.photos[0] && <Image src={animal.photos[0]} alt="" width={56} height={56} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setDetailAnimal(animal)}>
                        <div className="font-semibold text-gray-900 text-sm truncate">{getLocalizedText(animal.title, locale)}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{seller?.name} · {animal.city} · {formatPrice(animal.price, locale)}</div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusColor(animal.status)}`}>
                        {statusLabel(animal.status, locale)}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {animal.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(animal.id)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors" title={t('admin.approve')}><CheckCircle size={16} /></button>
                            <button onClick={() => { setRejectId(animal.id); setDetailAnimal(animal); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title={t('admin.reject')}><XCircle size={16} /></button>
                          </>
                        )}
                        <button onClick={() => setDetailAnimal(animal)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title={t('admin.view_details')}><Eye size={16} /></button>
                        <button onClick={() => setConfirmDeleteAnimal(animal.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title={t('admin.delete_listing')}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════════════ ANIMAL DETAIL PANEL ════════════════ */}
        {detailAnimal && (tab === 'pending' || tab === 'listings') && (
          <div className="space-y-4">
            <button onClick={() => setDetailAnimal(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 transition-colors mb-2">
              <ChevronBack size={16} /> {t('admin.back_to_list')}
            </button>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Photos */}
              <div className="flex gap-1 overflow-x-auto scroll-hide bg-gray-100">
                {detailAnimal.photos.map((photo, i) => (
                  <div key={i} className="w-48 h-36 shrink-0 relative">
                    <Image src={photo} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>

              <div className="p-5 space-y-4">
                {/* Title + status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{getLocalizedText(detailAnimal.title, locale)}</h2>
                    <div className="text-green-700 font-bold text-lg mt-1">{formatPrice(detailAnimal.price, locale)}</div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${statusColor(detailAnimal.status)}`}>
                    {statusLabel(detailAnimal.status, locale)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">{getLocalizedText(detailAnimal.description, locale)}</p>

                {/* Details grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: locale === 'ar' ? 'الفئة' : locale === 'fr' ? 'Catégorie' : 'Category', value: detailAnimal.category },
                    { label: locale === 'ar' ? 'المدينة' : locale === 'fr' ? 'Ville' : 'City', value: detailAnimal.city },
                    { label: locale === 'ar' ? 'العمر' : locale === 'fr' ? 'Âge' : 'Age', value: detailAnimal.age || '—' },
                    { label: locale === 'ar' ? 'الجنس' : locale === 'fr' ? 'Sexe' : 'Gender', value: detailAnimal.gender ? (detailAnimal.gender === 'male' ? t('animal.male') : detailAnimal.gender === 'female' ? t('animal.female') : t('animal.unknown')) : '—' },
                    { label: locale === 'ar' ? 'السلالة' : locale === 'fr' ? 'Race' : 'Breed', value: detailAnimal.breed || '—' },
                    { label: locale === 'ar' ? 'اللون' : locale === 'fr' ? 'Couleur' : 'Color', value: detailAnimal.color || '—' },
                    { label: locale === 'ar' ? 'مطعم' : locale === 'fr' ? 'Vacciné' : 'Vaccinated', value: detailAnimal.vaccinated ? '✅' : '❌' },
                    { label: locale === 'ar' ? 'قابل للتفاوض' : locale === 'fr' ? 'Négociable' : 'Negotiable', value: detailAnimal.negotiable ? '✅' : '❌' },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide">{item.label}</div>
                      <div className="text-sm font-semibold text-gray-800 mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Seller info */}
                {(() => {
                  const seller = getSeller(detailAnimal.sellerId);
                  if (!seller) return null;
                  return (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{t('admin.seller_info')}</div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold shrink-0">{seller.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                            {seller.name}
                            {isVerified(seller) && <ShieldCheck size={14} className="text-blue-500" />}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-0.5"><Phone size={10} /> {seller.phone}</span>
                            <span className="flex items-center gap-0.5"><MapPin size={10} /> {seller.city}</span>
                          </div>
                        </div>
                        <button onClick={() => { setDetailSellerId(seller.id); setTab('sellers'); setDetailAnimal(null); }} className="text-xs text-green-600 font-medium hover:underline">{t('admin.seller_ads')}</button>
                      </div>
                    </div>
                  );
                })()}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                  {detailAnimal.status === 'pending' && (
                    <>
                      <button onClick={() => { handleApprove(detailAnimal.id); setDetailAnimal(null); }} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                        <CheckCircle size={15} /> {t('admin.approve')}
                      </button>
                      <button onClick={() => setRejectId(detailAnimal.id)} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                        <XCircle size={15} /> {t('admin.reject')}
                      </button>
                    </>
                  )}
                  <button onClick={() => setConfirmDeleteAnimal(detailAnimal.id)} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors ms-auto">
                    <Trash2 size={15} /> {t('admin.delete_listing')}
                  </button>
                </div>

                {/* Reject form */}
                {rejectId === detailAnimal.id && (
                  <div className="flex gap-2">
                    <input type="text" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder={t('admin.rejection_reason')} className="flex-1 px-3 py-2 border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                    <button onClick={() => { handleReject(detailAnimal.id); setDetailAnimal(null); }} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">{t('common.confirm')}</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ SELLERS TAB ════════════════ */}
        {tab === 'sellers' && !detailSellerId && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={sellerSearch} onChange={(e) => setSellerSearch(e.target.value)} placeholder={t('admin.search_sellers')} className="w-full ps-9 pe-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            {filteredSellers.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Users size={28} className="mx-auto mb-3 text-gray-300" />
                <p>{t('admin.no_sellers')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSellers.map((seller) => {
                  const sellerAds = getSellerAnimals(seller.id);
                  const verified = isVerified(seller);
                  const badges = getSellerBadges({ ...seller, isVerified: verified });
                  return (
                    <div key={seller.id} className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-green-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold shrink-0">{seller.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setDetailSellerId(seller.id)}>
                          <div className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                            {seller.name}
                            {verified && <ShieldCheck size={14} className="text-blue-500" />}
                            {badges.includes('top') && <Star size={13} className="text-amber-500 fill-amber-500" />}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                            <span>{seller.phone}</span>
                            <span>·</span>
                            <span>{seller.city}</span>
                            <span>·</span>
                            <span>{sellerAds.length} {locale === 'ar' ? 'إعلان' : locale === 'fr' ? 'ann.' : 'ads'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => handleVerify(seller.id)} className={`p-1.5 rounded-lg transition-colors ${verified ? 'hover:bg-amber-50 text-blue-500' : 'hover:bg-green-50 text-gray-400'}`} title={verified ? t('admin.unverify_seller') : t('admin.verify_seller')}>
                            {verified ? <ShieldCheck size={16} /> : <ShieldOff size={16} />}
                          </button>
                          <button onClick={() => setDetailSellerId(seller.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title={t('admin.view_details')}><Eye size={16} /></button>
                          <button onClick={() => setConfirmDeleteSeller(seller.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title={t('admin.delete_seller')}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════════════ SELLER DETAIL ════════════════ */}
        {tab === 'sellers' && detailSellerId && (() => {
          const seller = MOCK_SELLERS.find((s) => s.id === detailSellerId);
          if (!seller) return null;
          const sellerAds = getSellerAnimals(seller.id);
          const verified = isVerified(seller);
          return (
            <div className="space-y-4">
              <button onClick={() => setDetailSellerId(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 transition-colors">
                <ChevronBack size={16} /> {t('admin.back_to_list')}
              </button>

              {/* Seller profile card */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl font-bold shrink-0">{seller.name.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      {seller.name}
                      {verified && <ShieldCheck size={16} className="text-blue-500" />}
                    </div>
                    <div className="text-sm text-gray-400 space-y-1 mt-2">
                      <div className="flex items-center gap-2"><Phone size={13} /> {seller.phone}</div>
                      {seller.email && <div className="flex items-center gap-2"><Mail size={13} /> {seller.email}</div>}
                      <div className="flex items-center gap-2"><MapPin size={13} /> {seller.city}</div>
                      <div className="flex items-center gap-2"><Calendar size={13} /> {t('admin.member_since')} {formatDate(seller.createdAt, locale)}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => handleVerify(seller.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${verified ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                      {verified ? <><ShieldOff size={13} /> {t('admin.unverify_seller')}</> : <><ShieldCheck size={13} /> {t('admin.verify_seller')}</>}
                    </button>
                    <button onClick={() => setConfirmDeleteSeller(seller.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-medium hover:bg-red-100 transition-colors">
                      <Trash2 size={13} /> {t('admin.delete_seller')}
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mt-5 pt-4 border-t border-gray-100">
                  {[
                    { label: t('admin.total_ads'), value: sellerAds.length, color: 'text-blue-600' },
                    { label: t('admin.approved_count'), value: sellerAds.filter((a) => a.status === 'approved').length, color: 'text-green-600' },
                    { label: t('admin.pending_review'), value: sellerAds.filter((a) => a.status === 'pending').length, color: 'text-amber-600' },
                    { label: t('admin.sold_count'), value: sellerAds.filter((a) => a.status === 'sold').length, color: 'text-purple-600' },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-[10px] text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller ads list */}
              <h3 className="font-bold text-gray-900 text-sm">{t('admin.seller_ads')} ({sellerAds.length})</h3>
              <div className="space-y-2">
                {sellerAds.map((animal) => (
                  <div key={animal.id} className="bg-white rounded-2xl p-3.5 border border-gray-100 flex items-center gap-3 hover:border-green-200 transition-colors">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 cursor-pointer" onClick={() => { setDetailAnimal(animal); setTab('listings'); setDetailSellerId(null); }}>
                      {animal.photos[0] && <Image src={animal.photos[0]} alt="" width={48} height={48} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">{getLocalizedText(animal.title, locale)}</div>
                      <div className="text-xs text-gray-400">{formatPrice(animal.price, locale)} · {animal.city}</div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusColor(animal.status)}`}>
                      {statusLabel(animal.status, locale)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ════════════════ PROMOTIONS TAB ════════════════ */}
        {tab === 'promotions' && (
          <div className="space-y-4">
            {/* Create promo button */}
            {!showPromoForm && (
              <button onClick={() => setShowPromoForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                <Plus size={16} /> {t('admin.new_promotion')}
              </button>
            )}

            {/* Promo form */}
            {showPromoForm && <PromotionForm locale={locale} t={t} onSave={(promo) => { addPromotion(promo); setShowPromoForm(false); showToast(locale === 'ar' ? 'تم إنشاء العرض' : locale === 'fr' ? 'Promotion créée' : 'Promotion created'); }} onCancel={() => setShowPromoForm(false)} />}

            {/* Promos list */}
            {promotions.length === 0 && !showPromoForm ? (
              <div className="text-center py-16 text-gray-400">
                <Megaphone size={28} className="mx-auto mb-3 text-gray-300" />
                <p>{t('admin.no_promotions')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {promotions.map((promo) => (
                  <div key={promo.id} className={`bg-white rounded-2xl p-4 border transition-colors ${promo.active ? 'border-green-200 bg-green-50/30' : 'border-gray-100'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        promo.type === 'free_listing' ? 'bg-green-100 text-green-600' :
                        promo.type === 'discount' ? 'bg-amber-100 text-amber-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {promo.type === 'free_listing' ? <Gift size={18} /> : promo.type === 'discount' ? <Tag size={18} /> : <Star size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm">{getLocalizedText(promo.title, locale)}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{getLocalizedText(promo.description, locale)}</div>
                        <div className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-2">
                          <Calendar size={11} />
                          {formatDate(promo.startDate, locale)} → {formatDate(promo.endDate, locale)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${promo.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {promo.active ? t('admin.promo_active') : t('admin.promo_inactive')}
                        </span>
                        <button onClick={() => togglePromotion(promo.id)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title={promo.active ? t('admin.promo_deactivate') : t('admin.promo_activate')}>
                          {promo.active ? <ToggleRight size={18} className="text-green-600" /> : <ToggleLeft size={18} className="text-gray-400" />}
                        </button>
                        <button onClick={() => deletePromotion(promo.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title={t('admin.promo_delete')}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Confirm delete modals ── */}
      {confirmDeleteSeller && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setConfirmDeleteSeller('')}>
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600"><Trash2 size={18} /></div>
              <h3 className="font-bold text-gray-900">{t('admin.delete_seller')}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-5">{t('admin.confirm_delete_seller')}</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDeleteSeller('')} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">{t('common.cancel')}</button>
              <button onClick={() => handleDeleteSeller(confirmDeleteSeller)} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">{t('common.confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteAnimal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setConfirmDeleteAnimal('')}>
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600"><Trash2 size={18} /></div>
              <h3 className="font-bold text-gray-900">{t('admin.delete_listing')}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-5">{t('admin.confirm_delete_listing')}</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDeleteAnimal('')} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">{t('common.cancel')}</button>
              <button onClick={() => handleDeleteAnimal(confirmDeleteAnimal)} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">{t('common.confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-fade-in-up">
          <CheckCircle size={16} className="text-green-400" /> {toast}
        </div>
      )}

      <Footer />
    </div>
  );
}

/* ───────────────── Promotion Form Sub-component ───────────────── */
function PromotionForm({
  locale,
  t,
  onSave,
  onCancel,
}: {
  locale: Locale;
  t: ReturnType<typeof useTranslations>;
  onSave: (promo: Promotion) => void;
  onCancel: () => void;
}) {
  const [titleAr, setTitleAr] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descFr, setDescFr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [type, setType] = useState<Promotion['type']>('free_listing');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500';
  const labelCls = 'text-xs font-semibold text-gray-600 mb-1 block';

  const canSave = (titleAr || titleFr || titleEn) && startDate && endDate;

  const handleSubmit = () => {
    if (!canSave) return;
    onSave({
      id: `promo-${Date.now()}`,
      title: { ar: titleAr || titleFr || titleEn, fr: titleFr || titleEn || titleAr, en: titleEn || titleFr || titleAr },
      description: { ar: descAr || descFr || descEn, fr: descFr || descEn || descAr, en: descEn || descFr || descAr },
      type,
      active: true,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdAt: new Date(),
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-sm">{t('admin.new_promotion')}</h3>
        <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600"><X size={18} /></button>
      </div>

      <div className="space-y-3">
        {/* Type */}
        <div>
          <label className={labelCls}>{t('admin.promo_type')}</label>
          <div className="flex gap-2">
            {(['free_listing', 'discount', 'featured'] as const).map((tp) => (
              <button key={tp} onClick={() => setType(tp)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all ${type === tp ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'}`}>
                {tp === 'free_listing' ? <Gift size={14} /> : tp === 'discount' ? <Tag size={14} /> : <Star size={14} />}
                {tp === 'free_listing' ? t('admin.promo_free_listing') : tp === 'discount' ? t('admin.promo_discount') : t('admin.promo_featured')}
              </button>
            ))}
          </div>
        </div>

        {/* Titles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><label className={labelCls}>{t('admin.promo_title')} (AR)</label><input type="text" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className={inputCls} dir="rtl" placeholder="عنوان العرض" /></div>
          <div><label className={labelCls}>{t('admin.promo_title')} (FR)</label><input type="text" value={titleFr} onChange={(e) => setTitleFr(e.target.value)} className={inputCls} placeholder="Titre de la promo" /></div>
          <div><label className={labelCls}>{t('admin.promo_title')} (EN)</label><input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={inputCls} placeholder="Promo title" /></div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><label className={labelCls}>{t('admin.promo_description')} (AR)</label><input type="text" value={descAr} onChange={(e) => setDescAr(e.target.value)} className={inputCls} dir="rtl" /></div>
          <div><label className={labelCls}>{t('admin.promo_description')} (FR)</label><input type="text" value={descFr} onChange={(e) => setDescFr(e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>{t('admin.promo_description')} (EN)</label><input type="text" value={descEn} onChange={(e) => setDescEn(e.target.value)} className={inputCls} /></div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>{t('admin.promo_start')}</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>{t('admin.promo_end')}</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls} /></div>
        </div>

        {/* Save */}
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">{t('common.cancel')}</button>
          <button onClick={handleSubmit} disabled={!canSave} className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">{t('common.save')}</button>
        </div>
      </div>
    </div>
  );
}

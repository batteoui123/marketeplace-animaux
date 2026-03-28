'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useStore } from '@/stores/useStore';
import { CATEGORIES, CITIES } from '@/lib/constants';
import type { Animal, Locale } from '@/lib/types';
import { getLocalizedText } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = 3;

export default function NewAdPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as Locale) ?? 'ar';
  const router = useRouter();
  const currentSeller = useStore((s) => s.currentSeller);
  const addPendingAnimal = useStore((s) => s.addPendingAnimal);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    titleAr: '', titleFr: '', titleEn: '',
    descAr: '', descFr: '', descEn: '',
    category: '', subCategory: '', breed: '',
    price: '', negotiable: false,
    age: '', gender: 'unknown' as 'male' | 'female' | 'unknown',
    city: '', color: '', weight: '',
    vaccinated: false, pedigree: false,
    photos: ['https://placehold.co/400x300/f0fdf4/16a34a?text=🐾'],
  });

  useEffect(() => {
    if (!currentSeller) router.push(`/${locale}/seller/login`);
  }, [currentSeller, locale, router]);

  if (!currentSeller) return null;

  const set = (key: string, val: string | boolean) => setForm((prev) => ({ ...prev, [key]: val }));
  const selectedCat = CATEGORIES.find((c) => c.slug === form.category);

  const handleSubmit = () => {
    const animal: Animal = {
      id: `a${Date.now()}`,
      sellerId: currentSeller.id,
      title: { ar: form.titleAr || form.titleFr || form.titleEn, fr: form.titleFr || form.titleAr || form.titleEn, en: form.titleEn || form.titleFr || form.titleAr },
      description: { ar: form.descAr || form.descFr || form.descEn, fr: form.descFr || form.descAr || form.descEn, en: form.descEn || form.descFr || form.descAr },
      price: Number(form.price),
      negotiable: form.negotiable,
      category: form.category,
      subCategory: form.subCategory || undefined,
      breed: form.breed || undefined,
      age: form.age || undefined,
      gender: form.gender,
      city: form.city,
      photos: form.photos,
      vaccinated: form.vaccinated,
      pedigree: form.pedigree,
      weight: form.weight || undefined,
      color: form.color || undefined,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addPendingAnimal(animal);
    router.push(`/${locale}/seller/dashboard`);
  };

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        <h1 className="text-xl font-bold text-gray-900 mb-6">{t('seller.new_ad')}</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step > i + 1 ? 'bg-green-600 text-white' : step === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {i + 1}
              </div>
              {i < STEPS - 1 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-green-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          {/* Step 1: Basic info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 mb-4">
                {locale === 'ar' ? 'المعلومات الأساسية' : locale === 'fr' ? 'Informations de base' : 'Basic Information'}
              </h2>

              <div>
                <label className={labelCls}>{t('animal.description')} (عربي)</label>
                <input type="text" value={form.titleAr} onChange={(e) => set('titleAr', e.target.value)} className={inputCls} placeholder="عنوان الإعلان" dir="rtl" />
              </div>
              <div>
                <label className={labelCls}>{t('animal.description')} (Français)</label>
                <input type="text" value={form.titleFr} onChange={(e) => set('titleFr', e.target.value)} className={inputCls} placeholder="Titre de l'annonce" />
              </div>

              <div>
                <label className={labelCls}>{t('nav.categories')}</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} required className={inputCls}>
                  <option value=""></option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.emoji} {getLocalizedText(cat.label, locale)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCat && selectedCat.subCategories && selectedCat.subCategories.length > 0 && (
                <div>
                  <label className={labelCls}>{locale === 'ar' ? 'الفئة الفرعية' : locale === 'fr' ? 'Sous-catégorie' : 'Sub-category'}</label>
                  <select value={form.subCategory} onChange={(e) => set('subCategory', e.target.value)} className={inputCls}>
                    <option value=""></option>
                    {selectedCat.subCategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className={labelCls}>{t('animal.city')}</label>
                <select value={form.city} onChange={(e) => set('city', e.target.value)} required className={inputCls}>
                  <option value=""></option>
                  {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 mb-4">
                {locale === 'ar' ? 'تفاصيل الحيوان' : locale === 'fr' ? "Détails de l'animal" : 'Animal Details'}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t('animal.price')} (MAD)</label>
                  <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} min={0} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t('animal.age')}</label>
                  <input type="text" value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="ex: 3 mois" className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>{t('animal.gender')}</label>
                <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className={inputCls}>
                  <option value="unknown">{t('animal.unknown')}</option>
                  <option value="male">{t('animal.male')}</option>
                  <option value="female">{t('animal.female')}</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>{t('animal.breed')}</label>
                <input type="text" value={form.breed} onChange={(e) => set('breed', e.target.value)} className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t('animal.color')}</label>
                  <input type="text" value={form.color} onChange={(e) => set('color', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t('animal.weight')}</label>
                  <input type="text" value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="ex: 5 kg" className={inputCls} />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.negotiable} onChange={(e) => set('negotiable', e.target.checked)}
                    className="w-4 h-4 accent-green-600" />
                  <span className="text-sm text-gray-700">{t('animal.negotiable')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.vaccinated} onChange={(e) => set('vaccinated', e.target.checked)}
                    className="w-4 h-4 accent-green-600" />
                  <span className="text-sm text-gray-700">{t('animal.vaccinated')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.pedigree} onChange={(e) => set('pedigree', e.target.checked)}
                    className="w-4 h-4 accent-green-600" />
                  <span className="text-sm text-gray-700">{t('animal.pedigree')}</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Description + submit */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 mb-4">
                {locale === 'ar' ? 'الوصف والصور' : locale === 'fr' ? 'Description et photos' : 'Description & Photos'}
              </h2>

              <div>
                <label className={labelCls}>{t('animal.description')} (عربي)</label>
                <textarea rows={3} value={form.descAr} onChange={(e) => set('descAr', e.target.value)}
                  className={`${inputCls} resize-none`} dir="rtl" placeholder="وصف تفصيلي للحيوان..." />
              </div>
              <div>
                <label className={labelCls}>{t('animal.description')} (Français)</label>
                <textarea rows={3} value={form.descFr} onChange={(e) => set('descFr', e.target.value)}
                  className={`${inputCls} resize-none`} placeholder="Description détaillée de l'animal..." />
              </div>

              <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700">
                {locale === 'ar'
                  ? "⚠️ سيتم مراجعة إعلانك من قبل الإدارة قبل نشره. ستتلقى إشعاراً عند القبول."
                  : locale === 'fr'
                  ? "⚠️ Votre annonce sera examinée par l'admin avant publication. Vous serez notifié après validation."
                  : "⚠️ Your listing will be reviewed by admin before publishing. You'll be notified upon approval."}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <ChevronLeft size={16} /> {t('common.prev')}
              </button>
            ) : <div />}

            {step < STEPS ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && (!form.category || !form.city || (!form.titleAr && !form.titleFr && !form.titleEn))}
                className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('common.next')} <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!form.price}
                className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('common.submit')}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

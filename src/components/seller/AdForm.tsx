'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useStore } from '@/stores/useStore';
import { CATEGORIES, CITIES } from '@/lib/constants';
import type { Animal, Locale } from '@/lib/types';
import { getLocalizedText } from '@/lib/utils';
import { ChevronRight, ChevronLeft, UploadCloud, X, Film, Image as ImageIcon } from 'lucide-react';

const STEPS = 3;
const MAX_PHOTOS = 8;

interface AdFormProps {
  initialData?: Animal;
  isEdit?: boolean;
}

export default function AdForm({ initialData, isEdit }: AdFormProps) {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as Locale) ?? 'ar';
  const router = useRouter();
  
  const currentSeller = useStore((s) => s.currentSeller);
  const addPendingAnimal = useStore((s) => s.addPendingAnimal);
  const updateAnimal = useStore((s) => s.updateAnimal);
  
  const [step, setStep] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Take the first translation available for initial data to simplify
  const initialTitle = initialData ? (initialData.title.ar || initialData.title.fr || initialData.title.en) : '';
  const initialDesc = initialData ? (initialData.description.ar || initialData.description.fr || initialData.description.en) : '';

  const [form, setForm] = useState({
    title: initialTitle,
    description: initialDesc,
    category: initialData?.category || '', 
    subCategory: initialData?.subCategory || '', 
    breed: initialData?.breed || '',
    price: initialData?.price?.toString() || '', 
    negotiable: initialData?.negotiable ?? false,
    age: initialData?.age || '', 
    gender: initialData?.gender || 'unknown',
    city: initialData?.city || '', 
    color: initialData?.color || '', 
    weight: initialData?.weight || '',
    vaccinated: initialData?.vaccinated ?? false, 
    pedigree: initialData?.pedigree ?? false,
    photos: initialData?.photos || [],
    videos: initialData?.videos || [],
  });

  const set = (key: string, val: any) => setForm((prev) => ({ ...prev, [key]: val }));
  const selectedCat = CATEGORIES.find((c) => c.slug === form.category);

  // Handle media upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'photos' | 'videos') => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    if (type === 'photos') {
      const currentCount = form.photos.length;
      const allowed = MAX_PHOTOS - currentCount;
      const toAdd = files.slice(0, allowed).map(f => URL.createObjectURL(f));
      set('photos', [...form.photos, ...toAdd]);
    } else {
      const currentCount = form.videos.length;
      const allowed = 1 - currentCount;
      const toAdd = files.slice(0, allowed).map(f => URL.createObjectURL(f));
      set('videos', [...form.videos, ...toAdd]);
    }
    
    e.target.value = '';
  };
  
  const removeMedia = (index: number, type: 'photos' | 'videos') => {
    const list = [...form[type]];
    list.splice(index, 1);
    set(type, list);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: 'photos' | 'videos') => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith(type === 'photos' ? 'image/' : 'video/'));
    
    if (type === 'photos') {
      const allowed = MAX_PHOTOS - form.photos.length;
      const toAdd = files.slice(0, allowed).map(f => URL.createObjectURL(f));
      set('photos', [...form.photos, ...toAdd]);
    } else {
      const allowed = 1 - form.videos.length;
      const toAdd = files.slice(0, allowed).map(f => URL.createObjectURL(f));
      set('videos', [...form.videos, ...toAdd]);
    }
  };

  const handleSubmit = () => {
    // If no photos provided, fallback to placeholder
    const finalPhotos = form.photos.length > 0 ? form.photos : ['https://placehold.co/800x600/f0fdf4/16a34a?text=🐾'];

    const animal: Animal = {
      id: initialData?.id || `a${Date.now()}`,
      sellerId: currentSeller!.id,
      title: { ar: form.title, fr: form.title, en: form.title },
      description: { ar: form.description, fr: form.description, en: form.description },
      price: Number(form.price),
      negotiable: form.negotiable,
      category: form.category,
      subCategory: form.subCategory || undefined,
      breed: form.breed || undefined,
      age: form.age || undefined,
      gender: form.gender as any,
      city: form.city,
      photos: finalPhotos,
      videos: form.videos,
      vaccinated: form.vaccinated,
      pedigree: form.pedigree,
      weight: form.weight || undefined,
      color: form.color || undefined,
      status: 'pending',
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (isEdit) {
      updateAnimal(animal.id, animal);
    } else {
      addPendingAnimal(animal);
    }

    setShowToast(true);
    setTimeout(() => {
      router.push(`/${locale}/seller/dashboard`);
    }, 2500);
  };

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition-all";
  const labelCls = "block text-sm font-semibold text-gray-800 mb-2";

  return (
    <div className="w-full relative">
      {/* Success toast */}
      {showToast && (
        <div className="fixed top-6 start-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-bold text-sm">
                {locale === 'ar' ? 'تم إرسال إعلانك بنجاح!' : locale === 'fr' ? 'Annonce envoyée avec succès !' : 'Listing submitted successfully!'}
              </p>
              <p className="text-green-100 text-xs mt-0.5">
                {locale === 'ar' ? 'سيتم مراجعتها قريباً' : locale === 'fr' ? 'Elle sera examinée prochainement' : 'It will be reviewed shortly'}
              </p>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        {isEdit ? (locale === 'ar' ? 'تعديل الإعلان' : locale === 'fr' ? "Modifier l'annonce" : 'Edit Ad') : t('seller.new_ad')}
      </h1>

      {/* Step indicator with labels */}
      {(() => {
        const stepLabels = locale === 'ar'
          ? ['المعلومات', 'التفاصيل', 'الصور']
          : locale === 'fr'
          ? ['Infos', 'Détails', 'Médias']
          : ['Info', 'Details', 'Media'];
        return (
          <div className="flex items-start gap-1 mb-8">
            {Array.from({ length: STEPS }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <div className="flex items-center w-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors shrink-0 ${
                    step > i + 1 ? 'bg-green-600 text-white' : step === i + 1 ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  {i < STEPS - 1 && (
                    <div className={`flex-1 h-1 rounded-full mx-1 ${step > i + 1 ? 'bg-green-600' : 'bg-gray-100'}`} />
                  )}
                </div>
                <span className={`text-[11px] font-medium ${step === i + 1 ? 'text-green-700' : step > i + 1 ? 'text-green-500' : 'text-gray-400'}`}>
                  {stepLabels[i]}
                </span>
              </div>
            ))}
          </div>
        );
      })()}

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
        {/* Step 1: Basic info */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-900 mb-2 pb-3 border-b border-gray-100">
              {locale === 'ar' ? 'المعلومات الأساسية' : locale === 'fr' ? 'Informations de base' : 'Basic Information'}
            </h2>

            {/* Moderation notice — visible from step 1 */}
            <div className="bg-amber-50 rounded-2xl p-4 text-sm text-amber-800 flex items-start gap-3 border border-amber-100">
              <span className="text-xl shrink-0 mt-0.5">🛡️</span>
              <p className="font-medium leading-relaxed">
                {locale === 'ar'
                  ? 'سيتم مراجعة إعلانك من قبل الإدارة قبل النشر. يُرجى التأكد من دقة المعلومات المقدمة.'
                  : locale === 'fr'
                  ? "Votre annonce sera vérifiée par l'équipe avant publication. Merci de renseigner des informations exactes."
                  : 'Your listing will be reviewed by our team before publishing. Please provide accurate information.'}
              </p>
            </div>

            <div>
              <label className={labelCls}>{t('animal.description')} *</label>
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder={locale === 'ar' ? 'عنوان الإعلان...' : "Titre de l'annonce..."} />
              <p className="text-xs text-gray-500 mt-2">{locale === 'ar' ? 'هذا العنوان سيظهر بجميع اللغات' : 'Ce titre s\'affichera dans toutes les langues'}</p>
            </div>

            <div>
              <label className={labelCls}>{t('nav.categories')} *</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} required className={inputCls}>
                <option value="">{locale === 'ar' ? 'اختر فئة...' : locale === 'fr' ? 'Sélectionner une catégorie...' : 'Select a category...'}</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.emoji} {getLocalizedText(cat.label, locale)}
                  </option>
                ))}
              </select>
            </div>

            {selectedCat && selectedCat.subCategories && selectedCat.subCategories.length > 0 && (
              <div className="animate-fade-in-up">
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
              <label className={labelCls}>{t('animal.city')} *</label>
              <select value={form.city} onChange={(e) => set('city', e.target.value)} required className={inputCls}>
                <option value=""></option>
                {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-900 mb-2 pb-3 border-b border-gray-100">
              {locale === 'ar' ? 'تفاصيل الحيوان' : locale === 'fr' ? "Détails de l'animal" : 'Animal Details'}
            </h2>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>{t('animal.price')} (MAD) *</label>
                <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} min={0} className={inputCls} placeholder="0" />
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

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>{t('animal.color')}</label>
                <input type="text" value={form.color} onChange={(e) => set('color', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{t('animal.weight')}</label>
                <input type="text" value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="ex: 5 kg" className={inputCls} />
              </div>
            </div>

            <div className="flex flex-col gap-4 p-5 bg-green-50/50 rounded-2xl border border-green-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={form.negotiable} onChange={(e) => set('negotiable', e.target.checked)}
                  className="w-5 h-5 accent-green-600 rounded-md" />
                <span className="font-medium text-gray-700 group-hover:text-green-800 transition-colors">{t('animal.negotiable')}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={form.vaccinated} onChange={(e) => set('vaccinated', e.target.checked)}
                  className="w-5 h-5 accent-green-600 rounded-md" />
                <span className="font-medium text-gray-700 group-hover:text-green-800 transition-colors">{t('animal.vaccinated')}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={form.pedigree} onChange={(e) => set('pedigree', e.target.checked)}
                  className="w-5 h-5 accent-green-600 rounded-md" />
                <span className="font-medium text-gray-700 group-hover:text-green-800 transition-colors">{t('animal.pedigree')}</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Description + Media */}
        {step === 3 && (
          <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-900 pb-3 border-b border-gray-100">
              {locale === 'ar' ? 'الوصف والوسائط' : locale === 'fr' ? 'Description et médias' : 'Description & Media'}
            </h2>

            <div>
              <label className={labelCls}>{locale === 'ar' ? 'تفاصيل إضافية' : 'Détails supplémentaires'}</label>
              <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)}
                className={`${inputCls} resize-none`} placeholder={locale === 'ar' ? "أضف مزيداً من التفاصيل حول الحيوان..." : "Ajoutez plus de détails sur l'animal..."} />
            </div>

            {/* Photos Drag & Drop */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-1.5 bg-sky-100 text-sky-600 rounded-lg"><ImageIcon size={18} /></div>
                  Photos <span className="text-gray-500 font-normal">({form.photos.length}/{MAX_PHOTOS})</span>
                </label>
              </div>
              
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${form.photos.length >= MAX_PHOTOS ? 'bg-gray-50 border-gray-200 opacity-60 pointer-events-none' : 'bg-sky-50/30 border-sky-200 hover:border-sky-400 hover:bg-sky-50'}`}
                onClick={() => form.photos.length < MAX_PHOTOS && fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  if (form.photos.length < MAX_PHOTOS) handleDrop(e, 'photos');
                }}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'photos')} />
                <UploadCloud className="mx-auto text-sky-500 mb-3" size={36} />
                <p className="font-medium text-gray-700 mb-1">
                  {locale === 'ar' ? 'انقر أو اسحب الصور هنا' : locale === 'fr' ? 'Cliquez ou glissez les photos ici' : 'Click or drag photos here'}
                </p>
                <p className="text-xs text-gray-500">JPEG, PNG (Max {MAX_PHOTOS})</p>
              </div>

              {form.photos.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {form.photos.map((src, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-sm shadow-gray-200 group border-2 border-transparent hover:border-sky-400 transition-colors">
                      <Image src={src} fill alt="Upload" className="object-cover" />
                      <button onClick={(e) => { e.stopPropagation(); removeMedia(i, 'photos'); }} className="absolute top-1 end-1 bg-white/90 backdrop-blur hover:bg-red-50 text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Videos Drag & Drop */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg"><Film size={18} /></div>
                  Vidéo <span className="text-gray-500 font-normal">({form.videos.length}/1)</span>
                </label>
              </div>
              
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${form.videos.length >= 1 ? 'bg-gray-50 border-gray-200 opacity-60 pointer-events-none' : 'bg-orange-50/30 border-orange-200 hover:border-orange-400 hover:bg-orange-50'}`}
                onClick={() => form.videos.length < 1 && videoInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  if (form.videos.length < 1) handleDrop(e, 'videos');
                }}
              >
                <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e, 'videos')} />
                <UploadCloud className="mx-auto text-orange-500 mb-3" size={36} />
                <p className="font-medium text-gray-700 mb-1">
                  {locale === 'ar' ? 'انقر أو اسحب مقطع فيديو هنا' : locale === 'fr' ? 'Cliquez ou glissez une vidéo ici' : 'Click or drag video here'}
                </p>
                <p className="text-xs text-gray-500">MP4, WEBM (Max 1)</p>
              </div>

              {form.videos.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {form.videos.map((src, i) => (
                    <div key={i} className="relative w-48 h-28 rounded-2xl overflow-hidden shadow-sm shadow-gray-200 bg-black group border-2 border-transparent hover:border-orange-400 transition-colors">
                      <video src={src} className="w-full h-full object-cover opacity-90" controls />
                      <button onClick={(e) => { e.stopPropagation(); removeMedia(i, 'videos'); }} className="absolute top-2 end-2 bg-white/90 backdrop-blur hover:bg-red-50 text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10">
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 text-sm text-amber-800 flex items-start gap-4 border border-amber-100">
              <div className="mt-0.5 text-xl">🛡️</div>
              <div className="font-medium leading-relaxed">
                {locale === 'ar'
                  ? "سيتم مراجعة إعلانك من قبل الإدارة بعد الحفظ للحفاظ على جودة المنصة. ستصلك رسالة عند قبوله وتفعيله!"
                  : "Votre annonce sera réexaminée par l'administrateur après l'enregistrement. Vous serez notifié une fois approuvée !"}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all">
              <ChevronLeft size={18} /> {t('common.prev')}
            </button>
          ) : <div />}

          {step < STEPS ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && (!form.category || !form.city || !form.title)}
              className="flex items-center gap-2 px-8 py-3 text-sm font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {t('common.next')} <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!form.price || (form.photos.length === 0 && form.videos.length === 0)}
              className="flex items-center gap-2 px-10 py-3 text-sm font-black bg-[#E67E22] text-white rounded-xl hover:bg-[#D35400] hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isEdit ? '💾 Enregistrer' : t('common.submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

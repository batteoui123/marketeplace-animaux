'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { MapPin, Heart, CheckCircle, Play, Clock, Share2 } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { formatPrice, getLocalizedText, timeAgo } from '@/lib/utils';
import type { Animal, Locale } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

interface Props {
  animal: Animal;
}

function isNew(date: Date): boolean {
  return Date.now() - new Date(date).getTime() < 48 * 60 * 60 * 1000;
}

export default function AnimalCard({ animal }: Props) {
  const params = useParams();
  const locale = (params.locale as Locale) ?? 'ar';
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const isFavorite = useStore((s) => s.isFavorite(animal.id));

  const category = CATEGORIES.find((c) => c.slug === animal.category);
  const title = getLocalizedText(animal.title, locale);
  const mainPhoto = animal.photos[0] ?? 'https://placehold.co/400x300/DCFCE7/16A34A?text=🐾';
  const newBadge = locale === 'ar' ? 'جديد' : locale === 'fr' ? 'Nouveau' : 'New';

  const shareOnWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/animals/${animal.id}`;
    const msg = locale === 'ar'
      ? `شوف هاد الإعلان فـ AnimalSouk: ${title} - ${formatPrice(animal.price, locale)}\n${url}`
      : locale === 'fr'
        ? `Regarde cette annonce sur AnimalSouk : ${title} - ${formatPrice(animal.price, locale)}\n${url}`
        : `Check this listing on AnimalSouk: ${title} - ${formatPrice(animal.price, locale)}\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="animal-card bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group">
      <Link href={`/${locale}/animals/${animal.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={mainPhoto}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Category badge */}
          <span
            className="absolute top-2 start-2 flex items-center gap-1 text-white text-[11px] font-semibold ps-0.5 pe-2 py-0.5 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: category?.color ?? '#16A34A' }}
          >
            {category?.image ? (
              <Image
                src={category.image}
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 rounded-full object-cover border border-white/30"
              />
            ) : (
              <span>{category?.emoji}</span>
            )}
            {getLocalizedText(category?.label ?? { ar: '', fr: '', en: '' }, locale)}
          </span>

          {/* "Nouveau" badge */}
          {isNew(animal.createdAt) && (
            <span className="absolute top-2 end-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {newBadge}
            </span>
          )}

          {/* Video indicator */}
          {animal.videos && animal.videos.length > 0 && !isNew(animal.createdAt) && (
            <span className="absolute top-2 end-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Play size={9} className="fill-white" /> {animal.videos.length}
            </span>
          )}

          {/* Multiple photos indicator */}
          {animal.photos.length > 1 && (
            <span className="absolute bottom-2 end-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              📷 {animal.photos.length}
            </span>
          )}

          {/* Sold overlay */}
          {animal.status === 'sold' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-slate-900 font-bold px-4 py-2 rounded-full text-sm">
                {locale === 'ar' ? 'مباع' : locale === 'fr' ? 'Vendu' : 'Sold'}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <div className="flex items-start justify-between gap-1.5">
          <Link href={`/${locale}/animals/${animal.id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-green-600 transition-colors">
              {title}
            </h3>
            {animal.breed && (
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                🏷 {animal.breed}
              </p>
            )}
          </Link>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={shareOnWhatsApp}
              aria-label="Partager sur WhatsApp"
              className="p-1 text-slate-300 hover:text-green-600 transition-colors"
            >
              <Share2 size={15} />
            </button>
            <button
              onClick={() => toggleFavorite(animal.id)}
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className="p-1 text-slate-300 hover:text-red-500 transition-colors"
            >
              <Heart size={17} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
            </button>
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-bold text-base text-green-700">
            {formatPrice(animal.price, locale)}
          </span>
          <div className="flex items-center gap-1">
            {animal.negotiable && (
              <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full font-medium">
                {locale === 'ar' ? 'قابل' : locale === 'fr' ? 'nég.' : 'neg.'}
              </span>
            )}
            {animal.vaccinated && (
              <CheckCircle size={13} className="text-emerald-500" aria-label="Vacciné" />
            )}
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between text-slate-400 text-xs">
          <div className="flex items-center gap-1">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{animal.city}</span>
            {animal.age && <><span>·</span><span className="truncate">{animal.age}</span></>}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Clock size={10} />
            <span>{timeAgo(new Date(animal.createdAt), locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

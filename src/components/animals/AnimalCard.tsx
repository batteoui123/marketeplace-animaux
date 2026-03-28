'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { MapPin, Heart, CheckCircle } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { formatPrice, getLocalizedText } from '@/lib/utils';
import type { Animal, Locale } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

interface Props {
  animal: Animal;
}

export default function AnimalCard({ animal }: Props) {
  const params = useParams();
  const locale = (params.locale as Locale) ?? 'ar';
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const isFavorite = useStore((s) => s.isFavorite(animal.id));

  const category = CATEGORIES.find((c) => c.slug === animal.category);
  const title = getLocalizedText(animal.title, locale);
  const mainPhoto = animal.photos[0] ?? 'https://placehold.co/400x300/f0fdf4/16a34a?text=🐾';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <Link href={`/${locale}/animals/${animal.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={mainPhoto}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Category badge */}
          <span className="absolute top-2 start-2 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
            {category?.emoji}{' '}
            {category ? getLocalizedText(category.label, locale) : animal.category}
          </span>
          {/* Sold overlay */}
          {animal.status === 'sold' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded-full text-sm">
                {locale === 'ar' ? 'مباع' : locale === 'fr' ? 'Vendu' : 'Sold'}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/${locale}/animals/${animal.id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
              {title}
            </h3>
          </Link>
          <button
            onClick={() => toggleFavorite(animal.id)}
            className="shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Favorite"
          >
            <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="text-green-700 font-bold text-base">{formatPrice(animal.price)}</span>
            {animal.negotiable && (
              <span className="ms-1.5 text-xs text-gray-500">
                {locale === 'ar'
                  ? '(قابل للتفاوض)'
                  : locale === 'fr'
                  ? '(négociable)'
                  : '(neg.)'}
              </span>
            )}
          </div>
          {animal.vaccinated && (
            <CheckCircle size={14} className="text-green-500 shrink-0" aria-label="Vaccinated" />
          )}
        </div>

        <div className="mt-1.5 flex items-center gap-1 text-gray-500 text-xs">
          <MapPin size={12} className="shrink-0" />
          <span>{animal.city}</span>
          {animal.age && (
            <>
              <span className="mx-1">·</span>
              <span>{animal.age}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

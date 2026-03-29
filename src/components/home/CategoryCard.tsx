'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Category, Locale } from '@/lib/types';

interface Props {
  category: Category;
  locale: Locale;
  count?: number;
}

function getLocalizedText(obj: { ar: string; fr: string; en: string }, locale: Locale) {
  return obj[locale];
}

export default function CategoryCard({ category, locale, count }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/${locale}/categories/${category.slug}`}
      className="flex flex-col items-center gap-2.5 group"
    >
      {/* Circular image container */}
      <div className="relative">
        <div
          className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-[3px] border-white shadow-md group-hover:shadow-lg group-hover:border-green-400 transition-all duration-300 group-hover:scale-105"
          style={{
            boxShadow: `0 4px 14px ${category.color}25`,
          }}
        >
          {!imgError ? (
            <Image
              src={category.image}
              alt={getLocalizedText(category.label, locale)}
              width={96}
              height={96}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-3xl md:text-4xl"
              style={{ backgroundColor: `${category.color}15` }}
            >
              {category.emoji}
            </div>
          )}
        </div>

        {/* Count badge */}
        {count !== undefined && count > 0 && (
          <span
            className="absolute -top-1 -end-1 text-white text-[10px] font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1 shadow-sm border-2 border-white"
            style={{ backgroundColor: category.color }}
          >
            {count}
          </span>
        )}
      </div>

      {/* Label */}
      <span className="text-xs md:text-sm font-semibold text-gray-700 group-hover:text-green-700 text-center leading-tight transition-colors">
        {getLocalizedText(category.label, locale)}
      </span>
    </Link>
  );
}

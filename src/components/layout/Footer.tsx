'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function Footer() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params?.locale as string) ?? 'ar';

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🐾</span>
            <span className="text-white font-bold text-lg">AnimalSouk</span>
          </div>
          <p className="text-sm leading-relaxed">
            {locale === 'ar'
              ? 'أفضل سوق للحيوانات في المغرب'
              : locale === 'fr'
              ? "Le meilleur marché d'animaux au Maroc"
              : "Morocco's best animal marketplace"}
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 text-sm">{t('nav.categories')}</h3>
          <div className="space-y-2 text-sm">
            <Link href={`/${locale}/categories/cats`} className="block hover:text-white transition-colors">
              {t('categories.cats')}
            </Link>
            <Link href={`/${locale}/categories/dogs`} className="block hover:text-white transition-colors">
              {t('categories.dogs')}
            </Link>
            <Link href={`/${locale}/categories/birds`} className="block hover:text-white transition-colors">
              {t('categories.birds')}
            </Link>
            <Link href={`/${locale}/categories/horses`} className="block hover:text-white transition-colors">
              {t('categories.horses')}
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 text-sm">
            {locale === 'ar' ? 'روابط مفيدة' : locale === 'fr' ? 'Liens utiles' : 'Useful Links'}
          </h3>
          <div className="space-y-2 text-sm">
            <Link href={`/${locale}/seller/register`} className="block hover:text-white transition-colors">
              {t('nav.register')}
            </Link>
            <Link href={`/${locale}/seller/login`} className="block hover:text-white transition-colors">
              {t('nav.login')}
            </Link>
            <Link href={`/${locale}/animals`} className="block hover:text-white transition-colors">
              {t('nav.animals')}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-xs">
        © 2024 AnimalSouk —{' '}
        {locale === 'ar'
          ? 'جميع الحقوق محفوظة'
          : locale === 'fr'
          ? 'Tous droits réservés'
          : 'All rights reserved'}
      </div>
    </footer>
  );
}

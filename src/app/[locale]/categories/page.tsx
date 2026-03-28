import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { CATEGORIES } from '@/lib/constants';
import { MOCK_ANIMALS } from '@/lib/mock-data';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Locale } from '@/lib/types';

function getLocalizedText(obj: { ar: string; fr: string; en: string }, locale: Locale) {
  return obj[locale];
}

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const loc = locale as Locale;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-xl font-bold text-gray-900 mb-6">{t('nav.categories')}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const count = MOCK_ANIMALS.filter((a) => a.category === cat.slug && a.status === 'approved').length;
            return (
              <Link
                key={cat.slug}
                href={`/${locale}/categories/${cat.slug}`}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-green-400 hover:shadow-md transition-all flex flex-col items-center gap-3 text-center group"
              >
                <span className="text-4xl">{cat.emoji}</span>
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    {getLocalizedText(cat.label, loc)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {count} {loc === 'ar' ? 'إعلان' : loc === 'fr' ? 'annonce(s)' : 'listing(s)'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { CATEGORIES } from '@/lib/constants';
import { MOCK_ANIMALS } from '@/lib/mock-data';
import AnimalGrid from '@/components/animals/AnimalGrid';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Locale } from '@/lib/types';

function getLocalizedText(obj: { ar: string; fr: string; en: string }, locale: Locale) {
  return obj[locale];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations();
  const loc = locale as Locale;

  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const animals = MOCK_ANIMALS.filter((a) => a.category === slug && a.status === 'approved');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0"
            style={{ boxShadow: `0 2px 8px ${category.color}30` }}
          >
            <Image
              src={category.image}
              alt={getLocalizedText(category.label, loc)}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {getLocalizedText(category.label, loc)}
          </h1>
          <span className="text-sm text-gray-400">({animals.length})</span>
        </div>
        <AnimalGrid animals={animals} emptyMessage={t('animal.no_results_desc')} />
      </main>
      <Footer />
    </div>
  );
}

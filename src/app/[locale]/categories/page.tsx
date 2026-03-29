import { getTranslations } from 'next-intl/server';
import { CATEGORIES } from '@/lib/constants';
import { MOCK_ANIMALS } from '@/lib/mock-data';
import CategoryCard from '@/components/home/CategoryCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Locale } from '@/lib/types';

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const loc = locale as Locale;

  const countByCategory = MOCK_ANIMALS.reduce<Record<string, number>>((acc, a) => {
    if (a.status === 'approved') acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-xl font-bold text-gray-900 mb-8">{t('nav.categories')}</h1>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 md:gap-8">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.slug}
              category={cat}
              locale={loc}
              count={countByCategory[cat.slug] ?? 0}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

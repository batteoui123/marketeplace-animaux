import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { CATEGORIES } from '@/lib/constants';
import { MOCK_ANIMALS } from '@/lib/mock-data';
import AnimalCard from '@/components/animals/AnimalCard';
import SearchBar from '@/components/common/SearchBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Locale } from '@/lib/types';

function getLocalizedText(obj: { ar: string; fr: string; en: string }, locale: Locale) {
  return obj[locale];
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const loc = locale as Locale;

  const approved = MOCK_ANIMALS.filter((a) => a.status === 'approved').slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-green-700 to-green-500 text-white py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-5xl mb-4">🐾</div>
            <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
              {t('home.hero_title')}
            </h1>
            <p className="text-green-100 mb-8 text-sm md:text-base">
              {t('home.hero_subtitle')}
            </p>
            <div className="flex justify-center">
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-700">500+</div>
              <div className="text-xs text-gray-500 mt-1">{t('home.stats_ads')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">120+</div>
              <div className="text-xs text-gray-500 mt-1">{t('home.stats_sellers')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">26</div>
              <div className="text-xs text-gray-500 mt-1">{t('home.stats_cities')}</div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-lg font-bold text-gray-900 mb-5">{t('home.categories_title')}</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${locale}/categories/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-gray-100 hover:border-green-400 hover:shadow-sm transition-all group"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-gray-700 group-hover:text-green-700 text-center leading-tight">
                  {getLocalizedText(cat.label, loc)}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest listings */}
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">{t('home.latest_title')}</h2>
            <Link href={`/${locale}/animals`} className="text-sm text-green-700 font-medium hover:underline">
              {t('home.view_all')} →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {approved.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        </section>

        {/* CTA banner */}
        <section className="bg-green-50 border-t border-green-100 py-10 px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {loc === 'ar' ? 'هل تريد بيع حيوانك؟' : loc === 'fr' ? 'Vous voulez vendre votre animal ?' : 'Want to sell your animal?'}
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            {loc === 'ar' ? 'انشر إعلانك مجاناً وتواصل مع آلاف المشترين' : loc === 'fr' ? "Publiez votre annonce et contactez des milliers d'acheteurs" : 'Post your ad and reach thousands of buyers'}
          </p>
          <Link
            href={`/${locale}/seller/register`}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-green-700 transition-colors"
          >
            {t('nav.postAd')}
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { CATEGORIES } from '@/lib/constants';
import { MOCK_ANIMALS } from '@/lib/mock-data';
import AnimalCard from '@/components/animals/AnimalCard';
import CategoryCard from '@/components/home/CategoryCard';
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

  // Count per category
  const countByCategory = MOCK_ANIMALS.reduce<Record<string, number>>((acc, a) => {
    if (a.status === 'approved') acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});

  const howSteps = [
    {
      icon: '🔍',
      title: t('home.how_step1_title'),
      desc: t('home.how_step1_desc'),
      color: 'bg-green-50 text-green-700',
    },
    {
      icon: '💬',
      title: t('home.how_step2_title'),
      desc: t('home.how_step2_desc'),
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      icon: '🐾',
      title: t('home.how_step3_title'),
      desc: t('home.how_step3_desc'),
      color: 'bg-teal-50 text-teal-700',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-500 text-white py-16 px-4 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -end-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute bottom-0 -start-8 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative">
            <div className="text-5xl mb-4 animate-fade-in-up">🐾</div>
            <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight animate-fade-in-up">
              {t('home.hero_title')}
            </h1>
            <p className="text-green-100 mb-8 text-sm md:text-base animate-fade-in-up">
              {t('home.hero_subtitle')}
            </p>
            <div className="flex justify-center animate-fade-in-up">
              <SearchBar />
            </div>
          </div>
        </section>

        {/* ── Trust guarantees ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-3 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              <span className="text-xl">✅</span>
              <div>
                <div className="text-xs font-semibold text-gray-800">{t('home.guarantee_verified')}</div>
                <div className="text-[10px] text-gray-400 hidden md:block">{t('home.guarantee_verified_desc')}</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              <span className="text-xl">💬</span>
              <div>
                <div className="text-xs font-semibold text-gray-800">{t('home.guarantee_contact')}</div>
                <div className="text-[10px] text-gray-400 hidden md:block">{t('home.guarantee_contact_desc')}</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              <span className="text-xl">🛡️</span>
              <div>
                <div className="text-xs font-semibold text-gray-800">{t('home.guarantee_validated')}</div>
                <div className="text-[10px] text-gray-400 hidden md:block">{t('home.guarantee_validated_desc')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Categories with count ── */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">{t('home.categories_title')}</h2>
          <div className="flex gap-5 md:gap-6 overflow-x-auto pb-4 scroll-hide md:grid md:grid-cols-6 lg:grid-cols-11 md:overflow-visible">
            {CATEGORIES.map((cat) => (
              <div key={cat.slug} className="shrink-0">
                <CategoryCard
                  category={cat}
                  locale={loc}
                  count={countByCategory[cat.slug] ?? 0}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Latest listings ── */}
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

        {/* ── Comment ça marche ── */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 border-y border-green-100 py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-10">
              {t('home.how_title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howSteps.map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center text-3xl shadow-sm`}>
                    {step.icon}
                  </div>
                  {/* Step number */}
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  {/* Connector arrow — hidden on mobile, shown between steps on desktop */}
                  {i < howSteps.length - 1 && (
                    <div className="hidden md:block absolute" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-10">
            {t('home.testimonials_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: loc === 'ar' ? 'سارة من الدار البيضاء' : loc === 'fr' ? 'Sara de Casablanca' : 'Sara from Casablanca',
                text: loc === 'ar'
                  ? 'لقيت قطة شيرازية بثمن مناسب، والبائع كان متعاون بزاف. شكراً AnimalSouk!'
                  : loc === 'fr'
                    ? 'J\'ai trouvé un chat Persan à un prix raisonnable et le vendeur était très coopératif. Merci AnimalSouk !'
                    : 'I found a Persian cat at a reasonable price, and the seller was very cooperative. Thanks AnimalSouk!',
                initial: 'S',
                color: 'bg-pink-100 text-pink-700',
              },
              {
                name: loc === 'ar' ? 'يوسف من مراكش' : loc === 'fr' ? 'Youssef de Marrakech' : 'Youssef from Marrakech',
                text: loc === 'ar'
                  ? 'بعت 3 كلاب فأقل من أسبوع. الموقع سهل وماشي معقد، والتواصل مباشر مع المشترين.'
                  : loc === 'fr'
                    ? 'J\'ai vendu 3 chiens en moins d\'une semaine. Le site est simple et la communication avec les acheteurs est directe.'
                    : 'I sold 3 dogs in less than a week. The site is simple and communication with buyers is direct.',
                initial: 'Y',
                color: 'bg-blue-100 text-blue-700',
              },
              {
                name: loc === 'ar' ? 'أمينة من الرباط' : loc === 'fr' ? 'Amina de Rabat' : 'Amina from Rabat',
                text: loc === 'ar'
                  ? 'كنت كنقلب على ببغاء وأخيراً لقيت واحد قريب مني. الفلاتر ساعدوني بزاف!'
                  : loc === 'fr'
                    ? 'Je cherchais un perroquet et j\'en ai enfin trouvé un près de chez moi. Les filtres m\'ont beaucoup aidée !'
                    : 'I was looking for a parrot and finally found one near me. The filters helped a lot!',
                initial: 'A',
                color: 'bg-emerald-100 text-emerald-700',
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-sm shrink-0`}>
                    {t.initial}
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-3 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section className="bg-green-700 py-12 px-4 text-center text-white">
          <div className="max-w-xl mx-auto">
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              {t('home.cta_title')}
            </h2>
            <p className="text-green-100 text-sm mb-7">
              {t('home.cta_subtitle')}
            </p>
            <Link
              href={`/${locale}/seller/register`}
              className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-3.5 rounded-2xl font-bold hover:bg-green-50 transition-colors shadow-lg"
            >
              {t('home.cta_btn')}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

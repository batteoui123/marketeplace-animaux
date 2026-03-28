import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Phone, MapPin, Calendar, CheckCircle, Award } from 'lucide-react';
import { MOCK_ANIMALS, MOCK_SELLERS } from '@/lib/mock-data';
import { CATEGORIES } from '@/lib/constants';
import { formatPrice, getWhatsAppLink, getLocalizedText } from '@/lib/utils';
import type { Locale } from '@/lib/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FavoriteButton from '@/components/animals/FavoriteButton';

export default async function AnimalDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations();
  const loc = locale as Locale;

  const animal = MOCK_ANIMALS.find((a) => a.id === id);
  if (!animal || animal.status !== 'approved') notFound();

  const seller = MOCK_SELLERS.find((s) => s.id === animal.sellerId);
  const category = CATEGORIES.find((c) => c.slug === animal.category);
  const title = getLocalizedText(animal.title, loc);
  const description = getLocalizedText(animal.description, loc);

  const waMessage =
    loc === 'ar'
      ? `مرحباً، رأيت إعلانك على AnimalSouk: ${title} بسعر ${formatPrice(animal.price)}`
      : loc === 'fr'
      ? `Bonjour, j'ai vu votre annonce sur AnimalSouk : ${title} à ${formatPrice(animal.price)}`
      : `Hello, I saw your listing on AnimalSouk: ${title} at ${formatPrice(animal.price)}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 w-full">
        {/* Back */}
        <Link href={`/${locale}/animals`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 mb-4 transition-colors">
          ← {t('common.back')}
        </Link>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Left: photos + description */}
          <div className="md:col-span-3 space-y-4">
            {/* Main photo */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={animal.photos[0] ?? 'https://placehold.co/800x600/f0fdf4/16a34a?text=🐾'}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className="absolute top-3 end-3">
                <FavoriteButton animalId={animal.id} />
              </div>
            </div>

            {/* Thumbnails */}
            {animal.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {animal.photos.map((photo, i) => (
                  <div key={i} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 border-transparent hover:border-green-400 transition-colors">
                    <Image src={photo} alt={`${title} ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-2">{t('animal.description')}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
          </div>

          {/* Right: info + contact */}
          <div className="md:col-span-2 space-y-4">
            {/* Title & price */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">{category?.emoji}</span>
                <h1 className="font-bold text-gray-900 text-lg leading-snug flex-1">{title}</h1>
              </div>
              <div className="text-2xl font-bold text-green-700 mb-1">{formatPrice(animal.price)}</div>
              {animal.negotiable && (
                <span className="inline-block text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {t('animal.negotiable')}
                </span>
              )}

              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-gray-400 shrink-0" />
                  {animal.city}
                </div>
                {animal.age && (
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-gray-400 shrink-0" />
                    {animal.age}
                  </div>
                )}
                {animal.gender && animal.gender !== 'unknown' && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-base">{animal.gender === 'male' ? '♂' : '♀'}</span>
                    {t(`animal.${animal.gender}`)}
                  </div>
                )}
                {animal.breed && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">🏷</span>
                    {animal.breed}
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {animal.vaccinated && (
                  <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                    <CheckCircle size={12} /> {t('animal.vaccinated')}
                  </span>
                )}
                {animal.pedigree && (
                  <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                    <Award size={12} /> {t('animal.pedigree')}
                  </span>
                )}
              </div>
            </div>

            {/* Contact buttons */}
            {seller && (
              <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
                <h3 className="font-semibold text-gray-800 text-sm">{t('animal.seller_info')}</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
                    {seller.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{seller.name}</div>
                    <div className="text-xs text-gray-500">{seller.city}</div>
                  </div>
                </div>

                {/* WhatsApp */}
                <a
                  href={getWhatsAppLink(seller.phone, waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t('animal.contact_whatsapp')}
                </a>

                {/* Phone call */}
                <a
                  href={`tel:${seller.phone}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-green-700 font-semibold text-sm border-2 border-green-600 hover:bg-green-50 transition-colors"
                >
                  <Phone size={18} />
                  {t('animal.call_seller')}
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

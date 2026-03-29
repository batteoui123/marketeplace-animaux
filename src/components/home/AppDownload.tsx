import Image from 'next/image';
import type { Locale } from '@/lib/types';

interface Props {
  locale: Locale;
}

const TEXTS = {
  ar: {
    title: 'حمّل التطبيق الآن',
    subtitle: 'حمّل تطبيقنا وتصفح آلاف الإعلانات، تواصل مع البائعين، واحفظ مفضلاتك — كل ذلك من هاتفك',
    badge_ios: 'تحميل من',
    store_ios: 'App Store',
    badge_android: 'تحميل من',
    store_android: 'Google Play',
    soon: 'قريباً',
  },
  fr: {
    title: "Télécharger l'application",
    subtitle: "Téléchargez notre application et facilitez vos achats pour vos animaux — disponible sur iOS et Android",
    badge_ios: 'Télécharger sur',
    store_ios: 'App Store',
    badge_android: 'Disponible sur',
    store_android: 'Google Play',
    soon: 'Bientôt',
  },
  en: {
    title: 'Download the App',
    subtitle: 'Browse thousands of listings, contact sellers, and save your favorites — all from your phone',
    badge_ios: 'Download on the',
    store_ios: 'App Store',
    badge_android: 'Get it on',
    store_android: 'Google Play',
    soon: 'Coming Soon',
  },
};

export default function AppDownload({ locale }: Props) {
  const tx = TEXTS[locale];

  return (
    <section
      className="relative overflow-hidden py-14 md:py-20 px-4"
      style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #0f1f38 60%, #1a3a5c 100%)' }}
    >
      {/* Background blurred cat photo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
        <Image
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&h=600&fit=crop"
          alt=""
          fill
          className="object-cover object-center blur-sm scale-110"
          sizes="100vw"
          priority={false}
        />
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-20 -start-20 w-64 h-64 rounded-full opacity-5 pointer-events-none"
        style={{ background: '#0EA5E9' }} />
      <div className="absolute -bottom-16 -end-16 w-80 h-80 rounded-full opacity-5 pointer-events-none"
        style={{ background: '#E67E22' }} />

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-6">

        {/* ─── Left: text + buttons ─── */}
        <div className="flex-1 text-white text-center md:text-start order-2 md:order-1">
          {/* Small eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium text-sky-200 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#0EA5E9] animate-pulse" />
            {tx.soon}
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
            {tx.title}
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
            {tx.subtitle}
          </p>

          {/* Store buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            {/* App Store */}
            <a
              href="#"
              className="flex items-center gap-3 bg-white text-[#1B2A4A] rounded-2xl px-5 py-3 hover:bg-slate-100 transition-colors shadow-lg min-w-[160px]"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0 fill-current">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-start leading-tight">
                <div className="text-[10px] text-slate-500 font-normal">{tx.badge_ios}</div>
                <div className="font-bold text-sm">{tx.store_ios}</div>
              </div>
            </a>

            {/* Google Play */}
            <a
              href="#"
              className="flex items-center gap-3 bg-white text-[#1B2A4A] rounded-2xl px-5 py-3 hover:bg-slate-100 transition-colors shadow-lg min-w-[160px]"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0 fill-current">
                <path d="M3.18 23.76c.3.17.64.24.99.2l12.1-12.1L13.1 8.7 3.18 23.76zm17.25-10.7l-2.79-1.6L14.4 14.5l3.24 3.24 2.79-1.6a1.6 1.6 0 000-2.78v-.1zm-17.6-11.2a1.6 1.6 0 00-.65 1.38v19.52c0 .56.24 1.04.65 1.38L14.1 12 2.83 1.86zm10.98 10.88l3.17-3.17-2.79-1.6L3.18.24l9.93 12.5z"/>
              </svg>
              <div className="text-start leading-tight">
                <div className="text-[10px] text-slate-500 font-normal">{tx.badge_android}</div>
                <div className="font-bold text-sm">{tx.store_android}</div>
              </div>
            </a>
          </div>

          {/* Mini features */}
          <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
            {[
              { icon: '🔔', label: locale === 'ar' ? 'إشعارات فورية' : locale === 'fr' ? 'Notifications push' : 'Push notifications' },
              { icon: '❤️', label: locale === 'ar' ? 'حفظ المفضلة' : locale === 'fr' ? 'Sauvegarde favoris' : 'Save favorites' },
              { icon: '💬', label: locale === 'ar' ? 'واتساب مباشر' : locale === 'fr' ? 'WhatsApp direct' : 'Direct WhatsApp' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-1.5 text-slate-300 text-xs">
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Right: phone mockups ─── */}
        <div className="flex-1 flex justify-center items-end order-1 md:order-2 relative h-64 md:h-80 w-full max-w-sm mx-auto">
          {/* Back phone (slightly offset) */}
          <div
            className="absolute bottom-0 end-4 md:end-8 w-36 md:w-44 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/20"
            style={{ height: '260px', zIndex: 1, transform: 'rotate(6deg) translateY(-8px)' }}
          >
            {/* Phone screen */}
            <div className="w-full h-full bg-[#0EA5E9] relative overflow-hidden">
              <div className="bg-white/20 mx-2 mt-3 rounded-xl p-2 space-y-1.5">
                {[
                  { color: '#fff', h: '40px', label: '🐱', price: '3,500 MAD' },
                  { color: '#fff', h: '40px', label: '🐶', price: '7,000 MAD' },
                  { color: '#fff', h: '40px', label: '🦜', price: '12,000 MAD' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/90 rounded-lg p-1.5 flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-md bg-sky-100 flex items-center justify-center text-base shrink-0">{item.label}</div>
                    <div className="flex-1 min-w-0">
                      <div className="h-1.5 bg-slate-200 rounded w-3/4 mb-1" />
                      <div className="text-[9px] font-bold text-orange-500">{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Notch */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/30 rounded-full" />
            </div>
          </div>

          {/* Front phone */}
          <div
            className="relative w-40 md:w-48 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/30"
            style={{ height: '290px', zIndex: 2, transform: 'rotate(-4deg)' }}
          >
            {/* Status bar */}
            <div className="absolute top-0 w-full h-6 bg-[#1B2A4A] z-10 flex items-center justify-center">
              <div className="w-14 h-2 bg-black/40 rounded-full" />
            </div>

            {/* App screenshot simulation */}
            <div className="w-full h-full flex flex-col" style={{ background: '#F8FAFC' }}>
              {/* App header */}
              <div className="pt-6 pb-2 px-2" style={{ background: 'linear-gradient(135deg, #1B2A4A, #0f1f38)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-[10px]">🐾 AnimalSouk</span>
                  <div className="w-4 h-4 rounded-full bg-white/20" />
                </div>
                <div className="mt-1.5 bg-white/20 rounded-lg h-5 w-full" />
              </div>

              {/* Cards grid */}
              <div className="flex-1 p-1.5 grid grid-cols-2 gap-1 overflow-hidden">
                {[
                  { photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=80&h=60&fit=crop', price: '3,500' },
                  { photo: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=80&h=60&fit=crop', price: '7,000' },
                  { photo: 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=80&h=60&fit=crop', price: '12,000' },
                  { photo: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=80&h=60&fit=crop', price: '85,000' },
                ].map((card, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="relative h-10">
                      <Image src={card.photo} alt="" fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="px-1 py-0.5">
                      <div className="h-1 bg-slate-200 rounded w-full mb-0.5" />
                      <div className="text-[8px] font-bold text-orange-500">{card.price} MAD</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom nav */}
              <div className="bg-white border-t border-slate-100 py-1 flex justify-around">
                {['🏠', '🔍', '❤️', '👤'].map((icon, i) => (
                  <span key={i} className={`text-sm ${i === 0 ? 'opacity-100' : 'opacity-30'}`}>{icon}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

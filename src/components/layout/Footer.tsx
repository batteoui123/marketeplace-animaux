'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Mail, Phone } from 'lucide-react';

const Facebook = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Instagram = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Twitter = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

export default function Footer() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params?.locale as string) ?? 'ar';

  const catLinks = [
    { slug: 'cats', label: t('categories.cats') },
    { slug: 'dogs', label: t('categories.dogs') },
    { slug: 'birds', label: t('categories.birds') },
    { slug: 'horses', label: t('categories.horses') },
    { slug: 'parrots', label: t('categories.parrots') },
    { slug: 'reptiles', label: t('categories.reptiles') },
  ];

  return (
    <footer style={{ background: '#1B2A4A' }} className="text-slate-300 mt-auto">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6)' }}>
              <span className="text-lg">🐾</span>
            </div>
            <div>
              <span className="font-extrabold text-white text-lg">Animal</span>
              <span className="font-extrabold text-[#0EA5E9] text-lg">Souk</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-400 mb-4">
            {locale === 'ar' ? 'أفضل سوق للحيوانات في المغرب. بائعون موثوقون، إعلانات معتمدة.' : locale === 'fr' ? "Le meilleur marché d'animaux au Maroc. Vendeurs vérifiés, annonces validées." : "Morocco's best animal marketplace. Verified sellers, validated listings."}
          </p>
          <div className="flex gap-3">
            {[
              { icon: <Facebook size={16} />, href: '#' },
              { icon: <Instagram size={16} />, href: '#' },
              { icon: <Twitter size={16} />, href: '#' },
            ].map((s, i) => (
              <a key={i} href={s.href} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#0EA5E9] transition-colors text-slate-300 hover:text-white">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('nav.categories')}</h3>
          <div className="space-y-2 text-sm">
            {catLinks.map((cat) => (
              <Link key={cat.slug} href={`/${locale}/categories/${cat.slug}`}
                className="block text-slate-400 hover:text-[#0EA5E9] transition-colors">
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
            {locale === 'ar' ? 'روابط مفيدة' : locale === 'fr' ? 'Liens utiles' : 'Useful Links'}
          </h3>
          <div className="space-y-2 text-sm">
            {[
              { href: `/${locale}/seller/register`, label: t('nav.register') },
              { href: `/${locale}/seller/login`, label: t('nav.login') },
              { href: `/${locale}/animals`, label: t('nav.animals') },
              { href: `/${locale}/favorites`, label: t('nav.favorites') },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="block text-slate-400 hover:text-[#0EA5E9] transition-colors">{l.label}</Link>
            ))}
            <a href="#" className="block text-slate-400 hover:text-[#0EA5E9] transition-colors">
              {locale === 'ar' ? 'سياسة الخصوصية' : locale === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}
            </a>
            <a href="#" className="block text-slate-400 hover:text-[#0EA5E9] transition-colors">
              {locale === 'ar' ? 'شروط الاستخدام' : locale === 'fr' ? "Conditions d'utilisation" : 'Terms of Use'}
            </a>
          </div>
        </div>

        {/* Contact + App */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
            {locale === 'ar' ? 'تواصل معنا' : locale === 'fr' ? 'Contact' : 'Contact'}
          </h3>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Mail size={14} className="text-[#0EA5E9] shrink-0" />
              <span>contact@animalsouk.ma</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone size={14} className="text-[#0EA5E9] shrink-0" />
              <span>+212 6XX XXX XXX</span>
            </div>
          </div>
          <div className="space-y-2">
            <a href="#" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-3 py-2.5 text-sm text-white">
              <span className="text-lg">🍎</span>
              <div>
                <div className="text-[10px] text-slate-400 leading-tight">{t('home.app_available')}</div>
                <div className="font-semibold text-sm leading-tight">App Store</div>
              </div>
            </a>
            <a href="#" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-3 py-2.5 text-sm text-white">
              <span className="text-lg">▶️</span>
              <div>
                <div className="text-[10px] text-slate-400 leading-tight">{t('home.app_available')}</div>
                <div className="font-semibold text-sm leading-tight">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© 2024 AnimalSouk. {locale === 'ar' ? 'جميع الحقوق محفوظة' : locale === 'fr' ? 'Tous droits réservés' : 'All rights reserved'}.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">{locale === 'ar' ? 'سياسة الخصوصية' : locale === 'fr' ? 'Confidentialité' : 'Privacy'}</a>
            <a href="#" className="hover:text-slate-300 transition-colors">{locale === 'ar' ? 'شروط الاستخدام' : locale === 'fr' ? 'CGU' : 'Terms'}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

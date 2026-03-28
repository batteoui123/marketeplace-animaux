'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { MOCK_SELLERS } from '@/lib/mock-data';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LoginPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const setCurrentSeller = useStore((s) => s.setCurrentSeller);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock auth: accept any seller with matching phone
    const seller = MOCK_SELLERS.find((s) => s.phone === phone || s.phone.endsWith(phone.slice(-9)));
    if (seller && password.length >= 4) {
      setCurrentSeller(seller);
      router.push(`/${locale}/seller/dashboard`);
    } else {
      setError(locale === 'ar' ? 'رقم الهاتف أو كلمة المرور غير صحيحة' : locale === 'fr' ? 'Numéro ou mot de passe incorrect' : 'Incorrect phone or password');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🐾</div>
            <h1 className="text-2xl font-bold text-gray-900">{t('seller.login_title')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('seller.phone')}</label>
              <div className="relative">
                <Phone size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+212XXXXXXXXX"
                  required
                  className="w-full ps-9 pe-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('seller.password')}</label>
              <div className="relative">
                <Lock size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={4}
                  className="w-full ps-9 pe-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              {t('seller.login_btn')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            {t('seller.no_account')}{' '}
            <Link href={`/${locale}/seller/register`} className="text-green-700 font-medium hover:underline">
              {t('nav.register')}
            </Link>
          </p>

          <div className="mt-4 bg-green-50 rounded-xl p-3 text-xs text-gray-600 text-center">
            {locale === 'ar' ? 'للتجربة: أدخل +212661234567 وأي كلمة مرور' : locale === 'fr' ? "Démo: +212661234567 + n'importe quel mot de passe" : 'Demo: +212661234567 + any password'}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Phone, Lock, User, MapPin } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { CITIES } from '@/lib/constants';
import type { Seller } from '@/lib/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RegisterPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const setCurrentSeller = useStore((s) => s.setCurrentSeller);

  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const set = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError(locale === 'ar' ? 'كلمة المرور غير متطابقة' : locale === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match');
      return;
    }
    // Mock registration
    const newSeller: Seller = {
      id: `s${Date.now()}`,
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      city: form.city,
      createdAt: new Date(),
      totalAds: 0,
    };
    setCurrentSeller(newSeller);
    router.push(`/${locale}/seller/dashboard`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🐾</div>
            <h1 className="text-2xl font-bold text-gray-900">{t('seller.register_title')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('seller.name')}</label>
              <div className="relative">
                <User size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)}
                  className="w-full ps-9 pe-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('seller.phone')}</label>
              <div className="relative">
                <Phone size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" required placeholder="+212XXXXXXXXX" value={form.phone} onChange={(e) => set('phone', e.target.value)}
                  className="w-full ps-9 pe-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('seller.email_optional')}</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('seller.city')}</label>
              <div className="relative">
                <MapPin size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select required value={form.city} onChange={(e) => set('city', e.target.value)}
                  className="w-full ps-9 pe-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                  <option value=""></option>
                  {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('seller.password')}</label>
              <div className="relative">
                <Lock size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" required minLength={6} value={form.password} onChange={(e) => set('password', e.target.value)}
                  className="w-full ps-9 pe-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('seller.confirm_password')}</label>
              <div className="relative">
                <Lock size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" required minLength={6} value={form.confirm} onChange={(e) => set('confirm', e.target.value)}
                  className="w-full ps-9 pe-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            <button type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
              {t('seller.register_btn')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            {t('seller.have_account')}{' '}
            <Link href={`/${locale}/seller/login`} className="text-green-700 font-medium hover:underline">{t('nav.login')}</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

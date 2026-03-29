'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '@/stores/useStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdForm from '@/components/seller/AdForm';
import type { Locale } from '@/lib/types';

export default function NewAdPage() {
  const params = useParams();
  const locale = (params.locale as Locale) ?? 'ar';
  const router = useRouter();
  const currentSeller = useStore((s) => s.currentSeller);

  useEffect(() => {
    if (!currentSeller) router.push(`/${locale}/seller/login`);
  }, [currentSeller, locale, router]);

  if (!currentSeller) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        <AdForm />
      </main>
      <Footer />
    </div>
  );
}

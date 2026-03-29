'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '@/stores/useStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdForm from '@/components/seller/AdForm';
import type { Locale, Animal } from '@/lib/types';
import { MOCK_ANIMALS } from '@/lib/mock-data';

export default function EditAdPage() {
  const params = useParams();
  const locale = (params.locale as Locale) ?? 'ar';
  const id = params.id as string;
  const router = useRouter();
  
  const currentSeller = useStore((s) => s.currentSeller);
  const pendingAnimals = useStore((s) => s.pendingAnimals);

  const [initialData, setInitialData] = useState<Animal | null>(null);

  useEffect(() => {
    if (!currentSeller) {
      router.push(`/${locale}/seller/login`);
      return;
    }

    // Combine pending and approved animals matching the seller
    const animal = pendingAnimals.find(a => a.id === id && a.sellerId === currentSeller.id) 
                || MOCK_ANIMALS.find(a => a.id === id && a.sellerId === currentSeller.id);
                
    if (!animal) {
      router.push(`/${locale}/seller/dashboard`);
    } else {
      setInitialData(animal);
    }
  }, [currentSeller, locale, router, id, pendingAnimals]);

  if (!currentSeller || !initialData) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        <AdForm initialData={initialData} isEdit />
      </main>
      <Footer />
    </div>
  );
}

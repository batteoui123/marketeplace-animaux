'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { Search } from 'lucide-react';

interface Props {
  initialValue?: string;
}

export default function SearchBar({ initialValue = '' }: Props) {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/animals?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('home.search_placeholder')}
          className="w-full ps-10 pe-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-3 rounded-2xl font-medium text-sm hover:bg-green-700 transition-colors shadow-sm shrink-0"
      >
        {t('home.search_btn')}
      </button>
    </form>
  );
}

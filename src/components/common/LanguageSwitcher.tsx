'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState } from 'react';

const LANGS = [
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export default function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = params.locale as string;
  const [open, setOpen] = useState(false);

  const switchLocale = (locale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 p-2 text-slate-500 hover:text-[#0EA5E9] transition-colors rounded-lg hover:bg-sky-50"
      >
        <Globe size={18} />
        <span className="text-xs font-semibold uppercase hidden sm:block">{currentLocale}</span>
      </button>
      {open && (
        <div className="absolute end-0 top-full mt-1 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 py-1 z-50">
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`w-full flex items-center gap-2.5 text-start px-4 py-2.5 text-sm transition-colors hover:bg-sky-50 hover:text-[#0EA5E9] ${
                currentLocale === lang.code ? 'text-[#0EA5E9] font-semibold bg-sky-50' : 'text-slate-700'
              }`}
            >
              <span>{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

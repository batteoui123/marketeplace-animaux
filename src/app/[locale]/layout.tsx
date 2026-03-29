import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Cairo } from 'next/font/google';
import { routing } from '@/i18n/routing';
import WhatsAppFloat from '@/components/common/WhatsAppFloat';
import '../globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'AnimalSouk — سوق الحيوانات بالمغرب',
  description: 'أفضل سوق لبيع وشراء الحيوانات في المغرب. بيع واشري الحيوانات فالمغرب بكل سهولة.',
  openGraph: {
    title: 'AnimalSouk — سوق الحيوانات بالمغرب',
    description: 'أفضل سوق لبيع وشراء الحيوانات في المغرب',
    siteName: 'AnimalSouk',
    locale: 'ar_MA',
    type: 'website',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ar' | 'fr' | 'en')) {
    notFound();
  }
  const messages = await getMessages();
  const isRtl = locale === 'ar';

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? cairo.variable : ''}>
      <body className={`min-h-screen flex flex-col ${isRtl ? 'font-cairo' : ''}`} style={{ background: '#F8FAFC' }}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <WhatsAppFloat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

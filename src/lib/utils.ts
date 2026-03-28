import type { Locale } from './types';
import { WHATSAPP_BASE } from './constants';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-MA').format(price) + ' MAD';
}

export function getWhatsAppLink(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const encoded = message ? `?text=${encodeURIComponent(message)}` : '';
  return `${WHATSAPP_BASE}${cleaned}${encoded}`;
}

export function getLocalizedText(
  obj: { ar: string; fr: string; en: string },
  locale: Locale
): string {
  return obj[locale];
}

export function timeAgo(date: Date, locale: Locale): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) return locale === 'ar' ? 'منذ قليل' : locale === 'fr' ? 'À l\'instant' : 'Just now';
    return locale === 'ar' ? `منذ ${hours} ساعة` : locale === 'fr' ? `il y a ${hours}h` : `${hours}h ago`;
  }
  if (days < 30) {
    return locale === 'ar' ? `منذ ${days} يوم` : locale === 'fr' ? `il y a ${days}j` : `${days}d ago`;
  }
  const months = Math.floor(days / 30);
  return locale === 'ar' ? `منذ ${months} شهر` : locale === 'fr' ? `il y a ${months} mois` : `${months}mo ago`;
}

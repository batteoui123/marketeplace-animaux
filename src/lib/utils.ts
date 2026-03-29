import type { Locale, Seller, SellerBadge } from './types';
import { WHATSAPP_BASE } from './constants';

export function formatPrice(price: number, locale?: Locale): string {
  const formatted = new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(price);
  if (locale === 'ar') return formatted + ' درهم';
  return formatted + ' DH';
}

export function getWhatsAppLink(phone: string, message?: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '212' + cleaned.slice(1);
  } else if (!cleaned.startsWith('212')) {
    cleaned = '212' + cleaned;
  }
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

export function getSellerBadges(seller: Seller): SellerBadge[] {
  const badges: SellerBadge[] = [];
  if (seller.isVerified) badges.push('verified');
  if (seller.totalAds >= 5) badges.push('active');
  if (seller.totalAds >= 10) badges.push('top');
  return badges;
}

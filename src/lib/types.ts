export interface Animal {
  id: string;
  sellerId: string;
  title: { ar: string; fr: string; en: string };
  description: { ar: string; fr: string; en: string };
  price: number;
  negotiable: boolean;
  category: string;
  subCategory?: string;
  breed?: string;
  age?: string;
  gender?: 'male' | 'female' | 'unknown';
  city: string;
  photos: string[];
  videos?: string[];
  vaccinated?: boolean;
  pedigree?: boolean;
  weight?: string;
  color?: string;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Seller {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  avatar?: string;
  createdAt: Date;
  totalAds: number;
  rating?: number;
  isVerified?: boolean;
}

export type SellerBadge = 'verified' | 'active' | 'top';

export interface Category {
  slug: string;
  emoji: string;
  image: string;
  color: string;
  label: { ar: string; fr: string; en: string };
  subCategories?: string[];
}

export type Locale = 'ar' | 'fr' | 'en';

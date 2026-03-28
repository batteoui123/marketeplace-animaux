import type { Category } from './types';

export const CATEGORIES: Category[] = [
  {
    slug: 'cats',
    emoji: '🐱',
    label: { ar: 'قطط', fr: 'Chats', en: 'Cats' },
    subCategories: ['Persan', 'Siamois', 'Maine Coon', 'British Shorthair', 'Bengal', 'Abyssin'],
  },
  {
    slug: 'dogs',
    emoji: '🐶',
    label: { ar: 'كلاب', fr: 'Chiens', en: 'Dogs' },
    subCategories: ['Berger Allemand', 'Husky', 'Labrador', 'Golden Retriever', 'Caniche', 'Chihuahua'],
  },
  {
    slug: 'birds',
    emoji: '🐦',
    label: { ar: 'طيور', fr: 'Oiseaux', en: 'Birds' },
    subCategories: ['Canari', 'Pinson', 'Tourterelle', 'Myna'],
  },
  {
    slug: 'fish',
    emoji: '🐟',
    label: { ar: 'أسماك', fr: 'Poissons', en: 'Fish' },
    subCategories: ['Poisson rouge', 'Betta', 'Guppy', 'Koi'],
  },
  {
    slug: 'horses',
    emoji: '🐴',
    label: { ar: 'خيول', fr: 'Chevaux', en: 'Horses' },
    subCategories: ['Pur-sang', 'Arabe', 'Berber'],
  },
  {
    slug: 'livestock',
    emoji: '🐄',
    label: { ar: 'مواشي', fr: 'Bétail', en: 'Livestock' },
    subCategories: ['Vaches', 'Moutons', 'Chèvres'],
  },
  {
    slug: 'rodents',
    emoji: '🐰',
    label: { ar: 'قوارض وأرانب', fr: 'Rongeurs & Lapins', en: 'Rodents & Rabbits' },
    subCategories: ['Lapin', 'Cochon d\'Inde', 'Hamster'],
  },
  {
    slug: 'reptiles',
    emoji: '🦎',
    label: { ar: 'زواحف', fr: 'Reptiles', en: 'Reptiles' },
    subCategories: ['Gecko', 'Iguane', 'Caméléon'],
  },
  {
    slug: 'turtles',
    emoji: '🐢',
    label: { ar: 'سلاحف', fr: 'Tortues', en: 'Turtles' },
    subCategories: [],
  },
  {
    slug: 'parrots',
    emoji: '🦜',
    label: { ar: 'ببغاوات', fr: 'Perroquets', en: 'Parrots' },
    subCategories: ['Ara', 'Cacatoès', 'Perruche'],
  },
  {
    slug: 'other',
    emoji: '🐝',
    label: { ar: 'أخرى', fr: 'Autres', en: 'Others' },
    subCategories: [],
  },
];

export const CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
  'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Salé', 'Nador',
  'Mohammedia', 'El Jadida', 'Béni Mellal', 'Taza', 'Khémisset',
  'Settat', 'Berrechid', 'Khouribga', 'Safi', 'Laâyoune',
  'Errachidia', 'Guelmim', 'Dakhla', 'Autres',
];

export const WHATSAPP_BASE = 'https://wa.me/';

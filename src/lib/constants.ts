import type { Category } from './types';

export const CATEGORIES: Category[] = [
  {
    slug: 'cats',
    emoji: '🐱',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=280&h=280&fit=crop&crop=face',
    color: '#EC4899',
    label: { ar: 'قطط', fr: 'Chats', en: 'Cats' },
    subCategories: ['Persan', 'Siamois', 'Maine Coon', 'British Shorthair', 'Bengal', 'Abyssin'],
  },
  {
    slug: 'dogs',
    emoji: '🐶',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=280&h=280&fit=crop&crop=face',
    color: '#F59E0B',
    label: { ar: 'كلاب', fr: 'Chiens', en: 'Dogs' },
    subCategories: ['Berger Allemand', 'Husky', 'Labrador', 'Golden Retriever', 'Caniche', 'Chihuahua'],
  },
  {
    slug: 'birds',
    emoji: '🐦',
    image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=280&h=280&fit=crop',
    color: '#0EA5E9',
    label: { ar: 'طيور', fr: 'Oiseaux', en: 'Birds' },
    subCategories: ['Canari', 'Pinson', 'Tourterelle', 'Myna'],
  },
  {
    slug: 'fish',
    emoji: '🐟',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=280&h=280&fit=crop',
    color: '#06B6D4',
    label: { ar: 'أسماك', fr: 'Poissons', en: 'Fish' },
    subCategories: ['Poisson rouge', 'Betta', 'Guppy', 'Koi'],
  },
  {
    slug: 'horses',
    emoji: '🐴',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=280&h=280&fit=crop',
    color: '#92400E',
    label: { ar: 'خيول', fr: 'Chevaux', en: 'Horses' },
    subCategories: ['Pur-sang', 'Arabe', 'Berber'],
  },
  {
    slug: 'livestock',
    emoji: '🐄',
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=280&h=280&fit=crop',
    color: '#16A34A',
    label: { ar: 'مواشي', fr: 'Bétail', en: 'Livestock' },
    subCategories: ['Vaches', 'Moutons', 'Chèvres'],
  },
  {
    slug: 'rodents',
    emoji: '🐰',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=280&h=280&fit=crop',
    color: '#E67E22',
    label: { ar: 'قوارض وأرانب', fr: 'Rongeurs & Lapins', en: 'Rodents & Rabbits' },
    subCategories: ["Lapin", "Cochon d'Inde", 'Hamster'],
  },
  {
    slug: 'reptiles',
    emoji: '🦎',
    image: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd659e3?w=280&h=280&fit=crop',
    color: '#84CC16',
    label: { ar: 'زواحف', fr: 'Reptiles', en: 'Reptiles' },
    subCategories: ['Gecko', 'Iguane', 'Caméléon'],
  },
  {
    slug: 'turtles',
    emoji: '🐢',
    image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=280&h=280&fit=crop',
    color: '#10B981',
    label: { ar: 'سلاحف', fr: 'Tortues', en: 'Turtles' },
    subCategories: [],
  },
  {
    slug: 'parrots',
    emoji: '🦜',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=280&h=280&fit=crop',
    color: '#8B5CF6',
    label: { ar: 'ببغاوات', fr: 'Perroquets', en: 'Parrots' },
    subCategories: ['Ara', 'Cacatoès', 'Perruche'],
  },
  {
    slug: 'other',
    emoji: '🐝',
    image: 'https://images.unsplash.com/photo-1425082661507-d6d2f600be90?w=280&h=280&fit=crop',
    color: '#6B7280',
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

export const POPULAR_SEARCHES = [
  { ar: 'هاسكي كازابلانكا', fr: 'Husky Casablanca', en: 'Husky Casablanca' },
  { ar: 'قط شيرازي', fr: 'Chat Persan', en: 'Persian Cat' },
  { ar: 'ببغاء متكلم', fr: 'Perroquet parleur', en: 'Talking Parrot' },
  { ar: 'حصان عربي الرباط', fr: 'Cheval Arabe Rabat', en: 'Arabian Horse Rabat' },
  { ar: 'كناري مغرد', fr: 'Canari chanteur', en: 'Singing Canary' },
  { ar: 'لابرادور جرو', fr: 'Labrador chiot', en: 'Labrador Puppy' },
  { ar: 'سلحفاة برية', fr: 'Tortue terrestre', en: 'Land Tortoise' },
  { ar: 'بنغالي أصيل', fr: 'Bengal pure race', en: 'Pure Bengal Cat' },
];

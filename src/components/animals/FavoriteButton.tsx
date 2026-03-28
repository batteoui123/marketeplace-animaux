'use client';

import { Heart } from 'lucide-react';
import { useStore } from '@/stores/useStore';

export default function FavoriteButton({ animalId }: { animalId: string }) {
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const isFav = useStore((s) => s.isFavorite(animalId));

  return (
    <button
      onClick={() => toggleFavorite(animalId)}
      className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:scale-110 transition-transform"
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart size={20} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
    </button>
  );
}

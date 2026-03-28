import AnimalCard from './AnimalCard';
import type { Animal } from '@/lib/types';

interface Props {
  animals: Animal[];
  emptyMessage?: string;
}

export default function AnimalGrid({ animals, emptyMessage }: Props) {
  if (animals.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-4">🔍</div>
        <p className="font-medium text-gray-600">{emptyMessage ?? 'Aucune annonce trouvée'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {animals.map((animal) => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </div>
  );
}

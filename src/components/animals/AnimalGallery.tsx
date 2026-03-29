'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

type MediaItem =
  | { type: 'photo'; src: string }
  | { type: 'video'; src: string };

interface Props {
  photos: string[];
  videos?: string[];
  title: string;
  animalId: string;
}

export default function AnimalGallery({ photos, videos = [], title, animalId }: Props) {
  // Build unified media list: videos first, then photos
  const mediaItems: MediaItem[] = [
    ...videos.map((src): MediaItem => ({ type: 'video', src })),
    ...photos.map((src): MediaItem => ({ type: 'photo', src })),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = mediaItems[selectedIndex] ?? { type: 'photo', src: 'https://placehold.co/800x600/DCFCE7/16a34a?text=🐾' };

  if (mediaItems.length === 0) {
    return (
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center text-5xl">
        🐾
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ── Main display ── */}
      <div className="relative rounded-2xl overflow-hidden bg-black">
        {selected.type === 'video' ? (
          <div className="aspect-video">
            <video
              key={selected.src}
              src={selected.src}
              className="w-full h-full object-contain"
              controls
              playsInline
            />
          </div>
        ) : (
          <div className="relative aspect-[4/3] bg-gray-100">
            <Image
              src={selected.src}
              alt={title}
              fill
              className="object-cover transition-opacity duration-200"
              priority={selectedIndex === 0}
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
        )}

        {/* Favorite button overlay */}
        <div className="absolute top-3 end-3 z-10">
          <FavoriteButton animalId={animalId} />
        </div>

        {/* Media counter badge */}
        {mediaItems.length > 1 && (
          <span className="absolute bottom-3 end-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {selectedIndex + 1} / {mediaItems.length}
          </span>
        )}
      </div>

      {/* ── Thumbnails strip ── */}
      {mediaItems.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scroll-hide">
          {mediaItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              aria-label={item.type === 'video' ? `Vidéo ${i + 1}` : `Photo ${i + 1}`}
              className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all focus:outline-none ${
                selectedIndex === i
                  ? 'border-green-500 shadow-md shadow-green-500/30'
                  : 'border-transparent hover:border-green-300 opacity-70 hover:opacity-100'
              }`}
            >
              {item.type === 'video' ? (
                /* Video thumbnail — dark bg + play icon */
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Play size={14} className="fill-white text-white ms-0.5" />
                  </div>
                </div>
              ) : (
                <Image
                  src={item.src}
                  alt={`${title} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}

              {/* Video badge */}
              {item.type === 'video' && (
                <span className="absolute bottom-1 start-1 bg-black/70 text-white text-[9px] px-1 rounded font-medium">
                  VID
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

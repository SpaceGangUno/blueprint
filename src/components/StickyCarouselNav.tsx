import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StickyCarouselNavProps {
  activeIndex: number;
  totalItems: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  carouselName: string;
}

const StickyCarouselNav: React.FC<StickyCarouselNavProps> = ({
  activeIndex,
  totalItems,
  onPrev,
  onNext,
  onSelect,
  carouselName
}) => {
  return (
    <div className="flex justify-between items-center mb-6 px-2 sticky top-16 z-10 bg-black/50 backdrop-blur-sm py-2 rounded-full mx-2 sm:mx-0 sm:static sm:bg-transparent sm:py-0 sm:backdrop-blur-none">
      <button 
        onClick={onPrev}
        className={`p-2 rounded-full bg-black/50 text-white backdrop-blur-sm ${activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'}`}
        disabled={activeIndex === 0}
        aria-label={`Previous ${carouselName}`}
      >
        <ChevronLeft size={24} />
      </button>
      
      <div className="flex gap-2">
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={`${carouselName}-${index}`}
            onClick={() => onSelect(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeIndex === index 
                ? 'bg-[#FF6B00] w-6' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to ${carouselName} ${index + 1}`}
          />
        ))}
      </div>
      
      <button 
        onClick={onNext}
        className={`p-2 rounded-full bg-black/50 text-white backdrop-blur-sm ${activeIndex === totalItems - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'}`}
        disabled={activeIndex === totalItems - 1}
        aria-label={`Next ${carouselName}`}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default StickyCarouselNav;

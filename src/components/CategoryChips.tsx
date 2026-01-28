import { Lock, SlidersHorizontal } from 'lucide-react';
import { categories } from '@/data/recipes';
import { Button } from '@/components/ui/button';

interface CategoryChipsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryChips({ activeCategory, onCategoryChange }: CategoryChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`category-chip whitespace-nowrap flex items-center gap-1.5 ${
            activeCategory === category ? 'category-chip-active' : 'category-chip-inactive'
          }`}
        >
          {category}
        </button>
      ))}
      
      <button className="category-chip category-chip-inactive whitespace-nowrap flex items-center gap-1.5">
        <Lock className="h-3.5 w-3.5" />
        Your saved recipes
      </button>

      <Button variant="ghost" size="icon" className="shrink-0 ml-auto">
        <SlidersHorizontal className="h-5 w-5" />
      </Button>
    </div>
  );
}

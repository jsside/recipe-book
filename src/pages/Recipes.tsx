import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { RecipeCard } from '@/components/RecipeCard';
import { CategoryChips } from '@/components/CategoryChips';
import { recipes, categories } from '@/data/recipes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Recipes() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const ingredientParam = searchParams.get('ingredient') || '';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(
    categoryParam || 'Dinner, sorted'
  );

  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Filter by category
    if (activeCategory && activeCategory !== 'Dinner, sorted') {
      filtered = filtered.filter(r =>
        r.category.some(cat =>
          cat.toLowerCase().includes(activeCategory.toLowerCase())
        )
      );
    } else if (activeCategory === 'Dinner, sorted') {
      filtered = filtered.filter(r => r.category.includes('Dinner'));
    }

    // Filter by ingredient
    if (ingredientParam) {
      filtered = filtered.filter(r =>
        r.ingredients.some(ing =>
          ing.name.toLowerCase().includes(ingredientParam.toLowerCase()) ||
          ing.category.toLowerCase().includes(ingredientParam.toLowerCase())
        )
      );
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.ingredients.some(ing => ing.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [activeCategory, ingredientParam, searchQuery]);

  return (
    <div className="min-h-screen py-8">
      <div className="container space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">
            {ingredientParam ? `${ingredientParam} Recipes` : 'All Recipes'}
          </h1>
          <p className="text-muted-foreground">
            {filteredRecipes.length} recipes found
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Category chips */}
        {!ingredientParam && (
          <CategoryChips
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        )}

        {/* Recipe grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="font-serif text-xl font-medium mb-2">No recipes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

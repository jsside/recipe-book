import { useState } from 'react';
import { Search } from 'lucide-react';
import { IngredientCard } from '@/components/IngredientCard';
import { ingredientCategories } from '@/data/recipes';
import { Input } from '@/components/ui/input';

export default function Ingredients() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIngredients = ingredientCategories.filter(ing =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container space-y-8">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">
            Browse by Ingredient
          </h1>
          <p className="text-muted-foreground">
            Find recipes based on what you have in your kitchen. Select an ingredient to see all recipes that feature it.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input pl-10"
          />
        </div>

        {/* Ingredients grid */}
        {filteredIngredients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredIngredients.map((ingredient, index) => (
              <div
                key={ingredient.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <IngredientCard ingredient={ingredient} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="font-serif text-xl font-medium mb-2">No ingredients found</h3>
            <p className="text-muted-foreground">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

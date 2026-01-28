import { Link } from 'react-router-dom';
import { Clock, Plus } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { useShoppingList } from '@/context/ShoppingListContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { addIngredients } = useShoppingList();

  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addIngredients(recipe.ingredients, recipe.id, recipe.title);
  };

  return (
    <Link to={`/recipe/${recipe.id}`} className="recipe-card group block">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {recipe.isFree && <span className="badge-free">Free</span>}
          {recipe.isTopRated && <span className="badge-top">Top 50</span>}
        </div>

        {/* Add to list button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 hover:bg-card"
          onClick={handleAddToList}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-serif font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{recipe.cookTime}</span>
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={recipe.chef.avatar} alt={recipe.chef.name} />
            <AvatarFallback>{recipe.chef.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{recipe.chef.name}</span>
        </div>
      </div>
    </Link>
  );
}

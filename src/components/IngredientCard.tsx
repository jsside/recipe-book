import { Link } from 'react-router-dom';
import { IngredientCategory } from '@/data/recipes';

interface IngredientCardProps {
  ingredient: IngredientCategory;
}

export function IngredientCard({ ingredient }: IngredientCardProps) {
  return (
    <Link
      to={`/recipes?ingredient=${encodeURIComponent(ingredient.name)}`}
      className="ingredient-card group flex items-center gap-4 hover:bg-secondary/80"
    >
      <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0">
        <img
          src={ingredient.image}
          alt={ingredient.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div>
        <h3 className="font-semibold group-hover:text-primary transition-colors">
          {ingredient.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {ingredient.recipeCount} recipes
        </p>
      </div>
    </Link>
  );
}

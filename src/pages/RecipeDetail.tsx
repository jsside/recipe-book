import { useParams, Link } from 'react-router-dom';
import { Clock, Users, ChevronLeft, Plus, Heart, Share2, Printer } from 'lucide-react';
import { recipes } from '@/data/recipes';
import { useShoppingList } from '@/context/ShoppingListContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';

export default function RecipeDetail() {
  const { id } = useParams();
  const { addIngredients } = useShoppingList();
  
  const recipe = recipes.find(r => r.id === id);

  if (!recipe) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Recipe not found</h1>
        <Link to="/">
          <Button>Back to home</Button>
        </Link>
      </div>
    );
  }

  const handleAddAllToList = () => {
    addIngredients(recipe.ingredients, recipe.id, recipe.title);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Back button */}
      <div className="container py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to recipes
        </Link>
      </div>

      {/* Hero */}
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="flex gap-2">
              {recipe.isFree && <span className="badge-free">Free</span>}
              {recipe.isTopRated && <span className="badge-top">Top 50</span>}
            </div>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
              {recipe.title}
            </h1>

            <p className="text-lg text-muted-foreground">
              {recipe.description}
            </p>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={recipe.chef.avatar} alt={recipe.chef.name} />
                <AvatarFallback>{recipe.chef.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{recipe.chef.name}</p>
                <p className="text-sm text-muted-foreground">Recipe creator</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button onClick={handleAddAllToList} className="btn-primary gap-2">
                <Plus className="h-4 w-4" />
                Add to Shopping List
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients & Instructions */}
      <div className="container mt-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold">Ingredients</h2>
                <span className="text-sm text-muted-foreground">
                  {recipe.servings} servings
                </span>
              </div>

              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <Checkbox />
                    <span>
                      {ingredient.amount} {ingredient.unit} {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={handleAddAllToList}
                variant="outline"
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Add all to list
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-serif text-2xl font-bold">Method</h2>
            <ol className="space-y-6">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-lg pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
